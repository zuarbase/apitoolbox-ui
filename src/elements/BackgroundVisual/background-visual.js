import Vue from 'vue'
import VueCustomElement from 'vue-custom-element'

import BackgroundVisual from './BackgroundVisual.vue'

Vue.use(VueCustomElement)
Vue.customElement('background-visual', BackgroundVisual)
