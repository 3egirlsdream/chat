<template>
  <v-app>
    <section style="margin-top:0.5em;">
      <template>
        <v-row
          v-for="room in rooms"
          :key="room.ID"
          class="mx-auto"
          @click="gotochat(room)"
        >
          <div style="padding:5px;">
            <v-img
              :lazy-src="room.img"
              max-height="38"
              max-width="38"
              :src="room.img"
            ></v-img>
          </div>
          <div style="padding:2px;width:85%">
            <div>&nbsp; {{ room.name }}</div>
            <div style="margin-left:20%;width:60%;overflow:hidden;font-size:14px;"><font color="gray">{{room.newest}} .....</font></div>
            
            <v-divider></v-divider>
          </div>
        </v-row>
      </template>
    </section>

    <van-dialog v-model="show" title="" @confirm="confirm()">
      <van-cell-group>
        <van-field
          v-model="room_number"
          label="群聊号"
          placeholder="请输入群聊号"
        />
        <van-field
          v-model="room_name"
          label="房间名"
          placeholder="请输入房间名"
        />
      </van-cell-group>
    </van-dialog>
    <van-dialog v-model="addfriend" title="" @confirm="confirm_add()">
      <van-cell-group>
        <van-field
          v-model="room_number"
          label="联系人账号"
          placeholder="请输入联系人账号"
        />
      </van-cell-group>
    </van-dialog>
    <section
      class="footer"
      style="position: fixed; bottom: 0px; width: 100%;text-align: center;overflow: hidden;"
    >
      <template>
        <v-bottom-navigation
          max-height="2em"
          v-model="value"
          :background-color="color"
          dark
          shift
        >
          <v-btn>
            <span style="font-size:10px">聊天</span>
            <v-icon>mdi-message-text</v-icon>
          </v-btn>

          <v-btn>
            <span style="font-size:10px">联系人</span>
            <v-icon>mdi-account</v-icon>
          </v-btn>

          <v-btn>
            <span style="font-size:10px">设置</span>
            <v-icon>mdi-wrench</v-icon>
          </v-btn>
        </v-bottom-navigation>
      </template>
    </section>
  </v-app>
</template>

<script>
import fsCfg from "../../../assets/js/fw";
import util from "../../../assets/js/util";
import * as signalR from "@microsoft/signalr";
// let hubUrl = "https://localhost:44351/chatHub";
// // .net core 版本中默认不会自动重连，需手动调用 withAutomaticReconnect
// const connection = new signalR.HubConnectionBuilder()
//   .withAutomaticReconnect([0, 3000, 5000, 10000, 15000, 30000])
//   .withUrl(hubUrl)
//   .build();
// connection.onreconnecting((error) => {
//   const status = 'Connection lost due to error "${error}"';
//   console.log(error);
// });
// connection.start().catch();

