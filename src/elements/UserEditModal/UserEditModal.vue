<template>
	<div v-show="false" ref="modalTemplate">
        <div class="modal__wrapper" ref="modalWrapper">
            <div class="modal-backdrop">
                <div class="modal" v-bind:class="{ show: isOpen,'d-block': isOpen}">
                    <header class="header">
                    	<h1 v-if="!userToEdit.id">Add User</h1>
                    	<h1 v-if="userToEdit.id">Edit User</h1>
                	</header>
                    <main class="main">
                        <form
                            class="form"
                            novalidate>
                            <div class="form-group">
                                <input 
                                    type="text" 
                                    class="form-control" 
                                    name="name" 
                                    placeholder="Name"
                                    ref="name"
                                    v-model="user.name"
                                    :required="true" />
                            </div>
                            <div class="form-group">
                                <input 
                                    type="text" 
                                    class="form-control" 
                                    name="email" 
                                    placeholder="Email"
                                    ref="email"
                                    v-model="user.email"
                                    :required="true" />
                            </div>

                            <div class="form-group">
				                <input 
				                    type="password" 
				                    class="form-control"
				                    name="password" 
				                    placeholder="Password" 
				                    ref="password"
				                    v-model="password"
				                    required="true">
				                <input 
				                    type="password" 
				                    class="form-control password-confirm"
				                    name="passwordConfirm" 
				                    placeholder="Confirm Password" 
				                    ref="passwordConfirm"
				                    v-model="passwordConfirm"
				                    required="true">
			                    <label class="error-message" v-if="passwordMatchError">Passwords do not match.</label>
			                    <label class="error-message" v-if="passwordLengthError">Password must be at least 6 characters in length.</label>
				            </div>

				            <div class="form-group-row" v-if="isOpen">
					            <div class="form-group">
	                                <multiselect 
	                                	v-model="selectedGroups"
	                                	:options="groups"
	                                	tag-placeholder="Add as new group" 
	                                	placeholder="Groups" 
	                                	:multiple="true" 
	                                	:taggable="true" 
	                                	@tag="addGroup"></multiselect>
	                            </div>
					            <div class="form-group">
	                                <multiselect 
	                                	v-model="selectedPermissions" 
	                                	:options="permissions"
	                                	tag-placeholder="Add as new permission"
	                                	placeholder="Permissions" 
	                                	:multiple="true" 
	                                	:taggable="true" 
	                                	@tag="addPermission"></multiselect>
	                            </div>
                            </div>
                        </form>
                    </main>
                    <footer class="footer">
                        <button v-on:click="onCancelClick" class="btn btn-link">Cancel</button>
                        <button v-on:click="onSaveClick" class="btn btn-primary">Save</button>
                    </footer>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	import Multiselect from 'vue-multiselect'
    export default {
        name: 'UserEditModal',
        props: {
            openModal: Boolean, // Requested modal state
            onClose: Function,
            userToEdit: Object
        },
        data: () => {
            return {
                user: {},
                password: '', // Password change model
                passwordConfirm: '',
                passwordMatchError: false,
                passwordLengthError: false,
                groups: ['Administrator', 'Editor', 'User'],
                selectedGroups: [], // Groups tag component model
                permissions: ['Read', 'Write', 'Edit', 'Delete'],
                selectedPermissions: [], // Permissions tag component model
                isOpen: false // Actual modal state
            }
        },
        watch: {
            openModal: function (val) {
            	if (val === this.isOpen) {
            		// Already in requested state
            		return
            	}
                if (val) {
                	this.selectedGroups.length = 0
                	this.selectedPermissions.length = 0
                	if (this.userToEdit.id) {
                		let userCopy = Object.assign({}, this.userToEdit)
		        		let {groups, permissions, ...user} = userCopy
		        		Object.assign(this.user, user)
		        		this.selectedGroups.push(...groups)
		        		this.selectedPermissions.push(...permissions)
		        		console.debug('Adding groups', this.selectedGroups)
		        	}
                    this.open()
                } else {
                    this.close()
                }
            },
            password: function (val) {
            	this.checkPasswords()
            },
            passwordConfirm: function (val) {
            	this.checkPasswords()
            }
        },
        methods: {
            onCancelClick () {
                this.close()
            },
            onSaveClick () {
            	console.debug('saving groups', this.selectedGroups)
            	Object.assign(this.userToEdit, this.user)
            	this.userToEdit.groups.length = 0
            	this.userToEdit.permissions.length = 0
            	this.userToEdit.groups.push(...this.selectedGroups)
            	this.userToEdit.permissions.push(...this.selectedPermissions)
                let requestBody = Object.assign({}, this.userToEdit)

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
            addGroup (newGroup) {
      			this.user.groups.push(newGroup)
      			this.groups.push(newGroup)
			},
			addPermission (newPermission) {
      			this.user.permissions.push(newPermission)
      			this.permissions.push(newPermission)
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
                document.body.appendChild(this.$refs.modalWrapper)
                this.isOpen = true
            },
            close () {
                this.$refs.modalTemplate.appendChild(this.$refs.modalWrapper)
                this.isOpen = false
                if (typeof this.onClose === 'function') {
                	this.onClose()
                }
            }
        },
        components: {
        	Multiselect
        }
    }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="scss">
    
    .modal__wrapper {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 999;

        *, ::after, ::before {
	        box-sizing: border-box;
	    }
	    
	    .modal-backdrop {
	        width: 100%;
	        height: 100%;
	        background-color: rgba(0, 0, 0, .4);
	        pointer-events: none;
	        transition: all 0.3s;
	    }
	    .modal {
	        width: 600px;
            height: auto;
	        position: absolute;
	        top: 20%;
	        left: 50%;
	        transform: translate(-50%, -20%);
	        background: #ffffff;
	        border-radius: 3px;
	        pointer-events: all;
	    }
	    .header {
	    	padding: 1rem;
	    	border-bottom: solid 1px #e3e3e3;
	    	h1 {
	    		font-size: 1.4rem;
	    	}
	    }
	    .main {
	    	padding: 1rem;
	    	background-color: #fffbfc;
	    }
	    .btn {
	        border-radius: 2px;
	        padding: .5rem 1rem;
	        line-height: 1.5rem;
	        font-size: 1rem;
	        font-weight: bold;
	        border: none;
	        color: #fff;
	    }
	    .btn-primary {
	        background: #fa225b;
	    }
	    .btn-link {
			color: #fa225b;
			background-color: white;
	    }
	    .btn-block {
	        display: block;
	        width: 100%;
	    }
	    .btn:hover {
	        cursor: pointer;
	        box-shadow: 0 0 10px 4px rgba(250, 34, 91, 0.1);
	    }
	    .btn:focus {
	        outline: 0;
	    }

	   .form {
	        font-size: 13px;
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
	    .form-control.error, .form-control.vf-invalid {
            border-color: #d9534f;
            background: #fff0f4;
        }
        .error-message {
        	color: #d9534f;
        	font-size: .8rem;
        }

	    .multiselect__tags {
	    	border-radius: 2px;
	    }

	    .footer {
	        display: flex;
	        justify-content: flex-end;
	        border-top: solid 1px #e3e3e3;
	        padding: 1rem;
	        .btn {
	            margin-left: 1rem;
	        }
	    }
    }
</style>
