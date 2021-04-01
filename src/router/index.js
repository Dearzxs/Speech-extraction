import Vue from 'vue'
import Router from 'vue-router'
import Login from "../components/Login";
import Main from "../components/Main";
import Audit from "../components/Audit";
import Test from "../components/Test";
import AuditSenior from "../components/AuditSenior";
import PlayVideo from "../components/PlayVideo";
import SolveVideo from "../components/SolveVideo";
import typeWriter from "../components/typeWriter";

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/playVideo',
      name: 'PlayVideo',
      component: PlayVideo
    },
    {
      path: '/solveVideo',
      name: 'SolveVideo',
      component: SolveVideo
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
      path: '/test',
      name: 'Test',
      component: Test
    },
    {
      path: '/typeWriter',
      name: 'TypeWriter',
      component: typeWriter
    }
  ]
})
