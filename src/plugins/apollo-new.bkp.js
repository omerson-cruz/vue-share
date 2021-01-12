import Vue from 'vue'

/**
 * Setting up Vue Apollo Client using Apollo Boost
 * Take Note: that this is different from Official Apollo Client
 */
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { withClientState } from 'apollo-link-state';
import { ApolloLink, Observable } from 'apollo-link';
import VueApollo from 'vue-apollo'        // allows to crate mutation, queries, etc.

Vue.use(VueApollo)

// npm install apollo-client apollo-cache-inmemory apollo-link-http apollo-link apollo-link-state apollo-link-error --save
const cache = new InMemoryCache({
  cacheRedirects: {
    Query: {
      movie: (_, { id }, { getCacheKey }) =>
        getCacheKey({ __typename: 'Movie', id })
    }
  }
});

const request = async (operation) => {
  const token = await localStorage.getItem('token');
  operation.setContext({
    headers: {
      authorization: token
    }
  });
};

const requestLink = new ApolloLink((operation, forward) =>
  new Observable(observer => {
    let handle;
    Promise.resolve(operation)
      .then(oper => request(oper))
      .then(() => {
        handle = forward(operation).subscribe({
          next: observer.next.bind(observer),
          error: observer.error.bind(observer),
          complete: observer.complete.bind(observer),
        });
      })
      .catch(observer.error.bind(observer));

    return () => {
      if (handle) handle.unsubscribe();
    };
  })
);

// Setup Apollo Client

export const defaultClient = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        sendToLoggingService(graphQLErrors);
      }
      if (networkError) {
        logoutUser();
      }
    }),

    requestLink,

    withClientState({
      defaults: {
        isConnected: true
      },
      resolvers: {
        Mutation: {
          updateNetworkStatus: (_, { isConnected }, { cache }) => {
            cache.writeData({ data: { isConnected }});
            return null;
          }
        }
      },
      cache
    }),

    new HttpLink({
      uri: 'http://localhost:4000/',
      credentials: 'include'
    })
  ]),
  cache
});


export const apolloProvider = new VueApollo({ defaultClient })