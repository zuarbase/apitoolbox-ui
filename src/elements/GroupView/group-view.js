import Vue from 'vue'
import wrap from '@vue/web-component-wrapper'
import VueCustomElement from 'vue-custom-element'

import GroupView from './GroupView.vue'

Vue.use(VueCustomElement)
Vue.customElement('group-view', GroupView)
