<template>
  <v-container>
    <!-- Loading Spinner -->
    <v-row>
      <v-dialog
        v-model="loading"
        persistent
        fullscreen
      >
        <v-container fill-height>
          <!-- v-layout already deprecated but somehow still working
            as much as possible use the v-row component -->
          <v-layout
            row
            justify-center
            align-center
          >
            <v-progress-circular
              indeterminate
              :size="70"
              :width="7"
              color="accent"
            >
              <span style="font-size: 12px">Loading</span>
            </v-progress-circular>
          </v-layout>
        </v-container>
      </v-dialog>
    </v-row>
    <!-- loading Spinner - END  -->

    <!-- EXPLORE POST BUTTON  -->
    <v-row v-if="!loading" class="justify-center"> <!-- show this if not showing the Loading Spinner -->
      <v-btn class="secondary" to="/posts" large dark>
        Explore Posts
      </v-btn>
    </v-row>



    <!-- xs12 - children will take up all of the space -->
    <v-row>
      <v-col xs="12">
        <v-carousel
          v-if="!loading && posts.length > 0"
          v-bind="{ 'cycle': true }"
          interval="3000"
        >
          <v-carousel-item
            v-for="post in posts"
            :key="post._id"
            :src="post.imageUrl"
            @click.native="goToPost(post._id)"
          >
            <h1 id="carousel__title">{{post.title}}</h1>
          </v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { gql } from "apollo-boost";
import { mapGetters } from "vuex";

export default {
  name: "home",

  created() {
    this.handleGetCarouselPosts();
  },

  methods: {
    handleGetCarouselPosts() {
      // reach out to Vuex Store, fire action that gets posts for carousel
      this.$store.dispatch("getPosts");
    },
    // link to Individual Post from Carousel Pictures
    goToPost(postId) {
      this.$router.push(`/posts/${postId}`);
    },
  },

  computed: {
    // posts() {
    //   return this.$store.getters.posts;
    // },
    // loading() {
    //   return this.$store.getters.loading;
    // },
    // using Mappers
    ...mapGetters(["loading", "posts"]),
  },
};
</script>

<style lang="scss" scoped>
/* This will put the Carouse <h1> title at the bottom  */
#carousel__title {
  cursor: pointer;
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
</style>