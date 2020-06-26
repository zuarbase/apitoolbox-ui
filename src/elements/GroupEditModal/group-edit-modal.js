import Vue from 'vue'
import wrap from '@vue/web-component-wrapper'
import VueCustomElement from 'vue-custom-element'

import GroupEditModal from './GroupEditModal.vue'

Vue.use(VueCustomElement)
Vue.customElement('group-edit-modal', GroupEditModal)
