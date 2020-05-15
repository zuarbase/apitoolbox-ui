import Vue from 'vue'
import wrap from '@vue/web-component-wrapper'
import VueCustomElement from 'vue-custom-element'

import SubscriptionList from './SubscriptionList.vue'

Vue.use(VueCustomElement)
Vue.customElement('subscription-list', SubscriptionList)
