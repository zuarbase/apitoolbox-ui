Vue.filter('dateTimeFormat', function (value) {
    return new Date(value).toLocaleDateString();
});