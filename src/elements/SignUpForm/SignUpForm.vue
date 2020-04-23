<template>
    <div class="sign-up-form__wrapper">
        <form
            class="form"
            @submit.prevent="onSubmitClick">
            <h2 class="msg">{{heading}}</h2>
            <div class="form-group">
                <input 
                    type="text" 
                    class="form-control" 
                    :class="{'error': $v.name.$error}"
                    name="name" 
                    placeholder="Name"
                    ref="name"
                    v-model.trim.lazy="$v.name.$model" />
            </div>
            <div class="form-group">
                <input 
                    type="email" 
                    class="form-control"
                    :class="{'error': $v.email.$error}"
                    name="email" 
                    placeholder="Email"
                    ref="email"
                    v-model.trim.lazy="$v.email.$model" />
            </div>
            <div class="form-group">
                <input 
                    type="password"   
                    class="form-control"
                    :class="{'error': $v.password.$error}"
                    name="password" 
                    placeholder="Password" 
                    ref="password"
                    v-model.lazy="$v.password.$model">
                <input 
                    type="password" 
                    class="form-control password-confirm"
                    :class="{'error': $v.passwordConfirm.$error}"
                    name="passwordConfirm" 
                    placeholder="Confirm password" 
                    ref="passwordConfirm"
                    v-model.lazy="$v.passwordConfirm.$model">
                <span class="error-message" v-if="$v.passwordConfirm.$dirty && !$v.passwordConfirm.sameAs">Passwords do not match.</span>
                <span class="error-message" v-if="!$v.passwordConfirm.minLength">Password must be at least 6 characters.</span>
            </div>
            
            <div class="form-group">
                <button 
                    type="submit"
                    class="btn btn-primary btn-lg btn-block">{{buttonText}}</button>
            </div>
        </form>
    </div>
</template>

<script>
    import { validationMixin } from 'vuelidate'
    import { sameAs, required, minLength, email } from 'vuelidate/lib/validators'
    export default {
        name: 'SignUpForm',
        props: {
            heading: String,
            buttonText: String,
            server: String
        },
        data () {
            return {
                name: '',
                email: '',
                password: '',
                passwordConfirm: ''
            }
        },
        validations: {
            name: {
                required
            },
            email: {
                email
            },
            password: {
                required,
                minLength: minLength(6)
            },
            passwordConfirm: {
                required,
                minLength: minLength(6),
                sameAs: sameAs('password')
            }
        },
        methods: {
            onSubmitClick () {
                console.debug('Email is valid:', !this.$v.email.$error)
                // Clear errors
                // this.authError = false

                // Object.keys(this.$refs).forEach(loc => {
                //     this.$refs[loc].classList.remove('error')
                // })

                // // Build request
                // let params = new URLSearchParams()
                // params.append('username', this.form.username)
                // params.append('password', this.form.password)

                // fetch(`${this.server}/login`, {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/x-www-form-urlencoded'
                //     },
                //     body: params,
                //     redirect: 'manual'
                // })
                // .then(response => {
                //     if (response.status === 401) {
                //         this.authError = true
                //     } else if (response.type === 'opaqueredirect') {
                //         // Success
                //         window.location.href = response.url
                //     } else if (!response.ok) {
                //         response.json().then(json => {
                //             json.detail.forEach(error => {
                //                 error.loc.forEach(loc => {
                //                     if (this.$refs[loc]) {
                //                         this.$refs[loc].classList.add('error')
                //                     }
                //                 })
                //             })
                //         })
                //     }
                // })
                // .catch(response => {
                //     console.debug('Error signing in or parsing response', response)
                // })
            }
        },
        mixins: [validationMixin]
    }
</script>

<style lang="scss">
    
    .sign-up-form__wrapper {
        font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #212529;
        width: 350px;

        *, ::after, ::before {
            box-sizing: border-box;
        }
        
        .msg {
            font-size: 22px;
            margin: 0 0 25px;
        }

        .form {
            display: block;
            color: #7a7a7a;
            border-radius: 2px;
            font-size: 13px;
            background: #ececec;
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
        .password-confirm {
            margin-top: -2px;
            border-top-left-radius: 0px;
            border-top-right-radius: 0px;
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
        .error-message {
            color: #d9534f;
            font-size: .8rem;
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
