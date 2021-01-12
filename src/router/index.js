import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../components/Home.vue";
import AddPost from "../components/Posts/AddPost.vue";
import Posts from "../components/Posts/Posts.vue";
import Post from "../components/Posts/Post.vue";
// Auth
import Profile from "../components/Auth/Profile.vue";
import SignIn from "../components/Auth/SignIn.vue";
import SignUp from "../components/Auth/SignUp.vue";
// Test Page
import TestPage from "../components/Test/Test.vue";

// AuthGuard helper function
import AuthGuard from "./AuthGuard";

import store from "../store/index";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/posts",
    name: "Posts",
    component: Posts,
  },
  // for individual posts
  {
    path: "/posts/:postId",
    name: "Post",
    component: Post,
    props: true,
  },
  {
    path: "/post/add",
    name: "AddPost",
    component: AddPost,
    beforeEnter: AuthGuard,
    beforeRouteEnter(to, from, next) {
      console.log("before Route Enter triggered");
    },
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    // beforeEnter: (to, from, next) => {
    //   // ...
    // }
    beforeEnter: AuthGuard,
  },
  {
    path: "/signin",
    name: "SignIn",
    component: SignIn,
  },
  {
    path: "/signup",
    name: "SignUp",
    component: SignUp,
  },
  {
    path: "/test",
    name: "TestPage",
    component: TestPage,
  },

  // Route Code splitting or Lazy loading
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
