import Vue from 'vue'
import Router from 'vue-router'
import Login from "../components/Login";
import Main from "../components/Main";
import Project from "../components/Project";
import Audit from "../components/Audit";
import Test from "../components/Test";
import Audit2 from "../components/Audit2";
import Test3 from "../components/Test3";
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
      path: '/project',
      name: 'Project',
      component: Project
    },
    {
      path: '/audit',
      name: 'Audit',
      component: Audit
    },
    {
      path: '/audit2',
      name: 'Audit2',
      component: Audit2
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
      path: '/test3',
      name: 'Test3',
      component: Test3
    },
    {
      path: '/solveVideo',
      name: 'SolveVideo',
      component: SolveVideo
    }
  ]
})
