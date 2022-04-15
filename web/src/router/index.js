import Vue from 'vue'
import Router from 'vue-router'
import Search from '@/components/Search'
import page404 from '@/components/404'
import materials from '@/components/Material'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Search
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    },
    {
      path: '/searchresults',
      name: 'searchResults',
      component: Search
    },
    {
      path: '/404',
      name: '404',
      component: page404
    },
    {
      path: '*',
      component: page404
    },
    {
      path: '/materials/:id',
      name: 'materials',
      component: materials
    }
  ],
  mode: 'history'
})
