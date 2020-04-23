import Vue from 'vue'
import wrap from '@vue/web-component-wrapper'
import VueCustomElement from 'vue-custom-element'

import UserAddButton from './UserAddButton.vue'

Vue.use(VueCustomElement)
Vue.customElement('user-add-button', UserAddButton)
