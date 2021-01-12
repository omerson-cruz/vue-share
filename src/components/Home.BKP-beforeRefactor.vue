<template>
  <v-container>
    <h1>Home</h1>
    <v-btn
      color="red accent-1"
      dark
      @click="test"
    >
      Test GraphQL
    </v-btn>

    <h2>Result of GraphQL query</h2>
    <!-- Showing loading when not yet done with query -->
    <!-- $apollo is how we call from template the "apollo" property from <script> -->
    <div v-if="$apollo.loading">
      Loading...
    </div>

    <template v-else>
      <ul
        v-for="post in getPosts"
        :key="post._id"
      >
        <li>
          {{post.title}}
          {{post.imageUrl}}
          {{post.description}}
        </li>
      </ul>
    </template>
  </v-container>
</template>

<script>
// import { gql } from "apollo-boost";
import { gql } from "graphql-tag";

export default {
  name: "home",
  data() {
    return {
      posts: [],
    };
  },

  apollo: {
    getPosts: {
      query: gql`
        query {
          getPosts {
            title
            imageUrl
            description
          }
        }
      `,

      // we can also have access to "result" property
      // inside of the "getPosts" query

      // result(args) {}
      result({ data, loading, networkStatus }) {
        if (!loading) {
          // if not loading or done
          this.posts = data.getPosts;

          // 7 - means network is working fine
          console.log("[networkStatus]: ", networkStatus);
        }
      },

      // can also check for errors of GraphQL query
      error(err) {
        console.log("[ERROR!!]", err);
        console.dir(err);
      },
    },
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