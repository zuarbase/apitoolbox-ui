<template>
    <div class="login-form__wrapper" :style="formStyle">

        <!-- Login -->
        <form
            class="form"
            v-on:submit.prevent="onSubmitClick"
            v-if="!showForgotPassword">
            <div class="logo" v-if="logo">
                <img v-bind:src="logo" />
            </div>
            <h2 class="msg">{{heading}}</h2>
            <div class="form-group">
                <input 
                    type="text" 
                    class="form-control" 
                    name="username" 
                    placeholder="Username"
                    ref="username"
                    v-model="form.username"
                    v-on:keyup="authError = false"
                    :required="true">
            </div>
            <div class="form-group">
                <input 
                    type="password" 
                    class="form-control"
                    name="password" 
                    placeholder="Password" 
                    ref="password"
                    v-model="form.password"
                    v-on:keyup="authError = false"
                    :required="true">
            </div>
            
            <div v-if="authError" class="alert alert-danger">Login failed; Invalid username or password</div>

            <div class="form-group">
                <button 
                    type="submit"
                    :style="buttonStyle"
                    class="btn btn-primary btn-lg btn-block">{{buttonText}}</button>
            </div>

            <div class="form-group">
                <a href v-on:click.prevent="showForgotPassword=true" :style="linkSyle">Forgot password?</a>
            </div>
        </form>

        <!-- Forgot Password -->
        <form
            class="form"
            v-on:submit.prevent="onSubmitForgotPasswordClick"
            v-if="showForgotPassword">
            <div class="logo" v-if="logo">
                <img v-bind:src="logo" />
            </div>
            <h2 class="msg">Reset Password</h2>

            <div v-show="!resetPasswordSuccess">
                <div class="form-group">
                    <input 
                        type="text" 
                        class="form-control" 
                        name="username" 
                        placeholder="Username or email address"
                        ref="forgotPasswordUsernameOrEmail"
                        v-model="form.forgotPasswordUsernameOrEmail"
                        v-on:keyup="authError = false"
                        :required="true">
                </div>
                <div class="form-group">
                    <button 
                        type="submit"
                        :style="buttonStyle"
                        class="btn btn-primary btn-lg btn-block">Send Email</button>
                </div>
            </div>

            <div v-show="resetPasswordSuccess">
                <h3 class="primary">Success</h3>
                <p>We've sent an email to the address for your user. Follow the instructions in the email to reset your password.</p>
            </div>

            <div class="form-group">
                <a href v-on:click.prevent="resetPasswordSuccess=false; showForgotPassword=false" :style="linkSyle">&laquo; Back</a>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    name: 'LoginForm',
    props: {
        heading: {
            type: String,
            default: 'Welcome'
        },
        logo: String,
        bgColor: {
            type: String,
            default: 'gray'
        },
        textColor: {
            type: String,
            default: 'white'
        },
        buttonText: {
            type: String,
            default: 'Sign In'
        },
        buttonBgColor: {
            type: String,
            default: 'blue'
        },
        buttonTextColor: {
            type: String,
            default: 'white'
        },
        linkTextColor: {
            type: String,
            default: 'lightblue'
        },
        server: String
    },
    computed: {
        formStyle () {
            return `background-color: ${this.bgColor}; color: ${this.textColor}`;
        },
        buttonStyle () {
            return `background-color: ${this.buttonBgColor}; color: ${this.buttonTextColor}`
        },
        linkSyle () {
            return `color: ${this.linkTextColor}`
        }
    },
    data () {
        return {
            authError: false,
            form: {
                username: '',
                password: ''
            },
            showForgotPassword: false,
            resetPasswordSuccess: false
        }
    },
    methods: {
        onSubmitClick () {
            // Clear errors
            this.authError = false

            Object.keys(this.$refs).forEach(loc => {
                this.$refs[loc].classList.remove('error')
            })

            const formData = new FormData();

            // Vault support
            const urlParams = new URLSearchParams(window.location.search);
            const loc = urlParams.get('location');
            if (loc) {
                formData.append('location', loc);
            }

            formData.append('username', this.form.username);
            formData.append('password', this.form.password);

            fetch(`${this.server}/login`, {
                method: 'POST',
                body: formData
            })
                .then(response => {
                    if (response.status === 401) {
                        this.authError = true
                    } else if (response.ok) {
                        // Success
                        window.location.href = response.url
                    } else {
                        response.json().then(json => {
                            json.detail.forEach(error => {
                                error.loc.forEach(loc => {
                                    if (this.$refs[loc]) {
                                        this.$refs[loc].classList.add('error')
                                    }
                                })
                            })
                        })
                    }
                })
                .catch(response => {
                    console.debug('Error signing in or parsing response', response)
                })
        },
        onSubmitForgotPasswordClick () {
            // Build request
            const params = new URLSearchParams()
            params.append('username', this.form.forgotPasswordUsernameOrEmail)

            fetch(`${this.server}/resetpassword`, {
                method: 'POST',
                body: params,
                redirect: 'manual'
            })
                .then(response => {
                    if (response.status === 401) {
                        this.authError = true
                    } else if (response.type === 'opaqueredirect') {
                        // Success
                        window.location.href = response.url
                    } else if (!response.ok) {
                        response.json().then(json => {
                            json.detail.forEach(error => {
                                error.loc.forEach(loc => {
                                    if (this.$refs[loc]) {
                                        this.$refs[loc].classList.add('error')
                                    }
                                })
                            })
                        })
                    }
                })
                .catch(response => {
                    console.debug('Error signing in or parsing response', response)
                })
        }
    }
}
</script>

<style lang="scss">
    .login-form__wrapper {
        font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        width: 350px;

        *, ::after, ::before {
            box-sizing: border-box;
        }

        a {
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }

        .primary {
            color: #fa225b;
        }

        .logo {
            margin: 0 auto;
            padding: 15px;
        }

        .msg {
            font-size: 14px;
            margin: 0 0 26px;
        }

        .form {
            display: block;
            border-radius: 2px;
            font-size: 13px;
            box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
            padding: 30px;
            position: relative;
        }
        .form-group {
            margin-bottom: 1rem;
        }
        .form-control {
            display: block;
            width: 100%;
            padding: .375rem .75rem;
            font-size: 1rem;
            line-height: 1.5;
            border-radius: 2px;
            min-height: 41px;
            background: #fff;
            border: 1px solid #e3e3e3;
            box-shadow: none !important;
        }
        .form-control:focus {
            outline: 0;
        }

        .btn {
            display: block;
            border-radius: 2px;
            width: 100%;
            padding: .5rem 1rem;
            line-height: 1.5;
            font-size: 16px;
            font-weight: bold;
            background: #fa225b;
            border: none;
            margin-bottom: 20px;
            color: #fff;
        }

        .form-control.error, .form-control.vf-invalid {
            border-color: #d9534f;
            background: #fff0f4;
        }

        .alert {
            position: relative;
            padding: .75rem 1.25rem;
            margin-bottom: 1rem;
            border: 1px solid transparent;
            border-radius: .25rem;
        }
        .alert-danger {
            color: #721c24;
            background-color: #f8d7da;
            border-color: #f5c6cb;
        }
    }
</style>
