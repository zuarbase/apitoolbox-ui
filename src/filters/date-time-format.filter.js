import Vue from 'vue';
Vue.filter('dateTimeFormat', function (value) {
	let date = new Date(value);
    return `${date.toGMTString()}`;
});