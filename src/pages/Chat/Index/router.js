import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const routes = [{
  name: 'Index',
  path: '/',
  meta: {
    title: ''
  },
  component: resolve => require(['./Index'], resolve)
},{
  name: 'ChatList',
  path: '/ChatList',
  meta: {
    title: ''
  },
  component: resolve => require(['./ChatList'], resolve)
},{
  name: 'Chat',
  path: '/Chat',
  meta: {
    title: ''
  },
  component: resolve => require(['./Chat'], resolve)
},{
  name: 'Mine',
  path: '/Mine',
  meta: {
    title: ''
  },
  component: resolve => require(['./Mine'], resolve)
},{
  name: 'Friends',
  path: '/Friends',
  meta: {
    title: ''
  },
  component: resolve => require(['./Friends'], resolve)
}];

const router = new Router({
  routes
});

router.beforeEach((to, from, next) => {
  const title = to.meta && to.meta.title;
  if (title) {
    document.title = title;
  }
  next();
});

export {
  router
};