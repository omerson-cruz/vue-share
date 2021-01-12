<template>
  <v-container
    class="text-sm-center mt-n5 pt-5 px-5"
    style="font-family: Open Sans"
  >
    <!-- TODO: Need to fix the appearance of this form  -->
    <!-- v-layout is already deprecated  -->
    <!-- Sign Up Title -->
    <v-row>
      <v-col
        xs="12"
        sm="6"
        offset-sm="3"
      >
        <h1>Get Started Here</h1>
      </v-col>
    </v-row>

    <!-- Error ALert Componennt -->
    <v-row v-if="error">
      <v-col transition="scale-transition">
        <!-- Using the Global Component Form-Alert -->
        <form-alert :message="error.message"></form-alert>
      </v-col>
    </v-row>

    <!-- Signin Form  -->
    <v-row>
      <v-col
        xs="12"
        sm="6"
        offset-sm="3"
      >
        <v-card
          color="secondary"
          dark
        >
          <v-container>
            <v-form
              @submit.prevent="handleSignUpUser"
              v-model="isFormValid"
              lazy-validation
              ref="form"
              class="px-2"
            >
              <!--"isFormValid" will prevent the form from submitting if any of the form validation has error
                Also the "lazy-validation" will allow the form to Only validate once user started doing input.
                Ofcourse you dont want the error such as "username is required" if user just happens to see the page right. So lazy validation willl only trigger the validation once user started cliciking the input fields
              -->
              <v-row no-gutters>
                <v-col xs="12">
                  <v-text-field
                    v-model="username"
                    prepend-icon="mdi-face"
                    label="Username"
                    type="text"
                    required
                    :rules="usernameRules"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <!-- Email Field -->
              <v-row>
                <v-col xs="12">
                  <v-text-field
                    v-model="email"
                    prepend-icon="mdi-email"
                    label="Email"
                    type="email"
                    required
                    :rules="emailRules"
                  >
                  </v-text-field>
                </v-col>
              </v-row>

              <!-- Password -->
              <v-row>
                <v-col xs="12">
                  <v-text-field
                    v-model="password"
                    prepend-icon="mdi-key"
                    label="Password"
                    type="password"
                    :rules="passwordRules"
                    required
                  >
                  </v-text-field>
                </v-col>
              </v-row>

              <!-- Confirm Password -->
              <v-row>
                <v-col xs="12">
                  <v-text-field
                    v-model="passwordConfirmation"
                    prepend-icon="mdi-gavel"
                    label="Confirm Password"
                    type="password"
                    :rules="passwordRules"
                    required
                  >
                  </v-text-field>
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
                    class="mb-5"
                  >
                    SignUp
                  </v-btn>
                  <h3>
                    Already Have an Account?
                    <router-link to="/Sign In">Sign In</router-link>
                  </h3>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "SignUp",
  data() {
    return {
      isFormValid: true,
      username: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      usernameRules: [
        (username) => {
          return !!username || "Username is required";
        },
        (username) => username.length < 10 || "Username cannot be more than 10",
      ],
      emailRules: [
        (email) => {
          return !!email || "Email is required";
        },
        // using Regular Expression in input validation
        (email) => /.@+./.test(email) || "Email must be valid",
      ],
      passwordRules: [
        (password) => {
          return !!password || "Password is required";
        },
        (password) =>
          password.length >= 4 || "Password must be at least 4 characters",

        // remember that Password Rules is also linked to the "passwordConfirmation" input field
        (confirmation) =>
          confirmation === this.password || "Password must match",
      ],
    };
  },
  computed: {
    ...mapGetters(["error", "loading", "user"]),
  },
  methods: {
    handleSignUpUser() {
      // sign up user action
      if (this.$refs.form.validate()) {
        // with the help of the lazy valiation and the "ref" in the v-form Once the submit button is clicked then we can validate ALL of the inputs and then call the Vuex store to dispatch action to "signUpUser"
        this.$store.dispatch("signUpUser", {
          // below paramaters are based on the GraphQL schema we defined for the SignUp Mutation
          username: this.username,
          email: this.email,
          password: this.password,
        });
      }
    },
  },
  watch: {
    // this will be triggered after SIgnin Up
    user(value) {
      // if user value changes, redirect to home page
      if (value) {
        this.$router.push("/");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>,