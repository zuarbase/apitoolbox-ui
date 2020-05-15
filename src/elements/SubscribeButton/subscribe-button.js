import Vue from 'vue'
import wrap from '@vue/web-component-wrapper'
import VueCustomElement from 'vue-custom-element'

import SubscribeButton from './SubscribeButton.vue'

Vue.use(VueCustomElement)
Vue.customElement('subscribe-button', SubscribeButton)
