<style lang="less" scoped>
.content {
  box-sizing: content-box !important;
  padding-bottom: 50px;
  background: #fafafa;
  .footer {
    width: 100%;
    position: fixed;
    bottom: 0;
    z-index: 2;
  }
}

.Gray {
  background-color: white;
  height: 10px;
}
.pages {
  background-color: white;
  height: 100%;
  width: 100%;
  position: absolute;
}
.p {
  font-size: 17px;
}
</style>

<template>
  <div class="pages">
    <div>
      <van-nav-bar
        title="个人信息"
        left-arrow
        @click-left="$router.go(-1)"
      />
      <van-cell-group>
        <van-cell
          title="头像"
          title-style="text-align:left;line-height:3em"
          
        >
          <label>
            <input
              type="file"
              name
              id="form"
              @change="addImg"
              style="opacity:0;width:0;"
              accept="image/*"
            />
            <van-icon :name="headImg" size="3em" />
          </label>
        </van-cell>
        <van-field
          v-model="username"
          label="账号"
          placeholder
          :clearable="true"
          :readonly="isedit"
        />
        <van-field
          v-model="displayname"
          label="昵称"
          placeholder
          :clearable="true"
        />
        <van-field
          v-model="oldpassword"
          label="原密码"
          type="password"
          :clearable="true"
          @input="onchange"
          v-show="isedit"
        />
        <van-field
          v-model="password"
          label="密码"
          type="password"
          :clearable="true"
          @input="onchange"
        />
      </van-cell-group>

      <van-row
        type="flex"
        style="position: fixed; bottom: 0px; width: 96%;text-align: center;overflow: hidden; padding: 2%;"
      >
        <van-button type="warning" size="large" @click="Signup"
          >注册</van-button
        >
      </van-row>
    </div>
  </div>
</template>

<script>
import framework from "../../../assets/js/framework";
import fsCfg from "../../../assets/js/fw";
import { Toast } from "vant";
// import Axios from "axios";

export default {
  name: "Index",
  serviceUrl: {
    API_REGISTER: "/api/values/SignUp",
    API_LOGIN: "/api/values/login/user={0}&pwd={1}",
    API_USER_INFO: "/api/values/GetUserInfo?username={0}",
  },
  data() {
    return {
      isedit: false,
      headImg: "",
      username: "",
      displayname: "",
      password: "",
      imagesrc: "",
      oldpassword: "",
    };
  },
  methods: {
    addImg(e) {
      let self = this;
      let files = e.target.files || e.dataTransfer.files;
      let reader = new FileReader();

      //将图片转成base64格式
      reader.readAsDataURL(files[0]);
      reader.onloadend = function() {
        self.headImg = this.result;
        var msg = {
          access_token: "fcb05eac14cddd1d4e0f2450a4fde6b5",
          content: self.headImg.split(",")[1],
          message: "上传一张图片",
        };
        fsCfg.uploadImage(files[0].name, JSON.stringify(msg), function(rs) {
          if(rs == 400){
            self.imagesrc = "https://gitee.com/eeegirlsdream/picture/raw/master/" + files[0].name;
            console.log(self.imagesrc);
          }
          else{
            console.log(rs);
            self.imagesrc = rs.content.download_url;
            console.log(self.imagesrc);
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
          _this.headImg = res.data.IMG;
          _this.imagesrc = res.data.IMG;
        } else {
          Toast(res.message.content);
        }
      });
    },
    Signup: function() {
      let self = this;
      fsCfg.postData(
        this.$options.serviceUrl.API_REGISTER,
        JSON.stringify({
          img: self.imagesrc,
          username: self.username,
          displayname: self.displayname,
          password: self.password,
          oldpassword: self.oldpassword,
          isedit: self.isedit ? "Y" : "N",
        }),
        function(res) {
          if (res.success) {
            const index = location.href.lastIndexOf("/SYSTEM");
            const urlBase = location.href.substring(0, index);
            window.location.href = urlBase + "/SYSTEM/Login.html";
          } else {
            Toast(res.message.content);
          }
        }
      );

      //alert(this.headImg);
    },
    onchange: function() {
      if (this.password.length > 6) {
        console.log("密码长度为6");
        this.password = this.password.slice(0, this.password.length - 1);
      }
    },
  },
  mounted: function() {
    this.headImg = "contact";
    var isedit = this.$route.query.isedit;
    this.isedit = isedit === "Y" ? true : false;
    if (this.isedit) {
      this.username = framework.getStorage("user");
      if (this.username === "" || this.username == null) {
        Toast("请先登录！");
      } else {
        this.init();
      }
    }
  },
};
</script>
