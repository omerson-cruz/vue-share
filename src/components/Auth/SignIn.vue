<template>
  <v-container
    class="text-sm-center mt-5 pt-5"
    style="font-family: Open Sans"
  >
    <!-- TODO: Need to fix the appearance of this form  -->
    <!-- v-layout is already deprecated  -->
    <!-- Sign In Title -->
    <v-row>
      <v-col
        xs="12"
        sm="6"
        offset-sm="3"
      >
        <h1>Welcome Back!</h1>
      </v-col>
    </v-row>

    <!-- Error ALert Component -->
    <v-row v-if="error">
      <v-col transition="scale-transition">
        <!-- Using the Global Component Form-Alert -->
        <form-alert :message="error.message"></form-alert>
      </v-col>
    </v-row>

    <!-- Signin Form  -->
    <v-row class="flex-wrap">
      <v-col
        xs="12"
        sm="6"
        offset-sm="3"
      >
        <v-card
          color="secondary"
          dark
          class="px-2"
        >
          <v-container>
            <v-form
              @submit.prevent="handleSignInUser"
              v-model="isFormValid"
              lazy-validation
              ref="form"
            >
              <!--"isFormValid" will prevent the form from submitting if any of the form validation has error  -->
              <v-row>
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
              <v-row class="mb-n3">
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
              <!-- button -->
              <v-row>
                <v-col xs="12">
                  <v-btn
                    color="accent"
                    type="submit"
                    :loading="loading"
                    :disabled="!isFormValid"
                  >
                    Signin
                  </v-btn>
                  <h4 class="my-3">
                    Don't have an account
                    <router-link to="/signup">Sign Up</router-link>
                  </h4>
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
  name: "SignIn",
  data() {
    return {
      isFormValid: true,
      username: "",
      password: "",
      // Vuetify Form validation
      // it is an array of Function for validation rules
      usernameRules: [
        // Check if username in input, the input name variable is not required to
        // be the same as the "username" v-model
        (username) => !!username || "Username is required",
        (username) =>
          username.length < 10 || "Username must be less than 10 characters",
      ],
      passwordRules: [
        // double bang (!!) means to convert into boolean whatever the value of password
        // and then if it is truee then arrow function will evaulate to the true value
        // of !!password. IF false then it will return the value of the String after the || OR operator
        (password) => !!password || "Password is required",
        // Make sure password is at least 7 characters
        (password) =>
          password.length >= 7 || "Password should be more than 7 characters",
      ],
    };
  },
  computed: {
    ...mapGetters(["user", "error", "loading"]),
  },
  watch: {
    user(value) {
      // if user value changes from null to an "object" (w/c means successfully)
      // logged in , then redirect to the home page,
      // router redirection
      if (value) {
        this.$router.push("/");
      }
    },
  },
  methods: {
    handleSignInUser() {
      // Use case for "ref"
      // but remember in lesson of MAX that we should not manipualte the DOM
      // through this ref. Only for chekcing data or properties.
      if (this.$refs.form.validate()) {
        this.$store.dispatch("signinUser", {
          username: this.username,
          password: this.password,
        });
      }
    },
  },
};
</script>

<style>
/* We are not going to use "scoped" SCSS
  since we are going to use this style
  to other parts of the web too
 */

.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>,