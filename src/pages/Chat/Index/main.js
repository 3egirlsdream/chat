import Vue from 'vue'
import Vant from 'vant';
import App from './App.vue'
import {
  router
} from './router'


import '../../../assets/js/base';
import 'vant/lib/index.less';
import querystring from 'querystring'
Vue.prototype.$qs = querystring;

import fsCfg from '../../../assets/js/fw'
import vuetify from '../../../plugins/vuetify';

import _ from 'lodash'
import * as signalR from "@microsoft/signalr";
import { Notify } from 'vant';

// 全局注册
Vue.use(Notify);
Vue.use(signalR)
Vue.prototype._ = _
Vue.use(fsCfg);
Vue.use(Vant);


new Vue({
  router,
  vuetify,
  components: {
    App
  },
  render: h => h(App)
}).$mount('#app')