import Vue from 'vue'

/**
 * Setting up Vue Apollo Client using Apollo Boost
 * Take Note: that this is different from Official Apollo Client
 */
import ApolloClient from 'apollo-boost'   // graphql client Apollo
import VueApollo from 'vue-apollo'        // allows to crate mutation, queries, etc.

Vue.use(VueApollo)

// Setup Apollo Client
export const defaultClient = new ApolloClient({
  uri: 'http://localhost:4000/',
  // include "auth Token" with requests we made dot backend
  fetchOptions: {
    credentials: 'include'
  },

  request: (operation) => {
    // if no token with key of 'token' in localStorage, add it
    if (!localStorage.token) {
      localStorage.setItem('token', '')
    }

    // operation adds the token to an authorization header, which is sent to backend
    operation.setContext({
      headers: {
        authorization: localStorage.getItem('token')
      }
    })
  },

  // // Error handling for GraphQL authorization
  // onError: ({ graphQLErrors, networkError}) => {
  //   if(networkError) {
  //     console.log('[NetworkError]', networkError)
  //   }

  //   if(graphQLErrors) {
  //     for (let err of graphQLErrors) {
  //       console.dir(err)
  //     }
  //   }
  // }
})

export const apolloProvider = new VueApollo({ defaultClient })