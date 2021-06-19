// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import VueAxios from 'vue-axios'
import './assets/css/iconfont.css';
import VideoPlayer from 'vue-video-player'
import 'vue-video-player/src/custom-theme.css'
import 'video.js/dist/video-js.css'
import live2d from 'vue-live2d'

import KProgress from 'k-progress';

Vue.prototype.Event = new Vue

axios.defaults.baseURL='http://localhost:8181'
Vue.prototype.$axios = axios
Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.use(VueAxios, axios);
Vue.use(VideoPlayer);
Vue.use(live2d);
Vue.component('k-progress', KProgress);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
