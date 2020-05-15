<template>
    <div class="subscription-list__wrapper">
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>{{ t('EMAIL') }}</th>
                    <th>{{ t('DASHBOARD') }}</th>
                    <th>{{ t('ALL') }}</th>
                    <th>{{ t('FREQUENCY_SETTING') }}</th>
                    <th>{{ t('SEND_TIME') }}</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="subscription in subscriptions">
                    <td>{{subscription.email}}</td>
                    <td>{{subscription.view_name}}</td>
                    <td class="uppercase">{{ t(subscription.full) }}</td>
                    <td>{{ t(subscription.schedule) }}</td>
                    <td>{{subscription.send_at}} {{subscription.tz}}</td>
                    <td>
                        <!-- <button class="btn btn-secondary btn-small" v-on:click="onEditClick(subscription)">Edit</button> -->
                        <button v-on:click="onDeleteClick(subscription)" class="btn btn-secondary btn-small">Delete</button>
                    </td>
                </tr>
          </tbody>
        </table>
    </div>
</template>

<script>
    import Vue from 'vue';
    import VueTranslate from 'vue-translate-plugin';
    Vue.use(VueTranslate);
    export default {
        name: 'SubscriptionList',
        props: {
            server: String,
            translations: String,
            locale: String
        },
        data: () => {
            return {
                subscriptions: [],
                openModal: false,
                userToEdit: {}
            }
        },
        created () {
            this.fetchSubscriptions();

            document.addEventListener('subscription-created.ft', (e, p) => {
                this.subscriptions.push(e.detail.subscription);
            })

            document.addEventListener('subscription-edited.ft', (e, p) => {
                Object.assign(this.subscriptions.find(subscription => subscription.id === e.detail.subscription.id), 
                    e.detail.subscription);
            })
        },
        methods: {
            fetchSubscriptions () {
                if (!this.server) {
                    return;
                }
                fetch(`${this.server}/auth/subscriptions`)
                    .then(this.handleResponse)
                    .then(json => {
                        this.subscriptions.push(...json);
                    });
            },
            // onEditClick (subscription) {
            //     console.debug('subscription edit click', subscription);
            //     this.subscriptionToEdit = subscription;
            //     this.openModal = true;
            // },
            onDeleteClick (subscription) {
                fetch(`${this.server}/auth/subscriptions/${subscription.id}`, {
                    method: 'DELETE'
                })
                    .then(this.handleResponse)
                    .then(deletedSubscription => {
                        let i = this.subscriptions.length - 1;
                        while (i >= 0) {
                            if (this.subscriptions[i].id === deletedSubscription.id) {
                                this.subscriptions.splice(i, 1);
                            }
                            i--;
                        }
                    });
            },
            handleResponse (response) {
                return response.json()
                    .then((json) => {
                        if (!response.ok) {
                            const error = Object.assign({}, json, {
                                status: response.status,
                                statusText: response.statusText,
                            });

                            return Promise.reject(error);
                        }
                        return json;
                    });
            },
            onModalClose () {
                this.openModal = false
            }
        },
        watch: {
            server: function (newServer, oldServer) {
                if (newServer) {
                    this.fetchSubscriptions();
                }
            },
            translations: function (val) {
                if (this.translations && this.locale) {
                    this.$translate.setLocales(JSON.parse(this.translations));
                    this.$translate.setLang(this.locale);
                }
            },
            locale: function (val) {
                if (this.translations && this.locale) {
                    this.$translate.setLocales(JSON.parse(this.translations));
                    this.$translate.setLang(this.locale);
                }
            }
        }
    }
</script>

<style lang="scss">
    
    .subscription-list__wrapper {
        font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #212529;

        *, ::after, ::before {
            box-sizing: border-box;
        }
        .uppercase {
            text-transform: uppercase;
        }
        .table {
            width: 100%;
            max-width: 100%;
            border-collapse: collapse;
            text-align: left;
        }
        .table thead th {
            vertical-align: bottom;
            border-bottom: 2px solid #dee2e6;
            padding: .75rem;
            border-top: 1px solid #dee2e6;
        }
        .table th, .table td {
            padding: .75rem;
            vertical-align: top;
            border-top: 1px solid #dee2e6;
        }
        .permissions {
            font-size: .8rem;
            font-family: Consolas, "Andale Mono WT", "Andale Mono", "Lucida Console", "Lucida Sans Typewriter", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Liberation Mono", "Nimbus Mono L", Monaco, "Courier New", Courier, monospace;
        }

        .btn {
            border-radius: 2px;
            padding: .5rem 1rem;
            line-height: 1.5rem;
            font-size: 1rem;
            font-weight: bold;
            border: none;
            margin-bottom: 20px;
            color: #fff;
        }
        .btn-small {
            margin-bottom: 0px;
            padding: .1rem .3rem;
            line-height: .8rem;
            font-size: .8rem;
            font-weight: normal;
        }
        .btn-secondary {
            background: transparent;
            border: solid 1px #fa225b;
            color: #fa225b;
        }
        .btn.btn-secondary:hover {
            box-shadow: 0 0 4px 1px rgba(250, 34, 91, 0.1);
        }
        .btn:hover {
            cursor: pointer;
            box-shadow: 0 0 10px 4px rgba(250, 34, 91, 0.1);
        }
        .btn:focus {
            outline: 0;
        }
    }
</style>
