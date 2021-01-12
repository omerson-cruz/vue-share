import Vue from "vue";
import Vuetify from "vuetify/lib";
import colors from "vuetify/es5/util/colors";
import "vuetify/dist/vuetify.min.css";
// import '@fortawesome/fontawesome-free/css/all.css'
import "@mdi/font/css/materialdesignicons.css";

// WEb Reference for Material Design
// https://cdn.materialdesignicons.com/5.4.55/

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#03a9f4",
        secondary: "#81D4FA",
        accent: colors.red.accent1,
        error: "#f44336",
        warning: "#ff5722",
        info: "#2196f3",
        success: "#4caf50",
      },
    },
  },

  // need to explicity tell which icon to use
  icons: {
    iconfont: "mdi",
  },
});

{
}
