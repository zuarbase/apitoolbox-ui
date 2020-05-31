import Vue from 'vue';
import wrap from '@vue/web-component-wrapper';
import VueCustomElement from 'vue-custom-element';

import UserPasswordChangeModal from './UserPasswordChangeModal.vue';

Vue.use(VueCustomElement);
Vue.customElement('user-password-change-modal', UserPasswordChangeModal);
