<template >
  <v-app style="overflow:auto;height:100vh;">
    <v-card tile>
      <v-list flat>
        <v-subheader>好友</v-subheader>
        <v-list-item-group v-model="selectedItem" color="primary">
          <v-list-item @click="sheet = true">
            <v-list-item-icon>
              <van-icon name="friends-o" :badge="friendList.length" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>&nbsp;好友申请</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>

    <v-card tile class="my-2">
      <v-list flat>
        <v-subheader>列表</v-subheader>
        <v-list-item-group v-model="selectedItem" color="primary">
          <van-cell :icon="room.img" :title="room.name" v-for="(room, index) in rooms" :key="index"  @click="gotochat(room)"/>
        </v-list-item-group>
      </v-list>
    </v-card>



    <v-bottom-sheet v-model="sheet">
      <v-sheet class="text-center" height="200px">
        <v-list>
          <v-list-item v-for="friend in friendList" :key="friend">
            <v-list-item-avatar>
                <v-img :src="friend.IMG"/>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-text="friend.DISPLAY_NAME"></v-list-item-title>

              <!-- <v-list-item-subtitle
                v-text="file.subtitle"
              ></v-list-item-subtitle> -->
            </v-list-item-content>

            <v-list-item-action @click="addFriend(friend.USER_NAME)">
              <v-btn icon>
                <v-icon color="grey lighten-1">mdi-checkbox-marked-circle</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-sheet>
    </v-bottom-sheet>
  </v-app>
</template>

<script>
import fsCfg from "../../../assets/js/fw";
import framework from "../../../assets/js/framework";
import { Toast } from "vant";
import * as signalR from "@microsoft/signalr";

let hubUrl = fsCfg.chatHub(); //";//
// .net core 版本中默认不会自动重连，需手动调用 withAutomaticReconnect
const connection = new signalR.HubConnectionBuilder()
  .withAutomaticReconnect([0, 3000, 5000, 10000, 15000, 30000])
  .withUrl(hubUrl)
  .build();
connection.onreconnecting((error) => {
  const status = 'Connection lost due to error "${error}"';
  console.log(error);
});
connection.start().catch(function(err) {});

export default {
  serviceUrl: {
    API_USER_INFO: "/api/values/GetUserInfo?username={0}",
    API_REGISTER: "/api/values/SignUp",
    API_UpdateList:
      "/api/values/UpdateList?groupId={0}&groupName={1}&users={2}",
    API_INIT_GROUP: "/api/values/GetChatList?username={0}",
  },
  data: () => ({
    sheet: false,
    selectedItem: 1,
    items: [
      { text: "Real-Time", icon: "mdi-clock" },
      { text: "Audience", icon: "mdi-account" },
      { text: "Conversions", icon: "mdi-flag" },
    ],
    friendApply: 0,
    friendList: [],
    username: framework.getStorage("user"),
    displayname: framework.getStorage("displayname"),
    rooms:[]
  }),
  methods: {
    gotochat(room) {
      this.$router.push({
        path: "/",
        query: { roomnumber: room.number, room_name: room.name },
      });
    },
    submit() {
      let self = this;
      fsCfg.postData(
        this.$options.serviceUrl.API_REGISTER,
        JSON.stringify({
          img: self.userinfo.IMG,
          username: self.userinfo.USER_NAME,
          displayname: self.userinfo.DISPLAY_NAME,
          password: self.userinfo.PASSWORD,
          oldpassword: self.userinfo.PASSWORD,
          isedit: "Y",
        }),
        function(res) {
          if (res.success) {
            Toast("保存成功！");
            self.isEdit = false;
          } else {
            Toast(res.message.content);
          }
        }
      );
    },
    addImg(e) {
      let self = this;
      let files = e.target.files || e.dataTransfer.files;
      let reader = new FileReader();

      //将图片转成base64格式
      reader.readAsDataURL(files[0]);
      reader.onloadend = function() {
        self.userinfo.IMG = this.result;
        var msg = {
          access_token: "fcb05eac14cddd1d4e0f2450a4fde6b5",
          content: self.userinfo.IMG.split(",")[1],
          message: "上传一张图片",
        };
        fsCfg.uploadImage(files[0].name, JSON.stringify(msg), function(rs) {
          if (rs == 400) {
            self.userinfo.IMG =
              "https://gitee.com/eeegirlsdream/picture/raw/master/" +
              files[0].name;
          } else {
            self.userinfo.IMG = rs.content.download_url;
          }
        });
      };
    },
    init: function() {
      let _this = this;
      var url = framework.strFormat(
        _this.$options.serviceUrl.API_USER_INFO,
        _this.username
      );
      fsCfg.getData(url, function(res) {
        if (res.success) {
          _this.userinfo = res.data;
          console.log(res.data);
        } else {
          Toast(res.message.content);
        }
      });
    },
    addFriend(apply, to) {
      let self = this;
      var rn = apply + ";" + this.username;
      var url = framework.strFormat(
        this.$options.serviceUrl.API_UpdateList,
        rn,
        "friend",
        this.username
      );
      fsCfg.getData(url, function(res) {
        var index = self.friendList.findIndex(v=>v.USER_NAME == apply);
        self.friendList.splice(index, 1);
        self.sheet = false;
        self.initGroup();
      });
    },
    initGroup() {
      let self = this;
      var url = framework.strFormat(
        this.$options.serviceUrl.API_INIT_GROUP,
        this.username
      );
      fsCfg.getData(url, function(res) {
        if (res.success) {
          self.rooms = [];

          for (let index = 0; index < res.data.length; index++) {
            let element = res.data[index];
            let rm = {
              number: element.GROUP_ID,
              name: element.GROUP_NAME,
              img:
                element.ID == undefined
                  ? "https://img01.yzcdn.cn/vant/logo.png"
                  : element.ID,
            };
            self.rooms.push(rm);
          }
        } else {
          Toast(res.message.content);
        }
      });
    },
  },
  mounted() {
    let self = this;
    this.initGroup();
    //this.init();
    window.setTimeout(() => {
      connection.on("AddFriend", function(apply, to) {
        if (to == self.username) {
          //self.friendApply++;
          var url = framework.strFormat(
            self.$options.serviceUrl.API_USER_INFO,
            apply
          );
          fsCfg.getData(url, function(res) {
            if (res.success) {
              self.friendList.push(res.data);
            } else {
              Toast(res.message.content);
            }
          });
        }
      });
    }, 1000);
  },
};
</script>
