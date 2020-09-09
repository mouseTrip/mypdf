import Vue from 'vue'
import { Button } from 'element-ui'
import App from './App.vue'

Vue.use(Button)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
