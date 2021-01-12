import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

// for user redirect after signing In
import router from "../router/index";

// Apollo Client
// import {gql} from 'apollo-boost'
import { defaultClient as apolloClient } from "../main";
// import {defaultClient as apolloClient} from '../plugins/apollo-new.bkp'

// GraphQL Queries
import {
  GET_POSTS,
  SIGNIN_USER,
  GET_CURRENT_USER,
  SIGNUP_USER,
  ADD_POST,
  SEARCH_POSTS,
  GET_USER_POSTS,
  UPDATE_USER_POST,
  DELETE_USER_POST,
  INFINITE_SCROLL_POSTS,
} from "./queries";

//Below code is automatically added by VISUAL STUDIO COD :(((
// import { sign } from 'core-js/fn/number'

Vue.use(Vuex);

export default new Vuex.Store({
  /**
   * Using persistence so that we dont need that "getCurrentUser"
   * in the main.js file every refresh of the browser
   * or every time the App.vue component is recreated
   *
   * Web Reference:
   */

  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
      path: [],
    }),
  ],

  state: {
    posts: [],
    user: null,
    loading: false,
    error: null,
    authError: null,
    searchResults: [], //-->> this will contain the searchResults on each input at the searchField
    userPosts: [], //-->> this is the central store for Current User's posts
  },
  mutations: {
    setPosts(state, payload) {
      state.posts = payload;
    },
    setUser: (state, payload) => {
      state.user = payload;
    },
    setUserPosts: (state, payload) => {
      state.userPosts = payload;
    },

    setLoading(state, payload) {
      state.loading = payload;
    },
    clearUser: (state) => (state.user = null),

    setError(state, payload) {
      state.error = payload;
    },

    clearError(state) {
      state.error = null;
    },
    setAuthError: (state, payload) => {
      state.authError = payload;
    },
    setSearchResults: (state, payload) => {
      if (payload !== null) {
        // if the search input is not empty
        state.searchResults = payload;
      }
    },
    clearSearchResults: (state) => (state.searchResults = []),
  },
  actions: {
    async getPosts({ commit }) {
      // destructured context
      /**
       * loading display
       */
      commit("setLoading", true);
      /**
       * we will be using default client from
       * main.js
       */
      // use ApolloClient to fire getPosts query

      try {
        // const dataResult = await apolloClient
        const {
          data: { getPosts },
        } = await apolloClient // destructured
          .query({
            query: GET_POSTS,
          });

        //  console.log('data', dataResult.data.getPosts)
        console.log("data of getPosts", getPosts);
        // get Data from actions to state via mutations
        // commit passes data from actions to mutation functions
        commit("setPosts", getPosts);
        commit("setLoading", false);
      } catch (error) {
        commit("setLoading", false);
        console.log(error);
      }
    },

    /**
     * Getting the User's Own Posts for Profile.vue
     */
    getUserPosts: ({ commit }, payload) => {
      apolloClient
        .query({
          query: GET_USER_POSTS,
          variables: payload,
        })
        .then(({ data }) => {
          console.log("get user's own posts: ", data.getUserPosts);
          commit("setUserPosts", data.getUserPosts);
        })
        .catch((err) => {
          console.error(err);
        });
    },

    /**
     * Searching Posts Action
     */
    searchPosts: ({ commit }, payload) => {
      console.log("searchPost action payload: ", payload);
      apolloClient
        .query({
          query: SEARCH_POSTS,
          variables: payload,
        })
        .then(({ data }) => {
          console.log("search data result: ", data.searchPosts);
          // this will pass the ARRAY of POSTS in the search field
          commit("setSearchResults", data.searchPosts);
        })
        .catch((err) => console.error(err));
    },

    // ADD POST mutation
    async addPost({ commit }, payload) {
      try {
        const { data } = await apolloClient.mutate({
          mutation: ADD_POST,
          variables: payload,
          // need to add update function to update the Home page
          // to also show the NEWly added post

          // that "cache" is actually a store
          /**
           * WATCH [10-3 for the full explanation how to use the udpate and optimisticResponse]
           *
           * What we're going with this "update" function is to add the newly added Posts
           * to the existing data in the Carousel in VueShare Homepage.
           * so that we can see that update reflected in the UI
           *
           * => addPost is the data returned from the mutation query
           *    or returned by the server . So this update basically just updates the UI
           *    if the mutation was successful in the server
           */
          update: (cache, { data: { addPost } }) => {
            // update: (cache, { data: data1 }) => {
            console.log("update addPost: ", addPost);

            // First, read the query you want to update after mutation
            const data = cache.readQuery({ query: GET_POSTS });
            console.log("getting the old Post array through cache.readQuery");
            console.log(data);
            //Create udpated data
            data.getPosts.unshift(addPost);
            // Write updated data back to query
            console.log("New shifted data.getPosts", data.getPosts);
            cache.writeQuery({
              query: GET_POSTS,
              data,
            });
          },
          // optimisticResponse ensures data is added immediately as we specified for the update function
          /**
           * Optimistic respone - there is caveat here because some data are yet to be created by your database
           * and so it means that some values might not be returned immediately
           */
          optimisticResponse: {
            __typename: "Mutation",
            addPost: {
              __typename: "Post",
              _id: -1, //<== this will make sure that the post it's added at the beginning of the array
              ...payload,
            },
          },

          // [[ 15 -1 RefetchQueries]]
          /**
           * this allows to re-run  specified queries after performing the mutation in order to get fresh data for other queries that is being used in other Web Pages like in the "/post" page
           *
           * So below we are goint to re-run the "infiniteScroll Posts" in order to ensure that when we
           *  go to the "/post" page which has the "infiniteScrollPost" query it will have the latest data after this addPost mutation
           */
          refetchQueries: [
            {
              query: INFINITE_SCROLL_POSTS,
              variables: {
                pageNum: 1,
                pageSize: 2,
              },
            },
            // {   /** you can run as many query as you want. Just put it in the refetchQueries */
            //   query:
            // }
          ],
        });

        console.log("data: ", data);
      } catch (error) {}
    },

    /**
     * EDIT POST ACTION / UPDATE POST
     */
    updateUserPost: ({ state, commit }, payload) => {
      apolloClient
        .mutate({
          mutation: UPDATE_USER_POST,
          variables: payload,
        })
        .then(({ data }) => {
          console.log("user posts", state.userPosts);
          console.log("Update User Post: ", data.updateUserPost);

          const index = state.userPosts.findIndex(
            (post) => post._id === data.updateUserPost._id
          );

          // Create a NEW array with the new Updated Post placed at it's original
          // index number on the Array
          const userPosts = [
            ...state.userPosts.slice(0, index),
            data.updateUserPost,
            ...state.userPosts.slice(index + 1),
          ];

          // commit the changes to the Store to replace the User posts
          commit("setUserPosts", userPosts);
        })
        .catch((err) => {
          console.error(err);
        });
    },

    /**
     * Delete User Post Action
     */
    deleteUserPost: ({ state, commit }, payload) => {
      apolloClient
        .mutate({
          mutation: DELETE_USER_POST,
          variables: payload,
        })
        .then(({ data }) => {
          // copied code from "update User Post"

          console.log("user posts", state.userPosts);
          console.log("Update User Post: ", data.deleteUserPost);

          const index = state.userPosts.findIndex(
            (post) => post._id === data.deleteUserPost._id
          );

          // Create a NEW array with the new Updated Post placed at it's original
          // index number on the Array
          const userPosts = [
            ...state.userPosts.slice(0, index),
            // data.updateUserPost, <<== because we are deleting this data. Unlike in Update
            ...state.userPosts.slice(index + 1),
          ];

          // commit the changes to the Store to replace the User posts
          commit("setUserPosts", userPosts);
        })
        .catch((err) => {
          console.error(err);
        });
    },

    // handles signin from Signin Component
    async signinUser({ dispatch, commit }, payload) {
      // This will make sure that every time we "press" the logged in button
      // we are going to reset or clear the Error first so that the
      // Error Alert will show up again. Because if not you'll observe that after
      // clicking the Sign in button after error is shown it will not show again
      commit("clearError");

      // Also needs to set the loading state when user press that sign in button
      commit("setLoading", true);

      // Clear any Malformed Residue Token before signing in
      localStorage.removeItem("token");

      try {
        const data = await apolloClient.mutate({
          mutation: SIGNIN_USER,
          variables: payload,
        });

        // COMMON PITFALL with "apolloClient's return data"
        // is that it contains "data.data.signinUser"
        // NOT the "data.signinUser" <-- console.log will be undefined
        // console.log(data)
        console.log(data.data.signinUser);

        const {
          data: { signinUser },
        } = data;
        // storing token in "local Storage"
        console.log(signinUser.token);
        localStorage.setItem("token", signinUser.token);

        /**
         * My OWN modification because we are now using "peristend data" with the help of
         * createPersistedState npm module .
         * So now we are going to dispatch the "getCurrentUser" here in order to fill
         * that user state.
         *
         * Also prior to calling that "router.go()" which will refresh the current page
         * because of "vuex-persistedstate"
         */
        await dispatch("getCurrentUser");
        // !!VERY IMPORTANT!!  use the "await" here in "dispatch('getCurrentUser')"
        // if NOT your app will proceed to the next code below while the user info is not yet fetched

        /**
         * For TESTING purpose and demo purpose only
         * COMMON PITFALL
         * To see why the "await" is important for the "dispatch(getCurrentUser)"
         * = Try to comment the code above and uncomment this one below
         */
        // dispatch('getCurrentUser')

        // stop loading state
        commit("setLoading", false);

        // To make sure "created()" lifecycle in "main.js" or run in main.js
        // after signing in is to use the "routers" "go" method to make
        // sure that the "getCurrentUser" will be triggered from main.js
        router.go();
      } catch (error) {
        commit("setLoading", false);
        commit("setError", error);
        console.error("Error Signing In: ", error.message);
      }
    },

    // handles Sign Up  from Sign up Component
    async signUpUser({ dispatch, commit }, payload) {
      // This will make sure that every time we "press" the logged in button
      // we are going to reset or clear the Error first so that the
      // Error Alert will show up again. Because if not you'll observe that after
      // clicking the Sign in button after error is shown it will not show again
      commit("clearError");

      // Also needs to set the loading state when user press that sign in button
      commit("setLoading", true);

      // Clear any Malformed Residue Token before signing in
      // localStorage.removeItem('token')  //=>9.6 @08:07 - removing this clearing token

      try {
        const data = await apolloClient.mutate({
          mutation: SIGNUP_USER,
          variables: payload,
        });

        // COMMON PITFALL with "apolloClient's return data"
        // is that it contains "data.data.signupUser"
        // NOT the "data.signinUser" <-- console.log will be undefined
        // console.log(data)
        console.log(data.data.signupUser);

        const {
          data: { signupUser },
        } = data;
        // storing token in "local Storage"
        console.log(signupUser.token);
        localStorage.setItem("token", signupUser.token);

        /**
         * My OWN modification because we are now using "peristend data" with the help of
         * createPersistedState npm module .
         * So now we are going to dispatch the "getCurrentUser" here in order to fill
         * that user state.
         *
         * Also prior to calling that "router.go()" which will refresh the current page
         * because of "vuex-persistedstate"
         */
        await dispatch("getCurrentUser");

        // stop loading state
        commit("setLoading", false);

        // To make sure "created()" lifecycle in "main.js" or run in main.js
        // after signing in is to use the "routers" "go" method to make
        // sure that the "getCurrentUser" will be triggered from main.js
        router.go();
      } catch (error) {
        commit("setLoading", false);
        commit("setError", error);
        console.error("Error Signing Up: ", error.message);
      }
    },

    // getCurrentUser Query on every refresh of the App
    // or AFTER signing in
    async getCurrentUser({ commit }) {
      console.log("store-> getcurrentUser triggered");
      commit("setLoading", true);
      try {
        const { data } = await apolloClient.query({
          query: GET_CURRENT_USER,
        });
        commit("setLoading", false);
        if (data) {
          console.log("store: data.getCurrentUser: ", data.getCurrentUser);
        }

        // Add user data to our state
        commit("setUser", data.getCurrentUser);

        // Add user to local storage for persistence
        // localStorage.setItem('user', JSON.stringify(data.getCurrentUser))
      } catch (error) {
        console.error(error);
      }
    },

    // Signout User
    async signOutUser({ commit }) {
      // Clear user State
      commit("clearUser");

      // clear Session Storage which is being used by the
      // "vuex-persistdstate" npm module as the current storage
      sessionStorage.clear();

      // remove token in localStorage
      localStorage.removeItem("token", "");
      // end session with Apollo Client - this will
      // clear the inMemoryCache and other bunch of stuffs
      console.dir(apolloClient);
      await apolloClient.resetStore();

      // redirect ome - kick users of private pages (i.e. profile)
      // programmatically redirect users
      router.push("/");
    },
  },
  getters: {
    posts: (state) => state.posts,
    userPosts: (state) => {
      /** for DEBUG LOG **/
      // console.log("calling userPosts getter: ", state.userPosts);
      return state.userPosts;
    },
    // userPosts: (state) => state.userPosts,
    loading: (state) => state.loading,
    user: (state) => state.user,
    // this is for getting user favorites for toggling "Like" or "Unlike" posts
    /**
     * The  && (AND operator) is for checking if user exists and then if it is true
     * the second operand will be returned which is the "state.user.favorites"
     */
    userFavorites: (state) => state.user && state.user.favorites,
    error: (state) => state.error,
    authError: (state) => state.authError,

    /**
     * getter for the searchResult
     */
    searchResults: (state) => state.searchResults,
  },

  modules: {},
});
