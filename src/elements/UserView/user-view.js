import Vue from 'vue'
import wrap from '@vue/web-component-wrapper'
import VueCustomElement from 'vue-custom-element'

import UserView from './UserView.vue'

Vue.use(VueCustomElement)
Vue.customElement('user-view', UserView)
