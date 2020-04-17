import Vue from 'vue'
import wrap from '@vue/web-component-wrapper'
import LoginForm from './elements/LoginForm.vue'
import VueCustomElement from 'vue-custom-element'

Vue.use(VueCustomElement)
Vue.customElement('login-form', LoginForm)
