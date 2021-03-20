import Vue from 'vue'
import Router from 'vue-router'
import Login from "../components/Login";
import Main from "../components/Main";
import Project from "../components/Project";
import Audit from "../components/Audit";
import Test from "../components/Test";
import Protest from "../components/Protest";

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/main',
      component: Main
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/project',
      component: Project
    },
    {
      path: '/audit',
      component: Audit
    },
    {
      path: '/test',
      name: 'test',
      component: Test
    },
    {
      path: '/protest',
      component: Protest
    }
  ]
})
