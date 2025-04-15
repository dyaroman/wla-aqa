import { createApp } from 'vue';
import { createPinia } from 'pinia';

import './styles/index.scss';
import App from './App.vue';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount('#app');

console.log('app commit:', __APP_COMMIT__);
