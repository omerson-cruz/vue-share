<template>
  <v-container v-if="getPosts">
    <!-- xs12 - children will take up all of the space -->
    <v-flex xs12>
      <!-- slider -->
      <v-carousel
        v-bind="{ 'cycle': true }"
        interval="3000"
      >
        <v-carousel-item
          v-for="post in getPosts"
          :key="post._id"
          :src="post.imageUrl"
        >
          <h1 id="carousel__title">{{post.title}}</h1>
        </v-carousel-item>
      </v-carousel>
    </v-flex>
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

<style lang="scss" scoped>
/* This will put the Carouse <h1> title at the bottom  */
#carousel__title {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  color: rgb(255, 255, 255);
  border-radius: 5px 5px 0 0;
  padding: 0.5em;
  margin: 0 auto;
  bottom: 50px;
  left: 0;
  right: 0;
  text-align: center;
}
</style>,