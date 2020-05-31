import Vue from 'vue';
import wrap from '@vue/web-component-wrapper';
import VueCustomElement from 'vue-custom-element';

import UserEditModal from './UserEditModal.vue';

Vue.use(VueCustomElement);
Vue.customElement('user-edit-modal', UserEditModal);
