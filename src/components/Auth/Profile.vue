<template>
   <!-- text-xs-center is for centering the text but already deprecated
        use the "text-sm-center" instead. NO more "xs" for text I think
    -->
   <v-container
      class="text-sm-center"
    >
     <!-- User Details Card -->
     <v-row>
        <v-col
          sm="6"
          offset-sm="3"
        >
          <v-card class="white--text" color="secondary">
            <v-row>
              <v-col xs="5">
                <v-img
                  height="125px"
                  contain
                  :src="user.avatar"
                >
                </v-img>
              </v-col>

              <!-- 2nd col -->
              <v-col xs="7">
                <v-card-title class="text--primary">
                  <div>
                    <div class="text-h4">{{user.username}}</div>
                    <div>Joined {{ formatJoinDate(user.joinDate)}}</div>
                    <div class="hidden-xs-only font-weight-thin">{{user.favorites.length}} Favorites</div>
                    <div class="hidden-xs-only font-weight-thin">{{ userPosts.length }} Posts Added</div>
                  </div>
                </v-card-title>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
     </v-row>

     <!-- POSTS FAVORITED BY USER -->
     <v-container
      v-if="!userFavorites.length"
     >
      <v-row class="flex-wrap">
        <v-col xs="12">
          <h1>You have no favorites currently</h1>
        </v-col>
      </v-row>
     </v-container>

      <!-- else display posts if there are Favorites -->
      <v-row
        v-else
      >
        <v-col xs="12">
          <h2 class="font-weight-light">
            Favorited
            <span class="font-weight-regular">{{userFavorites.length}}</span>
          </h2>
        </v-col>
        <v-container>
          <v-row
          class="flex-wrap"
        >
          <v-col xs="12" sm="6"
            v-for="favorite in userFavorites"
            :key="favorite._id"
          >
            <v-card class="mt-3 ml-1 mr-2" hover>
              <v-img
                @click="goToPost(favorite._id)"
                height="30vh"
                :src="favorite.imageUrl"
              >
              </v-img>
              <v-card-text>
                {{favorite.title}}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        </v-container>
        <!-- A row inside the v-col -->

      </v-row>

      <!-- SHOWING ALL POSTS CREATED BY USER -->
      <v-container v-if="!userPosts.length">
        <v-row class="flex-wrap">
          <v-col xs="12">
            <h2>You have no posts currently. Go and add some!</h2>
          </v-col>
        </v-row>
      </v-container>

        <!-- else show the User's posts -->
      <v-container v-else class="mt-3">
        <v-col xs="12"> <!-- Notice how this is under v-container and yet still working even not under directly of v-row -->
          <h2 class="font-weight-light">Your Posts
            <span class="font-weight-regular">({{userPosts.length}}) </span>
          </h2>
        </v-col>

        <!-- Contains the Actual list of User's Posts-->
        <v-row class="flex-wrap">
          <v-col
            xs="12"
            sm="6"
            v-for="post in userPosts"
            :key="post._id"
          >
            <v-card class="mt-3 ml-1 mr-2" hover>
              <v-btn color="info" floating fab small dark class="mx-2 my-2"
                @click="loadPost(post)"
              >
                <v-icon>
                  mdi-lead-pencil
                </v-icon>
              </v-btn>
              <v-btn color="error" floating fab small dark class="mx-2 my-2"
                @click="handleDeleteUserPost(post)"
              >
                <v-icon>
                  mdi-delete
                </v-icon>
              </v-btn>

              <v-img
                @click="goToPost(post._id)"
                height="30vh"
                :src="post.imageUrl"
              >
              </v-img>
              <v-card-text>
                {{post.title}}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- EDIT POST DIALOG BOX -->
      <v-row justify="center">
        <v-dialog
          max-width="800px"
          v-model="editPostDialog"
          persistent
        > <!-- the Persistent props for dialog will only close the dialog box once clicked a cancel button -->

          <v-card>
            <v-card-title class="headline grey lighten-2"> Update Post </v-card-title>
          <!-- EDIT FORM  -->
            <v-form
              @submit.prevent="handleUpdateUserPost"
              v-model="isFormValid"
              lazy-validation
              ref="form"
            >
              <!--"isFormValid" will prevent the form from submitting if any of the form validation has error  -->

              <v-container>
                  <!-- Title Input -->
                <v-row justify="center">
                  <v-col cols="11">
                    <v-text-field
                      v-model="title"
                      label="Post Title"
                      type="text"
                      required
                      :rules="titleRules"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <!-- Image Url Input -->
                <v-row justify="center">
                  <v-col cols="11">
                    <v-text-field
                      v-model="imageUrl"
                      label="Image URL"
                      type="text"
                      required
                      :rules="imageRules"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>

                <!-- Image Preview -->
                <v-row justify="center">
                  <v-col cols="11">
                    <img
                      :src="imageUrl"
                      height="300px"
                    >
                  </v-col>
                </v-row>

                <!-- Select Input for Categories -->
                <v-row justify="center">
                  <v-col cols="11">
                    <v-select
                      v-model="categories"
                      :items="['Art', 'Education', 'Travel', 'Photography', 'Technology', 'Food', 'Nature']"
                      multiple
                      label="Categories"
                      :rules="categoriesRules"
                    >

                    </v-select>
                  </v-col>
                </v-row>

                <!-- Description Area -->
                <v-row justify="center">
                  <v-col cols="11">
                    <v-textarea
                      :rules="descRules"
                      v-model="description"
                      label="Description"
                      type="text"
                    >
                    </v-textarea>
                  </v-col>
                </v-row>

                <!-- THIS BUTTON is normally for FORMS NOT IN A DIALOG BOX -->
                <!-- <v-row>
                  <v-col xs="12">
                    <v-btn
                      color="accent"
                      type="submit"
                      :loading="loading"
                      :disabled="!isFormValid || loading"
                    >
                      Submit
                    </v-btn>
                  </v-col>
                </v-row> -->

                <!-- Submit Form button -->
                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn :disabled="!isFormValid" type="submit" class="succcess--text" text>Update</v-btn> <!-- will SUBMIT the FORM -->
                  <v-btn class="error--text" text @click="editPostDialog = false">Cancel</v-btn>
                </v-card-actions>
              </v-container>

            </v-form>
          <!-- END - EDIT FORM -->
          </v-card>
        </v-dialog><!-- END OF EDIT POST DIALOG BOX -->
      </v-row>
   </v-container> <!-- END of MAIN Container -->
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment'

