import Vue from 'vue'
import wrap from '@vue/web-component-wrapper'
import VueCustomElement from 'vue-custom-element'

import PermissionEditModal from './PermissionEditModal.vue'

Vue.use(VueCustomElement)
Vue.customElement('permission-edit-modal', PermissionEditModal)
