import Vue from 'vue';
import App from "./App";
import router from './router';
import axios from 'axios';
import VueRouter from 'vue-router';
import ElementUI from 'element-ui';
import store from './store/index'
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
//import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
//import imageResize from 'quill-image-resize-module'
//Quill.register('modules/imageResize', imageResize)
const http = require('http');

import {
  Dialog,
  Autocomplete,
  Container, Menu, MenuItem,
  Form,
  Avatar,
  Button,
} from 'element-ui';
//Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Autocomplete);
Vue.use(Avatar);
Vue.use(Form);
Vue.use(Button);
Vue.use(Menu);
Vue.use(Container);
Vue.use(MenuItem);
Vue.use(VueRouter);
Vue.use(ElementUI);
Vue.use(VueQuillEditor)


Vue.prototype.HOST = '/api'
axios.interceptors.request.use(
  config => {
    config.httpAgent = new http.Agent({ keepAlive: true });
    config.timeout = 1000000;
    config.headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, PATCH, DELETE',
      'Content-Type': 'application/json'
    };
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
Vue.prototype.$axios = axios;

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app');