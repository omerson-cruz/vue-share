<template>
  <div>
    <v-container fluid>
      <!-- Post Cards -->
      <v-row
        class="flex-wrap"
        v-if="posts"
      >
        <v-col
          xs="12"
          sm="6"
          v-for="post in posts"
          :key="post._id"
        >
          <v-card
            hover

          >
            <v-img
              :src="post.imageUrl"
              height="30vh"
              @click.native="goToPost(post._id)"
              lazy
            ></v-img>

            <v-card-actions>
              <v-card-title primary>
                <div>
                  <div class="headline">{{post.title}}</div>
                  <span class="grey--text">{{post.likes}} likes - {{post.messages.length}} comments</span>
                </div>
              </v-card-title>
              <!-- spacer (try removing v-spacer to see it's effect) -->
              <v-spacer></v-spacer>
              <v-btn
                icon
                @click="showPostCreator = !showPostCreator"
              >
                <!-- Change the direction of arrow depending on "showPostCreator" -->
                <v-icon>{{`mdi-arrow-${showPostCreator ? "up" : "down" }-drop-circle-outline`}}</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>

          <!-- Post Creator Title -->
          <v-slide-y-transition v-if="showPostCreator">
            <v-card-text class="grey lighten-4">
              <v-list-item>
                <v-list-item-avatar>
                  <img
                    :src="post.createdBy.avatar"
                    alt="Cannot Find Image"
                  >
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="primary--text">
                    {{post.createdBy.username}}
                  </v-list-item-title>
                  <v-list-item-subtitle class="font-weight-thin">
                    Added {{post.createdDate | dateFormat}}
                  </v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn
                    icon
                    ripple
                  >
                    <v-icon color="grey lighten-1">mdi-information-outline</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-card-text>
          </v-slide-y-transition>

        </v-col>
      </v-row>

      <!-- Fetch More button -->

      <v-row class="justify-center">
        <v-btn
          color="info"
          @click="showMorePosts"
          v-if="showMoreEnabled"
        >
          Fetch More
        </v-btn>
      </v-row>

    </v-container>
  </div>
</template>

<script>
import { INFINITE_SCROLL_POSTS, GET_POSTS } from "../../store/queries";
import moment from 'moment';

const pageSize = 2; //=> this will limit the pageSize or number of post per page

export default {
  name: "Posts",
  data() {
    return {
      pageNum: 1,
      // showMoreEnabled: true,
      showPostCreator: false,
    };
  },
  filters: {
    // Date FIlTER from Unix Number to Date String
    dateFormat(value){

      // console.log('value: ', value)

      if(!value) return ''

      let formattedDate = new Date(+value).toDateString() // we put a positive number in fron in order to convert to an INT because the value is a Date Object
      // console.log('formatted date: ', formattedDate)
      return formattedDate
    }
  },
  computed: {
    // Instead of directly using the "infiniteScrollPosts" in the Component
    // we are usin the "computed" property "posts" in order to check if "infiniteScrollPosts"
    // is already loaded up by the Apollo Client. Because if it's not loaded then you will have so
    // many errors
    posts() {
      console.log("infiniteScrollPosts: ", this.infiniteScrollPosts);
      if (this.infiniteScrollPosts && this.infiniteScrollPosts.posts) {
        return this.infiniteScrollPosts.posts;
      }

      // return false and dont display the Posts array block
      // this will ensure that while it is still loading we are not going to display anything yet
      return false;
    },

    postsFromGetPost() {
      console.log('postsFromGetPosts: ', this.getPosts)
      if (this.getPosts) {
        return this.getPosts;
      }
    },

    showMoreEnabled(){
      return this.infiniteScrollPosts && this.infiniteScrollPosts.hasMore
    }
  },

  // The below "apollo" object attribute of this component will automatically fetch from the Apollo
  //  backend server once this page loads. In comparison with the "this.$apollo.queries.infiniteScrollPosts" which is
  //  manually triggered. Once the "load more" button is clicked
  apollo: {
    infiniteScrollPosts: {
      query: INFINITE_SCROLL_POSTS,
      variables: {
        pageNum: 1,
        pageSize,
      },
    },
    // getPosts: {    //==> this is not used in favor of "infitineScrollPosts" property
    //   query: GET_POSTS,
    // },
  },

  methods: {
    // link to Individual Post from Carousel Pictures
    goToPost(postId) {
      this.$router.push(`/posts/${postId}`);
    },

    // this will handle a button to load more (FETCH MORE)
    showMorePosts() {
      this.pageNum += 1; // it's like telling our backend ok go to next page
      // but since this is infiniteScroll then we want to retain first page (so incremental)
      // fetch more data and transform original result
      this.$apollo.queries.infiniteScrollPosts.fetchMore({
        variables: {
          // pageNum is incremetned by 1 (in pagination's term go to next page)
          pageNum: this.pageNum,
          pageSize,
        },
        // this is not the same as the "update" we use in Add Post handler in Vuex Store
        // updateQuery will also combine the newly fetched data to the existing one
        updateQuery: (prevResult, { fetchMoreResult }) => {
          const newPosts = fetchMoreResult.infiniteScrollPosts.posts;
          const hasMore = fetchMoreResult.infiniteScrollPosts.hasMore;

          // this.showMoreEnabled = hasMore;  // by disabling this will automatically load instead of "Fetch More" Button

          return {
            infiniteScrollPosts: {
              __typename: prevResult.infiniteScrollPosts.__typename,
              // Merge previous posts with the new posts
              posts: [...prevResult.infiniteScrollPosts.posts, ...newPosts],
              hasMore,
            },
          };
        },
      });
    },
    // [[ 15 - 2]]
    // this feature not used because I implemented my own "filter" namely "dateFormat()"
    formatCreatedDate(date) {
      return moment(new Date(date)).format('ll')
    }

  },
  // watch: {
  //   infiniteScrollPosts() {
  //     console.log('watchers trggered')
  //   }
  // },

  mounted() {
    console.log('mounted Posts')
    console.log(this.posts)
  }
};
</script>

<style scoped>
</style>,