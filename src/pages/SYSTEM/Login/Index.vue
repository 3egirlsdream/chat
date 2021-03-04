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
  background-color: gray;
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
    <div style="padding-top:50px;">
      <van-cell-group style="margin:15px;">
        <van-field v-model="user" placeholder="请输入用户名" :clearable="true" style="height:48px;"/>
      </van-cell-group>
      <van-password-input :value="value" info="密码为 6 位数字" @focus="showKeyboard = true"/>
      <van-number-keyboard
        :show="showKeyboard"
        @input="onInput"
        @delete="onDelete"
        @blur="showKeyboard = false"
      />
      <van-row type="flex" style="padding:15px;">
        <van-button type="warning" size="large" @click="login" style="margin-top:5px;">登录</van-button>
        <van-col span="12" style="padding-right:10px;">
          <van-button type="primary" size="large" @click="register" style="margin-top:5px;">注册</van-button>
        </van-col>
        <van-col span="12" style="padding-left:10px;">
          <van-button type="info" size="large" @click="edit" style="margin-top:5px;">修改用户信息</van-button>
        </van-col>
      </van-row>
    </div> 
  </div>
</template>


<script>
import framework from "../../../assets/js/framework";
import fsCfg from "../../../assets/js/fw";
import { Toast } from "vant";
import Axios from "axios";

export default {
  name: "Index",
  serviceUrl: {
    API_REGISTER: "http://47.107.186.141:4396/api/values/",
    API_LOGIN: "/api/values/login/user={0}&pwd={1}"
  },
  data() {
    return {
      showKeyboard: true,
      value: "",
      user: "",
      isedit:false
    };
  },
  methods: {
    onInput(key) {
      this.value = (this.value + key).slice(0, 6);
    },
    onDelete() {
      this.value = this.value.slice(0, this.value.length - 1);
    },
    register: function() {
          const index = location.href.lastIndexOf("/SYSTEM");
          const urlBase = location.href.substring(0, index);
          window.location.href = urlBase + "/SYSTEM/Signup.html"
    },
    edit: function(){
      this.isedit = true;
      if(this.user === '' || this.value === ''){
        Toast("请先登录！");
        return;
      }else{
        this.login();
      }

    },
    login: function() {
      let self = this;
      var url = framework.strFormat(
        this.$options.serviceUrl.API_LOGIN,
        this.user,
        this.value
      );
      framework.setStorage('user', self.user);
      framework.setStorage('pwd', self.value);
      framework.setStorage("login", "YES");
      
      fsCfg.getData(url, function(res){
        if(res.success){
          Toast(res.data.Message);
          framework.setStorage('displayname', res.data.data.DISPLAY_NAME);
          framework.setStorage('myimg', res.data.data.IMG);
          console.log(res.data.data.DISPLAY_NAME);
          const index = location.href.lastIndexOf("/SYSTEM");
          const urlBase = location.href.substring(0, index);
          if(self.isedit){
            window.location.href = urlBase + "/SYSTEM/Signup.html#/?isedit=Y";
          }
          else {
            window.location.href = urlBase + "/Chat/Index.html#/ChatList"
          }
        }
        else{
          Toast(res.message.content);
        }
      });
      
    }
  },
  mounted: function() {
    //weChatCfg.WechatConfig(location.href.split("#")[0]);
  }
};
</script>