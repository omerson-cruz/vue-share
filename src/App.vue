<template>
  <div id="app">
    <v-app style="background: #E3E3E3">

      <!-- dark attribute will make the text lighter or white against dark background -->
      <v-card
        color="grey lighten-4"
        elevation="0"
      >
        <!-- Navigation Toolbar -->
        <v-navigation-drawer
          app
          temporary
          fixed
          v-model="sideNav"
        >
          <v-toolbar
            color="red accent-1"
            dark
            elevation="0"
          >
            <v-app-bar-nav-icon @click="toggleSideNav">
            </v-app-bar-nav-icon>
            <router-link
              to="/"
              tag="span"
              style="cursor: pointer"
            >
              <h1 class="title pl-3">
                VueShare
              </h1>
            </router-link>
          </v-toolbar>

          <!-- line space that is visible compared to v-space -->
          <v-divider></v-divider>

          <!-- Side NavBar Links -->
          <v-list>
            <!-- <v-list-tile v-for="item in sideNavItems" :key="item.title">

              <v-list-tile-action>
                <v-icon>{{item.icon}}</v-icon>
              </v-list-tile-action>

              <v-list-tile-content>
                {{item.title}}
              </v-list-tile-content>

            </v-list-tile> -->
            <v-list-item-group>
              <v-list-item
                v-for="(item, i) in sideNavItems"
                :key="i"
                ripple
                :to="item.link"
              >
                <v-list-item-icon>
                  <v-icon>{{item.icon}}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="item.title"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <!-- Sign out button in Drawer Navbar -->
              <v-list-item
                ripple
                @click="handleSignOutUser"
                v-if="user"
              >
                <v-list-item-icon>
                  <v-icon>mdi-exit-run</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Signout</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

            </v-list-item-group>

          </v-list>
        </v-navigation-drawer>

        <!-- Main Horizontal Toolbar -->
        <v-toolbar
          style="z-index: 100;"
          color="primary"
          dark
        >
          <!-- <v-icon>mdi-window-minimize</v-icon>
          <v-icon>mdi-window-maximize</v-icon>

          <v-icon>mdi-close</v-icon> -->
          <!-- This will trigger the SideNavigation bar -->
          <v-app-bar-nav-icon @click="toggleSideNav"></v-app-bar-nav-icon>

          <v-toolbar-title class="hidden-xs-only">
            <router-link
              to="/"
              tag="span"
              style="cursor: pointer"
            >
              VueShare
            </router-link>
          </v-toolbar-title>
          <v-spacer></v-spacer>

          <v-text-field
            prepend-icon="mdi-magnify"
            hide-details
            single-line
            placeholder="Search Posts"
            color="accent"
            v-model="searchTerm"
            @input="handleSearchPosts"
          ></v-text-field>

          <!-- SEARCH RESULT Card -->
          <v-card
            dark
            v-if="searchResults.length"
            id="search__card"
          >
            <v-list>
              <v-list-item
                v-for="result in searchResults"
                :key="result._id"
                @click="goToSearchResult(result._id)"
              >
                <v-list-item-title>
                  {{ result.title }} -
                  <span class="font-weight-thin">{{ formatDescription(result.description) }}</span>
                </v-list-item-title>

                <!-- will show if you have favorited the searched Post
                    by showing the Favorite Icon  -->
                <!-- <v-list-item-action
                  v-if="checkIfUserFavorite(result._id)"
                >
                  <v-icon large>mdi-heart</v-icon>
                </v-list-item-action> -->

                <v-list-item-action
                  v-if="checkIfUserFavorite(result._id)"
                >
                  <v-icon large >mdi-heart</v-icon>
                </v-list-item-action>

              </v-list-item>
            </v-list>
          </v-card>

          <v-spacer></v-spacer>

          <!-- HOrizontal Navbar LINKs -->
          <v-toolbar-items>
            <v-btn
              depressed
              dark
              color="primary"
              elevation="0"
              v-for="item in horizontalNavItems"
              :key="item.title"
              :to="item.link"
              exact
            >
              <v-icon left>{{item.icon}}</v-icon>
              {{item.title}}
            </v-btn>

            <!-- Profile Button -->
            <v-btn
              depressed
              elevation="0"
              to="/profile"
              color="primary"
              v-if="user"
            >
              <!-- BADGE Icon -->
              <v-icon
                class="hidden-sm-only"
                left
              >
                mdi-account-box-multiple-outline
              </v-icon>

              <!-- this badge will tell how many favorites user has -->
              <v-badge
                right
                color="red lighten-2"
                v-if="userFavorites.length"
                :class="{
                  'bounce': badgeAnimated
                }"
              >
                <!-- BADGE ICON -->
                <span slot="badge">{{ userFavorites.length }}</span>
                Profile
              </v-badge>
            </v-btn>

            <!-- Sign Out Button  -->
            <v-btn
              depressed
              elevation="0"
              v-if="user"
              color="primary"
              @click="handleSignOutUser"
            >
              <v-icon
                class="hidden-sm-only"
                left
              >
                mdi-exit-run
              </v-icon>
              Signout
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
      </v-card>

      <!-- <v-spacer></v-spacer> -->

      <!-- App Content -->
      <main>
        <v-container class="mt-4">
          <transition
            name="slide"
            mode="out-in"
          >
            <router-view />
          </transition>
          <!-- Using Authentication Snackbar -->
          <v-snackbar
            :timeout='4000'
            v-model="authSnackbar"
            color="success"
            bottom
            left
          >
            <v-icon class="mr-3">
              mdi-shield-check-outline
            </v-icon>
            <h3>You are now signed in</h3>
            <v-btn
              dark
              elevation="0"
              @click="authSnackbar = false"
            >
              Close
            </v-btn>
          </v-snackbar>

          <!-- Using Authentication ERROR Snackbar -->
          <v-snackbar
            v-if="authError"
            :timeout='4500'
            v-model="authErrorSnackbar"
            color="warning"
            bottom
            left
          >
            <v-icon class="mr-3">
              mdi-cancel
            </v-icon>
            <h3>{{authError.message}}</h3>
            <v-btn
              dark
              elevation="0"
              to="/signin"
            >
              Go to Sign In
            </v-btn>
          </v-snackbar>
        </v-container>
      </main>

    </v-app>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "App",
  created() {
    console.log("app created : user = ", this.$store);
  },

  data() {
    return {
      sideNav: false,
      authSnackbar: false,
      authErrorSnackbar: false,
      badgeAnimated: false, // <<--- this will animate the notification if there is new favorite
      searchTerm: '',  // <<-- for searching Posts
    };
  },
  watch: {
    authError(newValue) {
      // if auth error is not null, show auth error snackbar
      if (newValue !== null) {
        this.authErrorSnackbar = true;
      }
    },

    // this watcher for user will ensure AuthSnackbar will not show everytime we visit the page. And only just after signing in
    user(newValue, oldValue) {
      // if we had no value for user before, show snackbar
      console.log("new user Value: ", newValue);
      console.log("old user Value: ", oldValue);

      if (oldValue === null) {
        this.authSnackbar = true;
      }
    },
    // user: {
    //   handler(newValue, oldValue) {
    //     // if we had no value for user before, show snackbar
    //     console.log("new user Value: ", newValue);
    //     console.log("old user Value: ", oldValue);

    //     if (oldValue === null) {
    //       this.authSnackbar = true;
    //     }
    //   },
    //   deep: true,
    // },

    /**
     * a watch method for userFavorites to animate the Profile badge if
     * there is a new favorite
     */
    userFavorites(value) {
      // if user favorites value changed at all
      console.log('badge animate triggered:')
      if ( value ) {
        this.badgeAnimated = true;
        setTimeout(() => {this.badgeAnimated = false}, 1000) //=> this will stop the animation
      }
    },
  },
  methods: {
    handleSignOutUser() {
      this.$store.dispatch("signOutUser");
    },
    toggleSideNav() {
      // console.log("toggle triggered");
      this.sideNav = !this.sideNav;
    },
    // will handle the Search of Posts
    handleSearchPosts() {
      this.$store.dispatch('searchPosts', {
        searchTerm: this.searchTerm
      })
    },
    goToSearchResult(resultId) {
      // Clear search term on this component
      this.searchTerm = '';
      // Go to desired result
      this.$router.push(`/posts/${resultId}`)
      // Clear the searh array results of Posts
      this.$store.commit('clearSearchResults')
    },

    // for formatting the result description
    formatDescription(description) {
      // This Algorithm will limit the text displayed and put a dot dot dot ... ellipsis algorithm
      return description.length > 20 ? `${description.slice(0, 20)}...` : description
    },
    checkIfUserFavorite(resultId) {

      console.log('checkIfUserFavorite')

      // ISSUE FIX:  declaring the "isFavorite variable because returning directly by using the && statement is NOT REACTIVE"
      let isFavorite =
        this.userFavorites &&
        this.userFavorites.some(fave => fave._id === resultId)

      console.log("isFavorite: ", isFavorite)

      return isFavorite

    }
  },
  computed: {
    ...mapGetters([
      "user",
      "authError",
      "userFavorites",
      "searchResults"
      ]),

    // searchResults() {   <<=== no need for this because already on the mapGetters
    //   return this.$store.getters.searchResults
    // },

    horizontalNavItems() {
      // this is for changing the list of links to be displayed
      // once the user logged in
      let items = [
        { icon: "mdi-magnify", title: "Posts", link: "/posts" },
        { icon: "mdi-lock-open-outline", title: "Sign In", link: "/signin" },
        { icon: "mdi-login-variant", title: "Sign Up", link: "/signup" },
      ];

      // if user not null
      if (this.user) {
        items = [
          {
            icon: "mdi-chat-processing-outline",
            title: "Posts",
            link: "/posts",
          },
          { icon: "mdi-file-star", title: "Create Post", link: "/post/add" },
          // {
          //   icon: "mdi-account-box-multiple-outline",
          //   title: "Sign Up",
          //   link: "/signup",
          // },
        ];
      }

      return items;
    },
    sideNavItems() {
      let items = [
        { icon: "mdi-magnify", title: "Posts", link: "/posts" },
        { icon: "mdi-lock-open-outline", title: "Sign In", link: "/signin" },
        { icon: "mdi-login-variant", title: "Sign Up", link: "/signup" },
      ];

      // if user not null
      if (this.user) {
        items = [
          {
            icon: "mdi-chat-processing-outline",
            title: "Posts",
            link: "/posts",
          },
          { icon: "mdi-file-star", title: "Create Post", link: "/post/add" },
          // {
          //   icon: "mdi-account-box-multiple-outline",
          //   title: "Sign Up",
          //   link: "/signup",
          // },
        ];
      }

      return items;
    },
  },
};
</script>

<style lang="scss">
h1 {
  font-weight: 400;
  font-size: 2.5rem;
}

h2 {
  font-weight: 400;
  font-size: 2rem;
}


.slide-enter-active {
  animation: slide-in 200ms ease-out forwards;
}

.slide-leave-active {
  animation: slide-out 200ms ease-out forwards;
}

@keyframes slide-in {
  from {
    transform: translateX(-25px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-out {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-25px);
    opacity: 0;
  }
}

/* For animating the Notification badge When there is a new Liked Posts */
/* User Favorite Animation */
.bounce {
  animation: bounce 1s both;
}

@keyframes bounce {
  0%, 20%, 53%, 50%, 100% {
    transform: translate3d(0, 0, 0)
  }
  40%, 43% {
    transform: translate3d(0, -20px, 0)
  }
  70% {
    transform: translate3d(0, -10px, 0)
  }
  90% {
    transform: translate3d(0, -4px, 0)
  }
}


/* Style for Search dropdown result card*/
#search__card {
  position: absolute;
  width: 100vw;
  z-index: 1000; // set to 8 just to make sure it's above everything
  top: 100%; // 100% of the
  left: 0%;

}

</style>
