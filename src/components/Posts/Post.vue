<template>
  <v-container
    v-if="getPost"
    class="mt-3"

  >
    <h1>Post Name: {{ getPost.title }} </h1>

    <!-- POST CARD -->
    <v-row
      class="flex-wrap"
    >     <!-- v-row superceded the v-layout from v1.x | also no need to use the "wrap" props property just like in v-layout because v-row is automatically wrapped except if you use the class helper >> class="flex-nowrap" -->
      <v-col
        xs="12"
      > <!-- v-col superceded the v-flex from v1.x | also NO need to use the "wrap" props property just like in v-layout because v-row is automatically wrapped except if you use the class helper >> class="flex-nowrap" -->

        <v-card hover>
          <v-card-title>
            <h1>{{getPost.title}}</h1>
            <v-btn @click="handleToggleLike" large icon v-if="user" > <!-- needs to check in computed values if there is user -->
              <v-icon large
                :color="checkIfPostLiked(getPost._id) ? 'red' : 'grey'"
                >mdi-heart
              </v-icon>
            </v-btn>
            <h3 class="ml-3 font-weight-thin"> {{ getPost.likes}} LIKES  </h3>
            <v-spacer></v-spacer>
            <!-- Will ROUTE back TO PREVIOUS PAGE | go back to previous page -->
            <v-icon @click="goToPreviousPage" color="info" large>mdi-arrow-left-bold</v-icon>
          </v-card-title>

          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">

            <!-- <v-card-media >  </v-card-media> -->
            <!-- Vcard Media is already deprecated use the "v-img instead" -->
            <v-img
              :src="getPost.imageUrl"
              id="post__image"
              v-bind="attrs"
              v-on="on"
              @click="toggleImageDialog"
            > <!-- need to set -->
            </v-img>
            </template>
            <span>Click to enlarge image</span>
          </v-tooltip>

          <!-- DIALOG BOX will open for the ENLARGED Post image when clicked -->
        <v-dialog v-model="dialog">
          <v-card>
            <v-img
              :src="getPost.imageUrl"
              id="post__image"
              min-height="80vh"
            > </v-img>
          </v-card>
        </v-dialog>

        <v-card-text>
          <span
            v-for="(category, index) in getPost.categories"
            :key="index"
            class="mr-2"
          >
            <v-chip class="mb-3" color="accent" text-color="white">
              {{category}} - {{ index}}
            </v-chip>
          </span>
          <h3>{{getPost.description}}</h3>
        </v-card-text>

        </v-card>
      </v-col>

    </v-row>


    <!-- ADD MESSAGES SECTION -->
    <div class="mt-3">
      <!-- Message Input -->
        <v-form
          ref="form"
          @submit.prevent="handleAddPostMessage"
          v-model="isFormValid"
          lazy-validation
          >
            <v-row class="mb-3" v-if="user">
              <v-col xs="12">
                <!-- :append-outer-icon will conditionally show two different icons wether messageBody is empty string or not-->
                <v-text-field
                  clearable
                  :append-outer-icon="messageBody && 'mdi-send'"
                  prepend-icon="mdi-email"
                  label="Add Message"
                  type="text"
                  v-model="messageBody"
                  required
                  @click:append-outer="handleAddPostMessage"
                  :rules="messageRules"
                >
                <!-- the @click:append-outer will handle post message when the icon is clicked which is part of this v-text-field -->
                </v-text-field>
              </v-col>
            </v-row>
        </v-form>
      <!-- End - Add Messages Section -->

      <!--  -->

      <!-- MESSAGE LIST SECTION -->
      <v-row>
        <v-col xs="12">
          <v-list subheader two-line>
            <v-subheader> Messages ({{getPost.messages.length }}) </v-subheader>
            <!-- Notice how we use the :key value in the divider instead of the template itself -->
            <!-- Loop through the messages -->
            <template v-for="message in getPost.messages">
              <v-divider inset :key="message._id"></v-divider>
                <!-- v-list-tile  is deprecated and is NOW v-list-item  -->
                <v-list-item inset :key="message.title">
                  <v-list-item-avatar>
                    <img :src="message.messageUser.avatar" alt="">
                  </v-list-item-avatar>

                  <!-- v-list item content -->
                  <v-list-item-content>
                    <v-list-item-title>
                      {{message.messageBody}}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{message.messageUser.username}}
                      <!-- below span message will only be seen greater than xs device size -->
                      <span class="grey--text text--lighten-1 hidden-xs-only">{{ getTimeFromNow(message.messageDate) }}</span>
                    </v-list-item-subtitle>
                  </v-list-item-content>

                  <!-- List Item Action -->
                  <v-list-item-action class="hidden-xs-only">
                    <v-icon :color="checkIfOwnMessage(message) ? 'accent' : 'grey'">mdi-chat</v-icon>
                  </v-list-item-action>

                </v-list-item>
            </template>
          </v-list>
        </v-col>

      </v-row>
    </div>

  </v-container>

