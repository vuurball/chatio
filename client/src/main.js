import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm';
import App from './App.vue';
import router from './router';
import store from './store';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import VueSocketIO from 'vue-socket.io';

Vue.config.productionTip = false;
Vue.use(BootstrapVue);

// Socket config
Vue.use(
	new VueSocketIO({
		debug: true,
		connection: `http://localhost:3000/`,
		vuex: {
			store, // Attach the store
			actionPrefix: 'SOCKET_',
			mutationPrefix: 'SOCKET_',
		},
	}),
);

new Vue({
	router,
	store,
	render: function(h) {
		return h(App);
	},
}).$mount('#app');
