import Vue from 'vue'
import VueCustomElement from 'vue-custom-element'

import ConfirmationModal from './ConfirmationModal.vue'

Vue.use(VueCustomElement)
Vue.customElement('confirmation-modal', ConfirmationModal)
