import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
// import "@babel/polyfill";  // [[16 -1 @08:00 - recommended to prevent issue in production]]
import "roboto-fontface/css/roboto/roboto-fontface.css";

/**
 * Setting up Vue Apollo Client
 */
// import ApolloClient from 'apollo-boost'   // graphql client Apollo
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
// Reference: https://github.com/apollographql/apollo-client/issues/4990
import { setContext } from "apollo-link-context";
// Apollo Error handling
import { onError } from "apollo-link-error";

// Global Components
import FormAlert from "./components/Shared/FormAlert";
// argv1 - name of component, argv2 - Actual Component
Vue.component("form-alert", FormAlert);

import VueApollo from "vue-apollo"; // allows to crate mutation, queries, etc.

Vue.use(VueApollo);

// Setup Apollo Client for Apollo Boost
// export const defaultClient = new ApolloClient({
//   uri: 'http://localhost:4000/',
// })

const httpLink = createHttpLink({
  // uri: "http://localhost:4000",  // for localhost development
  uri: "http://https://ome-pic-share.herokuapp.com/graphql",
  /**
   * Read Further on "credentials" here
   * https://www.apollographql.com/docs/react/networking/authentication/
   */
  credentials: "same-origin",
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `${token}` : "",
    },
  };
});

// link for error handling or receiving error from server
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (networkError) {
    console.log("[networkError]", networkError);
  }

  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      console.dir(err);
      if (err.name === "AuthenticationError") {
        // set auth error in state (to show in snackbar)
        store.commit("setAuthError", err);
        // signout user (to clear token)
        store.dispatch("signOutUser");
      }
    }
  }
});

// Cache implementation
const cache = new InMemoryCache();

export const defaultClient = new ApolloClient({
  // ==> required
  // VERY IMPORTANT!! it si also required that you put "httpLink" as the last one
  link: errorLink.concat(authLink).concat(httpLink),
  cache, // ==> required
});

// New Setup for Apollo Client Officiatl
const apolloProvider = new VueApollo({ defaultClient });

Vue.config.productionTip = false;

new Vue({
  provide: { $apolloProvider: apolloProvider }, // Apollo Version 2: this is going to inject Apollo in each of our components. This is the latest way of using apolloProvider. The one below is deprecated

  // provide: apolloProvider.provide(),  // this is going to inject Apollo in each of our components

  store,
  router,
  vuetify,
  render: (h) => h(App),
  created() {
    // when Application start or refreshed. Execute getCurrentUser query
    // in other words the "Snacbar" that has message "You are now signed in"
    // will always appear in our page every refresh
    /**
     * Commenting due to the State is being Persisted with "vuex-persistedstate" module
     * * See the Vuex action method "Sign in " and "Sign up" that's where we put the "getCurrentUser"
     */
    // this.$store.dispatch("getCurrentUser");
  },
}).$mount("#app");
