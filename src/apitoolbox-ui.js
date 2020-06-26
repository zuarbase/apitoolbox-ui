import Vue from 'vue';
import wrap from '@vue/web-component-wrapper';
import VueCustomElement from 'vue-custom-element';

import GroupEditModal from './elements/GroupEditModal/GroupEditModal.vue';
import GroupList from './elements/GroupList/GroupList.vue';
import GroupView from './elements/GroupView/GroupView.vue';
import LoginForm from './elements/LoginForm/LoginForm.vue';
import PermissionEditModal from './elements/PermissionEditModal/PermissionEditModal.vue';
import PermissionList from './elements/PermissionList/PermissionList.vue';
import SignUpForm from './elements/SignUpForm/SignUpForm.vue';
import SubscribeModal from './elements/SubscribeModal/SubscribeModal.vue';
import SubscriptionList from './elements/SubscriptionList/SubscriptionList.vue';
import UserAddButton from './elements/UserAddButton/UserAddButton.vue';
import UserEditModal from './elements/UserEditModal/UserEditModal.vue';
import UserList from './elements/UserList/UserList.vue';
import UserView from './elements/UserView/UserView.vue';

Vue.use(VueCustomElement);
//TODO - add all here
Vue.customElement('login-form', LoginForm);
Vue.customElement('sign-up-form', SignUpForm);
Vue.customElement('subscribe-modal', SubscribeModal);
Vue.customElement('subscription-list', SubscriptionList);
Vue.customElement('user-add-button', UserAddButton);
Vue.customElement('user-edit-modal', UserEditModal);
Vue.customElement('user-list', UserList);
Vue.customElement('user-view', UserView);

export {
	LoginForm,
	SignUpForm
}
