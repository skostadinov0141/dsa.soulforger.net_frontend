import { createRouter, createWebHistory } from 'vue-router'
import CharacterCreation from '../views/CharacterCreation.vue'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import LandingPage from '../views/LandingPage.vue';
import Contribute from '../views/Contribute.vue';
import Wiki from '../views/Wiki.vue';
import Test from '../views/Test.vue';
import axios, { type AxiosInstance } from 'axios'
import { inject } from 'vue';
import { useCookies } from 'vue3-cookies';
import type { User } from '@/interfaces/authentification';
import data from '../../config.json';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingPage,
    },
    {
      path: '/test',
      name: 'test',
      component: Test,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/characters/create',
      name: 'create_character',
      component: CharacterCreation,
      meta:{
        requiresAuth: true
      }
    },
    {
      path: '/wiki',
      name: 'wiki',
      component: Wiki,
      meta:{
        requiresAuth: true
      }
    },
    {
      path: '/contribute',
      name: 'Contribute',
      component: Contribute,
      meta:{
        requiresAuth: true
      }
    },
  ]
})

router.beforeEach((to, from, next) => {
  // import cookies to check if the user is authed
  const { cookies } = useCookies();
  if (to.matched.some(record => record.meta.requiresAuth)){
    // if user cookie exists the user is authenticated and can move to the page
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    const api : AxiosInstance = axios.create({
      baseURL: data.api_base_url,
      withCredentials: true,
      headers:{
        Accept:'applications/json',
      }
    });
    api.get('/auth/validate-session').then((data) => {
      next();
    }).catch(error => {
      console.log(error)
      next({path:'/login'});
    });
  } else {
    next() // does not require auth, make sure to always call next()!
  }
})

export default router