</template>

<script>
import { mapGetters } from 'vuex';
import { GET_POST, ADD_POST_MESSAGE, LIKE_POST, UNLIKE_POST } from "../../store/queries";
import moment from 'moment'

export default {
  name: "Post",
  data() {
    return {
      postLiked: false,
      dialog:false,
      messageBody: '',
      isFormValid: true,
      messageRules: [
        message => !!message || 'Message is required',
        message => {
          // due to error when reading the message length ( This is my own code fix).
          // Probably due to reactivity issue
          if (message) {
            return message.length < 50 || 'Message must be less than 50 characters'
          }
          return false
        }
      ]
    };
  },
  props: ["postId"],
  apollo: {
    getPost: {
      query: GET_POST,
      variables() {
        return {
          postId: this.postId,
        };
      },
    },
  },

  // ============== computed ==============
  computed: {
    ...mapGetters([
      'user', // for the button on getPost,
      'userFavorites' // for checking if the user has liked/favorited this Post
      ]),

  },

  methods: {
    goToPreviousPage() {
      // Vue Router algorithm to go back to previous page
      this.$router.go(-1)
    },

    // Toggle the image Dialog Box with full SIZE IMAGE only if the Device Screen SIze is greater than 500px
    toggleImageDialog() {
      if(window.innerWidth > 500) {
        this.dialog = !this.dialog
      }
    },

    // will handle the sending of Message Comment for the Post
    handleAddPostMessage(){

      console.log('validation: ', this.$refs.form)

      // Once lazy validation is triggered and returns true then we can proceed on adding this message to the view
      if(this.$refs.form.validate()) {
              // first let's create the variables to be sent against this mutation
        const variables = {
          messageBody: this.messageBody,
          userId: this.user._id,  //==> from the MapGetter
          postId: this.postId    //==> from the apollo
        }

        this.$apollo.mutate({
          mutation: ADD_POST_MESSAGE,
          variables,

          // similar to what we did to the "ADD POST" part of this project (in the vuex's "addPost" action)
          // we are going to use the "update" function property of the mutation/query
          update: (cache, {data: {addPostMessage}}) => {
            //  so below we are going to get the "readQuery "
            const data = cache.readQuery({
              query: GET_POST,
              variables: { postId: this.postId }
            })

            // This is the data cached from GET_POST query above when this Post Page loaded
            console.log('This is data from cached "GET_POST', data)
            console.log('newly added data to be added to the cache', addPostMessage)

            // So after getting the data we need to use "unshift" to put the new message in front of the message array
            data.getPost.messages.unshift(addPostMessage)

            // Now we need to write the data back to the query using cache.writeQuery
            cache.writeQuery({
              query: GET_POST,
              variables: { postId: this.postId},
              data
            })
          }
        }).then(({ data }) => {
          // after receiving the data we are going to clear the "Form" input
          this.$refs.form.reset()
          console.log("data.addPostMessage: ", data.addPostMessage)
        })
      }
    },
    checkIfOwnMessage(message) {
      // so if there is user object and this user's id is same to the message's User id then return true
      // to make the highlighting orange on the chat icon
      return this.user && this.user._id === message.messageUser._id
    },

    // attached to heart Icon
    checkIfPostLiked(postId) {
        // check if user's favorites includes post with an ID of the Post ID where we are currently at.
        // In order to that we need to call the user's favorites from our Vuex Store.
        if (this.userFavorites && this.userFavorites.some(fave => fave._id === postId)) {
          // if above condition is true and found in the user's favorites then
          this.postLiked = true
          return true
        } else {
          this.postLiked = false
          return false
        }
    }
    ,

    // TOGGLE LIKE and UNLIKE POST heart button
    handleToggleLike() {
      if (this.postLiked) {
        this.handleUnlikePost()
      } else {
        this.handleLikePost()
      }
    },

    // LIKE POST handler
    handleLikePost() {
      const variables = {
        postId: this.postId,
        username: this.user.username,
      }

      this.$apollo.mutate({
        mutation: LIKE_POST,
        variables,
        // here again we're using "update" function to make sure that when we execute like post
        update: (cache, {data: { likePost }}) => {
          const data = cache.readQuery({
            query: GET_POST,
            variables: { postId: this.postId}
          })

          data.getPost.likes += 1

          cache.writeQuery({
            query: GET_POST,
            variables: {postId: this.postId},
            data  //==> this will pass in the new data
          })

        }
      }).then(( {data} ) => {

        // Watch the Process and explanation
        // [[12 - 2 @ 05:30  -- on why we console.log the user and like post below ]]
        console.log('user: ', this.user)
        console.log('like post', data.likePost)

        // After getting the "LikeFaves" result from the server it's time to udpate our user on the frontend to reflect the liked or favorited photo
        const updatedUser = {
          ...this.user,
          favorites: data.likePost.favorites
        }
        // after creating the new object for the new user let's commit changes to the store where the user is stored
        this.$store.commit('setUser', updatedUser)

      }).catch( err => console.log(err))
    },

    // UNLIKE POST handler
    handleUnlikePost() {
      const variables = {
        postId: this.postId,
        username: this.user.username,
      }

      this.$apollo.mutate({
        mutation: UNLIKE_POST,
        variables,
        // here again we're using "update" function to make sure that when we execute like post
        update: (cache, {data: { likePost }}) => {
          const data = cache.readQuery({
            query: GET_POST,
            variables: { postId: this.postId}
          })

          data.getPost.likes -= 1

          cache.writeQuery({
            query: GET_POST,
            variables: {postId: this.postId},
            data  //==> this will pass in the new data
          })

        }
      }).then(( {data} ) => {

        // Watch the Process and explanation
        // [[12 - 2 @ 05:30  -- on why we console.log the user and like post below ]]
        console.log('user: ', this.user)
        console.log('like post', data.likePost)

        // After getting the "LikeFaves" result from the server it's time to udpate our user on the frontend to reflect the liked or favorited photo
        const updatedUser = {
          ...this.user,
          favorites: data.unlikePost.favorites
        }
        // after creating the new object for the new user let's commit changes to the store where the user is stored
        this.$store.commit('setUser', updatedUser)

      }).catch( err => console.log(err))
    },

    // formatting date for Post Messages
    getTimeFromNow(time) {
      console.log('getTimeFromNow: ', new Date(+time))  //<<== dont forget to convert to an INT by adding (+) in front of time
      return moment(new Date(+time)).fromNow()
    }
  },

  mounted() {
    console.log(this.getPost)
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

};
</script>

<style scoped lang='scss'>
  #post__image {
    height: 400px !important;
  }
</style>,