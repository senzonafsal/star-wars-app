import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home.vue';
import PeopleList from '@/views/PeopleList.vue';
import PlanetsList from '@/views/PlanetsList.vue';
import FilmsList from '@/views/FilmsList.vue';

// Defining an array of route objects
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/people',
    name: 'PeopleList',
    component: PeopleList,
  },
  {
    path: '/films',
    name: 'FilmsList',
    component: FilmsList,
  },
  {
    path: '/planets',
    name: 'PlanetsList',
    component: PlanetsList,
  }
];

// Creating a router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
