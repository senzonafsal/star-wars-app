import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/dist/vuetify.min.css";

// Creating a Vuetify instance with the imported components and directives
const vuetify = createVuetify({
	components,
	directives,
});

// Creating the Vue application, configuring plugins, and mounting the application to the DOM element with the id "app"
createApp(App).use(vuetify).use(router).use(store).mount("#app");
