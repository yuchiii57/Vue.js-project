import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/login'

import store from '../store/index.js'

Vue.use(VueRouter)


const router = new VueRouter({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
    , {
      path: '/index',
      name: 'index',
      component: () => import("@/views/mains/index"),

      children: [

        {
          path: 'users',
          name: 'users',
          component: () => import("@/components/users")

        },
        {
          path: 'articles',
          name: 'articles',
          component: () => import("@/components/articles")
          // meta: { requiresAuth: true }
        }, {
          path: 'banners',
          name: 'banners',
          component: () => import("@/components/banners")
        }, {
          path: 'promotions',
          name: 'promotions',
          component: () => import("@/components/promotions")
        }, {
          path: 'products',
          name: 'products',
          component: () => import("@/components/products")
        }, {
          path: 'productLinks',
          name: 'productLinks',
          props: (route) => ({ from: route.query.product }),
          component: () => import("@/components/productLinks")
        }



      ]
    },
    {
      path: '*', // 若都無符合上述條件，則轉址「首頁」
      redirect: '/login'
    }
  ]

  // const router = new VueRouter({
  //   mode: "history",
  //   base: process.env.BASE_URL,
  //   routes
});


router.beforeEach((to, from, next) => {
  document.title = "Senso 後台管理系統"
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next()
      return
    }
    next('/login')
  } else {
    next()
  }
})
export default router;