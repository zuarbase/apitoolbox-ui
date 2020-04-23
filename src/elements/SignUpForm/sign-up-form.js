import Vue from 'vue'
import wrap from '@vue/web-component-wrapper'
import VueCustomElement from 'vue-custom-element'

import SignUpForm from './SignUpForm.vue'

Vue.use(VueCustomElement)
Vue.customElement('sign-up-form', SignUpForm)
