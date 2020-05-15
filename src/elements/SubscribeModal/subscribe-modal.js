import Vue from 'vue';
import wrap from '@vue/web-component-wrapper';
import VueCustomElement from 'vue-custom-element';

import SubscribeModal from './SubscribeModal.vue';

Vue.use(VueCustomElement);
Vue.customElement('subscribe-modal', SubscribeModal);
