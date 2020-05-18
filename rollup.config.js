import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import svg from 'rollup-plugin-vue-inline-svg';
import { terser } from "rollup-plugin-terser";
import vue from 'rollup-plugin-vue'

// import gzip from 'rollup-plugin-gzip';
// import uglify from 'rollup-plugin-uglify';
// import postcss from 'rollup-plugin-postcss';

const inputs = [
    'src/apitoolbox-ui.js',
    'src/elements/LoginForm/login-form.js',
    'src/elements/SignUpForm/sign-up-form.js',
    'src/elements/UserAddButton/user-add-button.js',
    'src/elements/UserList/user-list.js',
    'src/elements/SubscribeModal/subscribe-modal.js',
    'src/elements/SubscriptionList/subscription-list.js'
];

const plugins = [
    // postcss({
    //     extensions: ['.css']
    // }),
    replace({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'process.env.BUILD': "'WEB'" // Vuelidate uses this
    }),
    alias({
        entries: {
            'vue': 'vue/dist/vue.runtime.esm.js'
        }
    }),
    resolve({
        mainFields: ['main', 'module', 'jsnext']
    }),
    commonjs(),
    svg(),
    vue({
        compileTemplate: true
    }),
    // uglify(),
    // gzip()
    // terser()
];

const config = {
    output: {
        dir: 'dist',
        format: 'iife'
    },
    plugins
};

let configs = inputs.map(input => {
    return Object.assign({input}, config);
});

export default configs;
