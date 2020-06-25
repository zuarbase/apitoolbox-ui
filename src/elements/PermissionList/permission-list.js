import Vue from 'vue'
import wrap from '@vue/web-component-wrapper'
import VueCustomElement from 'vue-custom-element'

import PermissionList from './PermissionList.vue'

Vue.use(VueCustomElement)
Vue.customElement('permission-list', PermissionList)
