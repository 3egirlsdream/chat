//import "https://cdnjs.cloudflare.com/ajax/libs/vue-resource/0.1.17/vue-resource.js";
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ?
    factory(exports) :
    typeof define === 'function' && define.amd ?
    define('framework', ['exports'], factory) :
    factory((global.framework = {}))
})(this, function (exports) {
  'use strict'
  /*exports.getData = function (url) {
    Axios
      .get(url)
      .then(response => {
        console.log(response);
      })
      // 请求失败
      .catch(error => {
        alert("网络错误，不能访问");
      });
  }

  exports.postData = function (url, data) {
    Axios.post(url, data, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        alert(error);
      });
  }*/
  

  exports.strFormat = function () {
    if (arguments.length == 0) return null
    var str = arguments[0]
    for (var i = 1; i < arguments.length; i++) {
      var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm')
      str = str.replace(re, arguments[i])
    }
    return str
  }
  ////本地存储
  exports.setStorage = function (name, val) {
    if (localStorage == undefined || localStorage == null) {
      var nm = this.arraryBufferToBase64(this.stringToBytes(name)).replace(
        '=',
        ''
      )
      document.cookie = nm + '=' + escape(val)
    } else {
      localStorage.setItem(name, val)
    }
  }
  ////读取本地存储
  exports.getStorage = function (name) {
    if (localStorage == undefined || localStorage == null) {
      var nm = this.arraryBufferToBase64(this.stringToBytes(name)).replace(
        '=',
        ''
      )
      var arr = document.cookie.match(
        new RegExp('(^| )' + nm + '=([^;]*)(;|$)')
      )
      if (arr != null) return unescape(arr[2])
      return null
    } else {
      return localStorage.getItem(name)
    }
  }
  ///删除要地存储
  exports.removeStorage = function (name) {
    if (localStorage != undefined || localStorage != null) {
      localStorage.removeItem(name)
    } else {
      var exp = new Date()
      exp.setTime(exp.getTime() - 1)
      var cval = this.getStorage(name)
      if (cval != null)
        document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
    }
  }
  ///字符串转二进制数组
  exports.stringToBytes = function (str) {
    var ch,
      st,
      re = []
    for (var i = 0; i < str.length; i++) {
      ch = str.charCodeAt(i)
      st = []
      do {
        st.push(ch & 0xff)
        ch = ch >> 8
      } while (ch)
      re = re.concat(st.reverse())
    }
    return re
  }

  //
  exports.isNullOrWhite = function(str){
    if(str == null) return false;
    if(str == "") return false;
    return true;
  }
  window.framework = exports
})

