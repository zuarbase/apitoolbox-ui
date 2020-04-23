import Vue from 'vue'
import wrap from '@vue/web-component-wrapper'
import VueCustomElement from 'vue-custom-element'

import UserList from './UserList.vue'

Vue.use(VueCustomElement)
Vue.customElement('user-list', UserList)
