import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Signin from '@/components/user/Signin'
import Signup from '@/components/user/Signup'
import drinks from '@/components/drink/Drinks'
import drink from '@/components/drink/Drink'
import Createdrink from '@/components/drink/Createdrink'
import AuthGuard from './auth-guard'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/signin',
      name: 'Signin',
      component: Signin
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/drink/new',
      name: 'Createdrink',
      component: Createdrink,
      beforeEnter: AuthGuard
    },
    {
      path: '/drinks',
      name: 'drinks',
      component: drinks,
      beforeEnter: AuthGuard
    },
    {
      path: '/drink/:id',
      name: 'drink',
      props: true,
      component: drink,
      beforeEnter: AuthGuard
    }
  ],
  mode: 'history'
})
