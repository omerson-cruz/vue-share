<template>
  <v-container>
    <h1>Home</h1>

    <!-- Apollo Query is similar to React's way of fetching data -->
    <!-- This is Globally Available in Vue Apollo -->
    <ApolloQuery :query="getPostsQuery">
      <template slot-scope="{ result: { loading, data, error, networkStatus } }">
        <div v-if="loading">
          Loading...
        </div>

        <div v-else-if="error">
          <!-- This error will only appeary if there is something wrong
                With the query or if there is something wrong with the Network
           -->
          Error! {{error.message}}
        </div>

        <!-- skip (7) means working fine -->
        <div v-else-if="networkStatus !== 7">
          Network Status Error: {{networkStatus}}
        </div>

        <template v-else>
          <ul
            v-for="post in data.getPosts"
            :key="post._id"
          >
            <li>
              {{post.title}}
              {{post.imageUrl}}
              {{post.likes}}
            </li>
          </ul>
        </template>
      </template>
    </ApolloQuery>
  </v-container>
</template>

<script>
// import { gql } from "apollo-boost";
import { gql } from "graphql-tag";

export default {
  name: "home",
  data() {
    return {
      getPostsQuery: gql`
        query {
          getPosts {
            _id
            title
            imageUrl
            description
            likes
          }
        }
      `,
    };
  },

  methods: {
    test() {
      console.log("graphql fetch: ", this.getPosts);
    },
  },
};
</script>

<style scoped>
</style>,