import { createApp } from 'vue';

import './styles/index.scss';
import App from './App.vue';

createApp(App).mount('#app');

console.log('app commit:', __APP_COMMIT__);