export default {
  name: "Profile",

  data() {
    return {
      editPostDialog: false,

      // FORM RELATED DATA (copied and pase directly from "AddPost.vue"
      //    without any code modification except for the form's submit function handler)
      isFormValid: true,
      title: "",
      imageUrl: "",
      categories: [],
      description: "",
      titleRules: [
        (title) => !!title || "Title is required",
        (title) =>
          title.length < 20 || "Title must have less than 20 characters",
      ],
      imageRules: [(image) => !!image || "Image is required"],
      categoriesRules: [
        (categories) =>
          categories.length >= 1 || "At least one category is required",
      ],
      descRules: [
        (desc) => !!desc || "Description is required",
        (desc) =>
          desc.length < 200 || "Description should be less than 200 characters",
      ],

      // END - FORM RELATED DATA
    }
  },

  computed: {
    ...mapGetters([
      "user",
      "userFavorites",
      "userPosts"
    ])
  },
  methods: {
    // this will get the User's own posts
    handleGetUserPosts() {
      this.$store.dispatch('getUserPosts', {
        // payload here
        userId: this.user._id
      })
    },

    // Dialog Form's handler for submit
    handleUpdateUserPost() {

      console.log('handleUpdateUserPost->user id: ', this.user._id)

      if(this.$refs.form.validate()) { // make sure to trigger the Form's lazy validation
        this.$store.dispatch('updateUserPost', {
          postId: this.postId,
          userId: this.user._id,  //--> this will come from the USER itself
          title: this.title,
          imageUrl: this.imageUrl,
          categories: this.categories,
          description: this.description
        })

        this.editPostDialog = false; // this will close the dialog once updated the backend and at the Vuex Store side
      }
    },

    // delete user post
    handleDeleteUserPost(post) {
      // we are "reusing" the code for loading the User Post.
      // but we are sending false for second argv2 because we do not want to open the dialog box, instead we are going to have  a confirm message before deleting
      this.loadPost(post, false)

      const deletePost = window.confirm('Ar you sure you want delete this Post?')

      if(deletePost) {
        this.$store.dispatch('deleteUserPost', {
          postId: this.postId
        })
      }

    },

    // this will load the post for the EDIT POST DIALOG BOX
    loadPost({_id, title, imageUrl, categories, description}, editPostDialog = true) {
      // by default you wanna open the dialog when Edit button is clicked of course
      this.editPostDialog = editPostDialog
      this.postId = _id
      this.title = title
      this.imageUrl = imageUrl
      this.categories = categories
      this.description = description

    },

    // Format Join Date
    formatJoinDate(date) {
      // Don't forget the + sign in front of date to convet to INT because it was stored as "String" on the backend
      return moment(new Date(+date)).format('ll')
    },

    // Route to the Image's Post page
    goToPost(id) {
      this.$router.push(`/posts/${id}`)
    }
  },

  created() {
    // this will get the User's own Array of Posts
    this.handleGetUserPosts()
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
  }
};
</script>

<style scoped>
</style>,