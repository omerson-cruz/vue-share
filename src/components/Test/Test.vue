<template>

</template>

<script>
export default {
  name: "TestPage",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    handleSignInUser() {
      this.$store.dispatch("signinUser", {
        username: this.username,
        password: this.password,
      });
    },
  },
};
</script>

<style scoped>
</style>,