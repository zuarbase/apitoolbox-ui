<template>
	<div v-show="false" ref="modalTemplate">
        <div class="modal-window subscribe-modal" ref="modalWrapper" v-on:click="onBackdropClick">
            <div class="modal-dialog modal-md">
                <div class="modal-content">
                    <header class="modal-header">
                    	<h3 class="modal-title">{{ t('SUBSCRIBE') }}</h3>
                	</header>
                    <main class="modal-body">
                        <div class="container-fluid">
                            <div class="row">
                                <div class="col">
                                    <form
                                        class="form"
                                        novalidate>
                                        <div class="form-group">
                                            <label for="dashboard">{{ t('DASHBOARD') }}</label>
                                            <select 
                                                class="form-control" 
                                                name="dashboard" 
                                                placeholder="Dashboard"
                                                ref="dashboard"
                                                v-model="formState.dashboard"
                                                :required="true"
                                                :disabled="disabled">
                                                <option v-for="dashboard in dashboards" v-bind:value="dashboard" v-bind:key="dashboard.id">
                                                    {{ t(dashboard.name) }}
                                                </option>
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <div class="form-group-horizontal">
                                                <div>
                                                    <label for="frequency">{{ t('FREQUENCY') }}</label>
                                                    <select 
                                                        class="form-control" 
                                                        name="frequency" 
                                                        placeholder="Frequency"
                                                        ref="frequency"
                                                        v-model="formState.frequency"
                                                        :required="true"
                                                        :disabled="disabled">
                                                        <option v-for="frequency in frequencies" v-bind:value="frequency" v-bind:key="frequency">
                                                            {{ t(frequency) }}
                                                        </option>
                                                    </select>
                                                </div>
                                                <div v-if="formState.frequency === 'WEEKLY'">
                                                    <label for="frequency">{{ t('DAY_OF_WEEK') }}</label>
                                                    <select 
                                                        class="form-control" 
                                                        name="frequency" 
                                                        placeholder="Frequency"
                                                        ref="frequency"
                                                        v-model="formState.dayOfWeek"
                                                        :required="true"
                                                        :disabled="disabled">
                                                        <option v-for="dayOfWeek in frequencySettingsWeekly" v-bind:value="dayOfWeek.value" v-bind:key="dayOfWeek.value">
                                                            {{ t(dayOfWeek.label) }}
                                                        </option>
                                                    </select>
                                                </div>
                                                <div v-if="formState.frequency === 'MONTHLY'">
                                                    <label for="frequency">{{ t('DAY_OF_MONTH') }}</label>
                                                    <select 
                                                        class="form-control" 
                                                        name="frequency" 
                                                        placeholder="Frequency"
                                                        ref="frequency"
                                                        v-model="formState.dayOfMonth"
                                                        :required="true"
                                                        :disabled="disabled">
                                                        <option v-for="(day, index) in frequencySettingsMonthly" v-bind:value="index+1" v-bind:key="day">
                                                            {{ index+1 }}
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label for="hour">{{ t('SEND_TIME') }}</label>
                                            <div class="form-group-horizontal">
                                                <select 
                                                    class="form-control" 
                                                    name="hour" 
                                                    placeholder="Hour"
                                                    ref="hour"
                                                    v-model="formState.hour"
                                                    :required="true"
                                                    :disabled="disabled">
                                                    <option v-for="(hour, index) in hours" v-bind:value="index+1" v-bind:key="hour">
                                                        {{ index+1 }}
                                                    </option>
                                                </select>
                                                <select 
                                                    class="form-control" 
                                                    name="minute" 
                                                    placeholder="Minute"
                                                    ref="minute"
                                                    v-model="formState.minute"
                                                    :required="true"
                                                    :disabled="disabled">
                                                    <option v-for="minute in minutes" v-bind:value="minute"  v-bind:key="minute">
                                                        {{ minute }}
                                                    </option>
                                                </select>
                                                <select 
                                                    class="form-control" 
                                                    name="ampm" 
                                                    placeholder="AM/PM"
                                                    ref="ampm"
                                                    v-model="formState.ampm"
                                                    :required="true"
                                                    :disabled="disabled">
                                                    <option v-for="ampm in ['am', 'pm']" v-bind:value="ampm" v-bind:key="ampm">
                                                        {{ ampm }}
                                                    </option>
                                                </select>
                                            </div>
                                        </div>

                                        <div v-if="success" class="alert alert-success" role="alert">
                                            <h4 class="alert-heading">{{ t('CREATED') }}</h4>
                                            <p>{{ t('SUB_SUCCESS_CREATED') }}</p>
                                        </div>

                                        <div v-if="error" class="alert alert-danger" role="alert">
                                            <h4 class="alert-heading">{{ t('ERROR') }}</h4>
                                            <p>{{ error }}</p>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </main>
                    <footer class="modal-footer">
                        <button v-on:click="onCancelClick" class="btn btn-link">{{ t('CANCEL') }}</button>
                        <button v-on:click="onSaveClick" class="btn btn-primary" :disabled="disabled">{{ t('OK') }}</button>
                    </footer>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import VueTranslate from 'vue-translate-plugin';
    Vue.use(VueTranslate);
    export default {
        name: 'SubscribeModal',
        props: {
            server: String,
            openModal: Boolean, // Requested modal state
            email: String, // Subscription Email
            selectedDashboardId: String,
            filters: String,
            translations: String,
            locale: String
        },
        data: () => {
            return {
                dashboards: [{name: 'All', id: 0}],
                currentDashboard: {},
                frequencies: ['DAILY', 'WEEKLY', 'MONTHLY'],
                frequencySettingsWeekly: [{value: 0, label: 'MONDAY'}, {value: 1, label: 'TUESDAY'}, {value: 2, label: 'WEDNESDAY'}, {value: 3, label: 'THURSDAY'}, {value: 4, label: 'FRIDAY'}, {value: 5, label: 'SATURDAY'}, {value: 6, label: 'SUNDAY'}],
                frequencySettingsMonthly: Array(31),
                minutes: ['00', '15', '30', '45'],
                hours: Array(12),
                formState: {
                    dashboard: null,
                    frequency: '',
                    dayOfWeek: null,
                    dayOfMonth: null,
                    hour: 8,
                    minute: '',
                    ampm: ''
                },
                disabled: false,
                success: false,
                error: false,
                i18n: {},
                isOpen: false // Actual modal state
            };
        },
        watch: {
            server: function (newServer, oldServer) {
                if (newServer) {
                    this.fetchDashboards();
                }
            },
            selectedDashboardId: function (newSelectedDashboardId) {
                this.setSelectedDashboard(newSelectedDashboardId);
            },
            openModal: function (val) {
            	if (val === this.isOpen) {
            		// Already in requested state
            		return;
            	}
                if (val) {
                    this.open();

                    if (!this.email) {
                        this.error = 'No email found for user. Cannot create subscription.';
                        this.disabled = true;
                    }
                } else {
                    this.close();
                    this.reset();
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
            },
            filters: function(val){
                try {
                    this.filtersObject = JSON.parse(val);
                } catch (error) {
                    this.filtersObject = false;
                }
            }
        },
        mounted () {
            if (this.translations && this.locale) {
                this.$translate.setLocales(JSON.parse(this.translations));
                this.$translate.setLang(this.locale);
            }
        },
        created () {
            if (this.server) {
                this.fetchDashboards();
            }
            this.reset();
        },
        methods: {
            fetchDashboards () {
                fetch(`${this.server}/api/dashboards`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(this.handleResponse)
                .then(data => {
                    // Success
                    this.dashboards.push(...data);
                    if (this.selectedDashboardId) {
                        this.setSelectedDashboard(this.selectedDashboardId);
                    }
                })
                .catch(error => {
                    console.debug('Error fetching dashboards', error);
                    this.error = error.statusText;
                    if (error.detail) {
                        this.error += `: ${error.detail}`;
                    }
                   
                });
            },
            setSelectedDashboard (dashboardId) {
                console.debug('Setting selected dashboard');
                if (dashboardId) {
                    this.dashboards.forEach(dashboard => {
                        if (dashboard.id === dashboardId) {
                            this.formState.dashboard = dashboard;
                            this.currentDashboard = dashboard; // In case user selects 'All'
                            console.debug(' to: ', dashboard);
                        }
                    })
                }
            },
            onCancelClick () {
                this.close();
                this.reset();
            },
            onSaveClick () {
                this.disabled = true;
                let subscription = {
                    email: this.email,
                    view_name: this.formState.dashboard.id != 0 ? this.getViewName(this.formState.dashboard.url) : this.getViewName(this.currentDashboard.url),
                    schedule: this.formState.frequency, // daily, weekly, monthly
                    day_of: this.formState.frequency === 'DAILY' ? 0 : this.formState.frequency === 'WEEKLY' ? this.formState.dayOfWeek : this.formState.dayOfMonth,
                    send_at: this.getSendTime(), // "16:00 - 24-h format"
                    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    full: this.formState.dashboard.id === 0,
                    json_data:{
                        ...this.filtersObject
                    }
                };
                fetch(`${this.server}/auth/subscriptions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(subscription)
                })
                .then(this.handleResponse)
                .then(json => {
                    let event = new CustomEvent('subscription-created.ft', {detail:{subscription: json}});
                    document.dispatchEvent(event);
                    this.success = true;
                    setTimeout(() => {
                        this.close();
                        this.reset();
                    }, 1000);
                })
                .catch(error => {
                    // response.json().then(json => {
                    //     json.detail.forEach(error => {
                    //         error.loc.forEach(loc => {
                    //             if (this.$refs[loc]) {
                    //                 this.$refs[loc].classList.add('error')
                    //             }
                    //         })
                    //     })
                    // });

                    console.debug('Error creating subscription or parsing response', error);
                    this.error = error.statusText;
                    if (error.detail) {
                        this.error += `: ${error.detail}`;
                    }
                   
                });
            },
            getViewName (url) {
                return url.split('/views/').pop().split('?')[0];
            },
            getSendTime () {
                let hours = this.formState.ampm === 'pm' ? (this.formState.hour + 12) % 24 : this.formState.hour;
                return `${hours}:${this.formState.minute}`
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
            open () {
                document.body.appendChild(this.$refs.modalWrapper);
                this.isOpen = true;
            },
            close () {
                this.$refs.modalTemplate.appendChild(this.$refs.modalWrapper);
                this.isOpen = false;
                if (typeof this.onClose === 'function') {
                	this.onClose();
                }
            },
            reset () {
                this.success = false;
                this.disabled = false;
                this.error = false;
                this.formState.dashboard = this.dashboards[0];
                this.formState.frequency = this.frequencies[0];
                this.formState.dayOfWeek = this.frequencySettingsWeekly[0].value;
                this.formState.dayOfMonth = 1;
                this.formState.hour = 8;
                this.formState.minute = this.minutes[0];
                this.formState.ampm = 'am';
            },
            onBackdropClick (e) {
                if (e.target === this.$refs.modalWrapper) {
                    this.close();
                }
            }
        }
    };
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="scss">
    
    .subscribe-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 999;
        background-color: rgba(0, 0, 0, .4);
        transition: all 0.3s;
        *, ::after, ::before {
	        box-sizing: border-box;
	    }
	    .modal-dialog {
	        max-width: 500px;
            position: relative;
            margin: 1.75rem auto;
            transition: transform .3s ease-out;
	    }
	    .modal-content {
            height: auto;
	        background: #ffffff;
	        pointer-events: all;
	    }
	    .btn-primary:hover {
	        cursor: pointer;
	    }
	    .btn:focus {
	        outline: 0;
	    }
	   .form {
	        position: relative;
	    }
	    .form-group {
	        margin-bottom: 1rem;
	    }
        .form-group-horizontal {
            display: flex;
            flex-direction: row;
        }
        .form-group-horizontal > * {
            margin-left: .3rem;
            width: 100%;
        }
        .form-group-horizontal > *:first-child {
            margin-left: 0;
        }
	    .form-control {
	        display: block;
	        width: 100%;
	    }
	    .form-control:focus {
	        outline: 0;
	    }
	    .modal-footer {
	        display: flex;
	        justify-content: flex-end;
	    }
    }
</style>
