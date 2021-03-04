<template>
  <v-app id="inspire">
    <!-- <section>
      <v-app-bar color="deep-purple accent-4" dense dark>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
        <v-spacer></v-spacer>

        <v-btn icon>
          <v-icon>mdi-heart</v-icon>
        </v-btn>

        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </v-app-bar>
    </section> -->
    <v-form v-model="drawer" app>
      <v-sheet color="grey lighten-4" class="pa-4">
        <v-row>
          <v-col cols="9">
            <v-avatar class="mb-4" color="grey darken-1" size="64">
              <label style="height:64px;width:64px;">
                <v-img :src="userinfo.IMG" />
                <input
                  type="file"
                  name
                  id="form"
                  @change="addImg"
                  style="opacity:0;width:0;height:0"
                  accept="image/*"
                  :disabled="!isEdit"
                />
              </label>
            </v-avatar>
          </v-col>
          <v-col cols="3">
            <v-switch v-model="isEdit" label="编辑" />
          </v-col>
        </v-row>
        <div>{{ userinfo.USER_NAME }}</div>
      </v-sheet>

      <v-divider></v-divider>

      <v-list class="px-2">
        <v-text-field
          label="用户名"
          :disabled="!isEdit"
          v-model="userinfo.DISPLAY_NAME"
        ></v-text-field>
      </v-list>
      <v-row justify="center">
        <v-col cols="2">
          <v-btn v-show="isEdit" color="success" class="mr-4" @click="submit"
            >保 存</v-btn
          >
        </v-col>
      </v-row>
    </v-form>
  </v-app>
</template>

<script>
import fsCfg from "../../../assets/js/fw";
import framework from "../../../assets/js/framework";
import { Toast } from "vant";

export default {
  serviceUrl: {
    API_USER_INFO: "/api/values/GetUserInfo?username={0}",
    API_REGISTER: "/api/values/SignUp",
  },
  data: () => ({
    cards: ["Today", "Yesterday"],
    drawer: null,
    links: [
      ["mdi-inbox-arrow-down", "Inbox"],
      ["mdi-send", "Send"],
      ["mdi-delete", "Trash"],
      ["mdi-alert-octagon", "Spam"],
    ],
    isEdit: false,
    username: framework.getStorage("user"),
    userinfo: {},
  }),
  methods: {
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
  },
  mounted() {
    this.init();
  },
};
</script>
