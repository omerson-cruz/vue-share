<template>
  <v-container class="text-sm-center mt-5 pt-5">
    <!-- TODO: Need to fix the appearance of this form  -->
    <!-- v-layout is already deprecated  -->
    <!-- Sign Up Title -->
    <v-row
      no-gutters
      class="flex-wrap"
    >
      <v-col
        cols="12"
        md="6"
        offset-sm="3"
      >
        <!-- Below is how you change the Text color using "{vue color}--text" -->
        <h1 class="accent--text">Add Post</h1>
      </v-col>
    </v-row>

    <!-- Add Post Form  -->
    <v-row class="flex-wrap">
      <v-col
        cols="12"
        sm="6"
        offset-sm="3"
      >

        <v-form
          @submit.prevent="handleAddPost"
          v-model="isFormValid"
          lazy-validation
          ref="form"
        >
          <!--"isFormValid" will prevent the form from submitting if any of the form validation has error  -->

          <!-- Title Input -->
          <v-row>
            <v-col cols="12">
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
          <v-row>
            <v-col cols="12">
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
          <v-row>
            <v-col cols="12">
              <img
                :src="imageUrl"
                height="300px"
              >
            </v-col>
          </v-row>

          <!-- Select Input for Categories -->
          <v-row>
            <v-col xs="12">
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
          <v-row>
            <v-col xs="12">
              <v-textarea
                :rules="descRules"
                v-model="description"
                label="Description"
                type="text"
              >
              </v-textarea>
            </v-col>
          </v-row>

          <!-- button -->
          <v-row>
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
          </v-row>
        </v-form>

      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "AddPost",
  data() {
    return {
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
    };
  },
  computed: {
    ...mapGetters(["loading", "user"]),
  },
  methods: {
    handleAddPost() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("addPost", {
          title: this.title,
          imageUrl: this.imageUrl,
          categories: this.categories,
          description: this.description,
          creatorId: this.user._id,
        });
      }

      this.$router.push("/");
    },
  },
};
</script>

<style>
</style>,