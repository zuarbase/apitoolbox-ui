import Vue from 'vue'
import wrap from '@vue/web-component-wrapper'
import VueCustomElement from 'vue-custom-element'

import LoginForm from './elements/LoginForm/LoginForm.vue'
import SignUpForm from './elements/SignUpForm/SignUpForm.vue'
import UserAddButton from './elements/UserAddButton/UserAddButton.vue'
import UserEditModal from './elements/UserEditModal/UserEditModal.vue'
import UserList from './elements/UserList/UserList.vue'

Vue.use(VueCustomElement)
Vue.customElement('login-form', LoginForm)
Vue.customElement('sign-up-form', SignUpForm)
Vue.customElement('user-add-button', UserAddButton)
Vue.customElement('user-edit-modal', UserEditModal)
Vue.customElement('user-list', UserList)
