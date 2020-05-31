import Vue from 'vue';
import wrap from '@vue/web-component-wrapper';
import VueCustomElement from 'vue-custom-element';

import LoginForm from './elements/LoginForm/LoginForm.vue';
import SignUpForm from './elements/SignUpForm/SignUpForm.vue';
import SubscribeModal from './elements/SubscribeModal/SubscribeModal.vue';
import SubscriptionList from './elements/SubscriptionList/SubscriptionList.vue';
import UserAddButton from './elements/UserAddButton/UserAddButton.vue';
import UserEditModal from './elements/UserEditModal/UserEditModal.vue';
import UserList from './elements/UserList/UserList.vue';
import UserPasswordChangeModal from './elements/UserPasswordChangeModal/UserPasswordChangeModal.vue';

Vue.use(VueCustomElement);
Vue.customElement('login-form', LoginForm);
Vue.customElement('sign-up-form', SignUpForm);
Vue.customElement('subscribe-modal', SubscribeModal);
Vue.customElement('subscription-list', SubscriptionList);
Vue.customElement('user-add-button', UserAddButton);
Vue.customElement('user-edit-modal', UserEditModal);
Vue.customElement('user-list', UserList);
Vue.customElement('user-password-change-modal', UserPasswordChangeModal);

export {
	LoginForm,
	SignUpForm
}
