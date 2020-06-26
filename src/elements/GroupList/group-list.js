import Vue from 'vue'
import wrap from '@vue/web-component-wrapper'
import VueCustomElement from 'vue-custom-element'

import GroupList from './GroupList.vue'

Vue.use(VueCustomElement)
Vue.customElement('group-list', GroupList)
