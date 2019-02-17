import Vue from 'vue'
import Router from 'vue-router'

import About from '@/pages/About'
import Album from '@/pages/Album'
import Artist from '@/pages/Artist'
import Composer from '@/pages/Composer'
import Folder from '@/pages/Folder'
import Home from '@/pages/Home'
import Install from '@/pages/Install'
import Login from '@/pages/Login'
import NowPlaying from '@/pages/NowPlaying'
import Notfound from '@/pages/Notfound'
import Playlist from '@/pages/Playlist'
import Search from '@/pages/Search'
import Setting from '@/pages/Setting'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/about',
    name: 'About',
    component: About
  }, {
    path: '/album',
    name: 'Album',
    component: Album
  }, {
    path: '/artist',
    name: 'Artist',
    component: Artist
  }, {
    path: '/composer',
    name: 'Composer',
    component: Composer
  }, {
    path: '/folder',
    name: 'Folder',
    component: Folder
  }, {
    path: '/install',
    name: 'Install',
    component: Install
  }, {
    path: '/login',
    name: 'Login',
    component: Login
  }, {
    path: '/now',
    name: 'NowPlaying',
    component: NowPlaying
  }, {
    path: '/playlist',
    name: 'Playlist',
    component: Playlist
  }, {
    path: '/search',
    name: 'Search',
    component: Search
  }, {
    path: '/setting',
    name: 'Setting',
    component: Setting
  }, {
    path: '/',
    name: 'Home',
    component: Home
  }, {
    path: '*',
    name: 'Notfound',
    component: Notfound
  }]
})