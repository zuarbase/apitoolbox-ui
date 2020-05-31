<template>
	<div v-show="false" ref="modalTemplate">
        <div ref="modal">
            <div class="modal">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-body">
                            <header class="modal-header">
                            	<h1>Change Password</h1>
                        	</header>
                            <main class="main">
                                <form
                                    class="form"
                                    novalidate>
                                    <div class="form-group">
                                        <label for="old-password">Old Password</label>
                                        <input 
                                            type="password" 
                                            class="form-control"
                                            name="old-password" 
                                            placeholder="New Password" 
                                            ref="oldPassword"
                                            v-model="oldPassword"
                                            required="true">
                                        <label class="error-message" v-if="oldPasswordError">Old passwords is incorrect.</label>
                                    </div>

                                    <div class="form-group">
                                        <label for="password">New Password</label>
        				                <input 
        				                    type="password" 
        				                    class="form-control"
        				                    name="password" 
        				                    placeholder="New Password" 
        				                    ref="password"
        				                    v-model="password"
        				                    required="true">
        				                <input 
        				                    type="password" 
        				                    class="form-control password-confirm"
        				                    name="passwordConfirm" 
        				                    placeholder="Confirm New Password" 
        				                    ref="passwordConfirm"
        				                    v-model="passwordConfirm"
        				                    required="true">
        			                    <label class="error-message" v-if="passwordMatchError">Passwords do not match.</label>
        			                    <label class="error-message" v-if="passwordLengthError">Password must be at least 6 characters in length.</label>
        				            </div>
                                </form>
                            </main>
                        </div>
                        <footer class="modal-footer">
                            <button v-on:click="onCancelClick" class="btn btn-link">Cancel</button>
                            <button v-on:click="onSaveClick" class="btn btn-primary">Save</button>
                        </footer>
                    </div>
                </div>
            </div>
            <div class="modal-backdrop"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'UserPasswordChangeModal',
        props: {
            openModal: Boolean, // Requested modal state
            userId: String
        },
        data: () => {
            return {
                oldPassword: '',
                password: '',
                passwordConfirm: '',
                oldPasswordError: false,
                passwordMatchError: false,
                passwordLengthError: false,
                isOpen: false // Actual modal state
            }
        },
        created () {
            //
        },
        watch: {
            openModal: function (val) {
            	if (val === this.isOpen) {
            		// Already in requested state
            		return
            	}
                if (val) {
                    this.open()
                } else {
                    this.close()
                }
            }
        },
        methods: {
            onCancelClick () {
                this.close();
            },
            onSaveClick () {
            	console.debug('saving password', this.password);
                let requestBody = Object.assign({}, this.password);

                // TODO - if (user.id) edit : save
                // fetch(`${this.server}/user`, {
                //     method: 'PUT',
                //     headers: {
                //         'Content-Type': 'application/json'
                //     },
                //     body: requestBody
                // })
                // .then(response => {
                //     if (response.ok) {
                //         // Success
                //         let event = new Event('user-created.ft', {user: response.detail})
                //         document.dispatchEvent(event)
                //         this.close()
                //     } else {
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
                //     console.debug('Error creating user or parsing response', response)
                // })

                // Temp, dev code until API is ready
                let event;
                if (this.user.id) {
                	event = new CustomEvent('user-edited.ft', {detail: {user: Object.assign({id:3}, this.userToEdit)}})
                } else {
                	event = new CustomEvent('user-created.ft', {detail: {user: Object.assign({id:3}, this.userToEdit)}})
                }
                document.dispatchEvent(event)
                this.close()
            },
			checkPasswords () {
				this.$refs.password.classList.remove('error')
				this.$refs.passwordConfirm.classList.remove('error')
				this.passwordLengthError = false
				this.passwordMatchError = false
				if (this.password.length && this.passwordConfirm.length) {
					if (this.password.length < 6) {
						this.$refs.password.classList.add('error')
						this.passwordLengthError = true
					}
					if (this.passwordConfirm.length < 6) {
						this.$refs.passwordConfirm.classList.add('error')
					}
					if (this.passwordConfirm !== this.password) {
						this.$refs.passwordConfirm.classList.add('error')
						this.passwordMatchError = true
					}
				}
			},
            open () {
            	console.debug('Opening modal')
                document.body.appendChild(this.$refs.modal)
                this.isOpen = true
            },
            close () {
                this.$refs.modalTemplate.appendChild(this.$refs.modal)
                this.isOpen = false
                if (typeof this.onClose === 'function') {
                	this.onClose()
                }
            }
        }
    }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="scss">
    .modal {
        z-index: 1050;
        position: fixed;
        display: block;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;

        *, ::after, ::before {
	        box-sizing: border-box;
	    }

        .modal-dialog {
            width: 600px;
            margin: 30px auto;
            background: #ffffff;
        }
	    .btn-block {
	        display: block;
	        width: 100%;
	    }
	    
	   .form {
	        position: relative;
	    }
	    .form-control {
	        display: block;
	        width: 100%;
	    }
	    .modal-footer {
	        display: flex;
	        justify-content: flex-end;
	    }
    }
    .modal-backdrop {
        z-index: 1040;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: rgba(0, 0, 0, .4);
        pointer-events: none;
    }
</style>
