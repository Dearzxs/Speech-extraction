import Vue from 'vue'
import Router from 'vue-router'
import Login from "../components/Login";
import Main from "../components/Main";
import Audit from "../components/Audit";
import Test from "../components/Test";
import AuditSenior from "../components/AuditSenior";
import PlayVideo from "../components/PlayVideo";
import SolveVideo from "../components/SolveVideo";

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/main',
      name: 'Main',
      component: Main
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/audit',
      name: 'Audit',
      component: Audit
    },
    {
      path: '/auditSenior',
      name: 'AuditSenior',
      component: AuditSenior
    },
    {
      path: '/playVideo',
      name: 'PlayVideo',
      component: PlayVideo
    },
    {
      path: '/test',
      name: 'Test',
      component: Test
    },
    {
      path: '/solveVideo',
      name: 'SolveVideo',
      component: SolveVideo
    }
  ]
})
