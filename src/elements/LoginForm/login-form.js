import Vue from 'vue'
import wrap from '@vue/web-component-wrapper'
import VueCustomElement from 'vue-custom-element'

import LoginForm from './LoginForm.vue'

Vue.use(VueCustomElement)
Vue.customElement('login-form', LoginForm)