export default {
  name: "chatlist",
  serviceUrl: {
    API_INIT_RECENT_GROUP: "/api/chat/getrecentchatedfriend?username={0}",
    API_UpdateList:
      "/api/values/UpdateList?groupId={0}&groupName={1}&users={2}",
  },
  data() {
    return {
      value: 0,
      addfriend: false,
      username: framework.getStorage("user"),
      displayname: framework.getStorage("displayname"),
      show: false,
      room_number: "",
      room_name: "",
      showPopover: false,
      actions: [{ text: "添加群聊" }, { text: "添加联系人" }],
      rooms: [],
    };
  },
  methods: {
    gotochat(room) {
      this.$router.push({
        path: "/",
        query: { roomnumber: room.number, room_name: room.name },
      });
      // const index = location.href.lastIndexOf("/ChatList");
      // const urlBase = location.href.substring(0, index);
      // window.location.href = urlBase + "?roomnumber=" + number;
    },
    onSelect(e) {
      if (e.text == "添加群聊") {
        this.show = true;
      } else if (e.text == "添加联系人") {
        this.addfriend = true;
      }
    },
    confirm() {
      if (this.room_number == "" || this.room_name == "") return;
      else this.UpdateList();
    },
    confirm_add() {
      if (this.room_number == "") return;
      let self = this;
      var rn = this.room_number + ";" + this.username;
      var url = framework.strFormat(
        this.$options.serviceUrl.API_UpdateList,
        rn,
        "friend",
        this.username
      );
      fsCfg.getData(url, function(res) {
        self.initGroup();
      });
    },
    UpdateList() {
      let self = this;
      var url = framework.strFormat(
        this.$options.serviceUrl.API_UpdateList,
        this.room_number,
        this.room_name,
        this.username
      );
      fsCfg.getData(url, function(res) {
        self.initGroup();
      });
    },
    initGroup() {
      console.log('refresh list');
      let self = this;
      var url = framework.strFormat(
        this.$options.serviceUrl.API_INIT_RECENT_GROUP,
        this.username
      );
      fsCfg.getData(url, function(res) {
        if (res.success) {
          self.rooms = [];

          for (let index = 0; index < res.data.length; index++) {
            let element = res.data[index];
            let rm = {
              newest: element.USER_CREATED,
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
  mounted: function() {
    var _this = this;
    this.initGroup();
  },
  computed: {
    color() {
      switch (this.value) {
        case 0:
          return "indigo";
        case 1:
          return "teal";
        case 2:
          return "brown";
        default:
          return "blue-grey";
      }
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.chatlist {
  position: absolute;
  top: 60px;
  bottom: 48px;
  left: 0px;
  right: 0px;
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 10px;
}

.chatlist-bottom {
  bottom: 48px;
}

.chatlist-bottom-collapse {
  bottom: 198px;
}

.chatlist ul {
  min-height: 300px;
}

.chatlist ul .chat-mine {
  text-align: right;
  padding-left: 0;
  padding-right: 60px;
}

.chatlist ul li {
  position: relative;
  /*font-size: 0;*/
  margin-bottom: 10px;
  padding-left: 60px;
  min-height: 68px;
}

.chat-mine .chat-user {
  left: auto;
  right: 3px;
}

.chat-user {
  position: absolute;
  left: 3px;
}

.chat-text,
.chat-user {
  display: inline-block;
  vertical-align: top;
  /*font-size: 14px;*/
}

.chat-user img {
  width: 40px;
  height: 40px;
  border-radius: 100%;
}

.time {
  width: 100%;
}

cite {
  left: auto;
  right: 60px;
  text-align: right;
}

cite {
  font-style: normal;
  line-height: 24px;
  font-size: 12px;
  white-space: nowrap;
  color: #999;
  text-align: left;
}

cite i {
  font-style: normal;
  padding-left: 5px;
  padding-right: 5px;
  font-size: 12px;
}

.chat-mine .chat-text {
  margin-left: 0;
  text-align: left;
  background-color: #33df83;
  color: #fff;
}

.chat-text {
  position: relative;
  line-height: 22px;
  /*margin-top: 25px;*/
  padding: 10px 15px;
  background-color: #eee;
  border-radius: 3px;
  color: #333;
  word-break: break-all;
  max-width: 462px\9;
}

.chat-text,
.chat-user {
  display: inline-block;
  vertical-align: top;
  font-size: 14px;
}

.chat-text img {
  max-width: 100%;
  vertical-align: middle;
}

.chat-user {
  position: absolute;
  left: 3px;
}

.chat-text:after {
  content: "";
  position: absolute;
  left: -10px;
  top: 15px;
  width: 0;
  height: 0;
  border-style: solid dashed dashed;
  border-color: #eee transparent transparent;
  overflow: hidden;
  border-width: 10px;
}

.chat-mine .chat-text:after {
  left: auto;
  right: -10px;
  border-top-color: #33df83;
}

.foot {
  width: 100%;
  min-height: 48px;
  position: fixed;
  bottom: 0px;
  left: 0px;
  background-color: #f8f8f8;
}

.foot .con {
  position: absolute;
  left: 66px;
  right: 40px;
}

.foot .btn-plus {
  width: 28px;
  padding: 9px 3px;
  position: absolute;
  left: 0px;
  border-left: 1px solid #d9d9d9;
}

.foot .btn-plus i {
  font-size: 2em;
  color: #ccc;
}

.foot .btn-face {
  width: 28px;
  padding: 9px 3px 9px 0px;
  position: absolute;
  left: 35px;
  /*border-right: 1px solid #d9d9d9;*/
}

.foot .btn-face i {
  font-size: 2em;
  color: #d9d9d9;
}

.foot .selbox {
  height: 150px;
  margin-top: 48px;
  border-top: 1px solid #d9d9d9;
}

.show {
  display: block;
}

.hide {
  display: none;
}

.face-box {
  /* position: absolute; */
  /* top: 48px; */
  /* left: 0px; */
  /* right: 0px; */
  /* bottom: 0px; */
  padding: 15px 15px 0px 15px;
  overflow: hidden;
  width: 290px;
  margin: 0px auto;
  height: 135px;
}

.face-box li {
  width: 30px;
  float: left;
  padding: 6px 10px 0px 8px;
}

.btn {
  display: inline-block;
  vertical-align: top;
  font-size: 14px;
  line-height: 32px;
  margin-left: 5px;
  padding: 0 6px;
  background-color: #33df83;
  color: #fff;
  border-radius: 3px;
}

.btn-send {
  position: absolute;
  right: 0px;
  top: 8px;
}
</style>
