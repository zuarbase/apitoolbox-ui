<template>
	<div v-show="false" ref="modalTemplate">
        <div class="modal-window user-edit-modal" ref="modalWrapper">
            <div class="modal fade" ref="modal">
                <div class="modal-dialog modal-md modal-dialog-scrollable">
                    <div class="modal-content">
                        <header class="modal-header">
                            <h3 v-if="!userId">Add User</h3>
                            <h3 v-if="userId">Edit User</h3>
                        </header>
                        <main class="modal-body">
                             <div class="container-fluid">
                                <div class="row">
                                    <div class="col">
                                        <form
                                            class="form needs-validation"
                                            novalidate
                                            ref="form">
                                            <div class="form-group">
                                                <label for="username">Username</label>
                                                <input 
                                                    type="text" 
                                                    class="form-control" 
                                                    id="username" 
                                                    name="username" 
                                                    placeholder="Username"
                                                    ref="username"
                                                    v-model="user.username"
                                                    :disabled="userId"
                                                    required/>
                                                    <div class="invalid-feedback">Please provide a username</div>
                                            </div>
                                            <div class="form-group">
                                                <label for="name">Full Name</label>
                                                <input 
                                                    type="text" 
                                                    class="form-control" 
                                                    id="name" 
                                                    name="name" 
                                                    placeholder="Name"
                                                    ref="name"
                                                    v-model="user.fullname"
                                                    required />
                                            </div>
                                            <div class="form-group">
                                                <label for="email">Email</label>
                                                <input 
                                                    type="email" 
                                                    class="form-control" 
                                                    id="email" 
                                                    name="email" 
                                                    placeholder="Email"
                                                    ref="email"
                                                    autocomplete="new-email" 
                                                    v-model="user.email"
                                                    required />
                                                    <div class="invalid-feedback">Please provide a valid email address</div>
                                            </div>

                                            <div class="form-group">
                                                <label for="username"> 
                                                    <span v-if="userId">Reset Password (optional)</span>
                                                    <span v-if="!userId">Password</span>
                                                </label>
                				                <input 
                				                    type="password" 
                				                    class="form-control"
                				                    id="password" 
                                                    name="password" 
                				                    placeholder="Password"
                                                    autocomplete="new-password" 
                				                    ref="password"
                				                    v-model="password"
                                                    minlength="6"
                				                    :required="!userId">
                                                    <div class="invalid-feedback">Password must be at least 6 characters in length</div>
                				                <input 
                				                    type="password" 
                				                    class="form-control password-confirm"
                				                    id="passwordConfirm" 
                                                    name="passwordConfirm" 
                				                    placeholder="Confirm Password" 
                				                    ref="passwordConfirm"
                				                    v-model="passwordConfirm"
                				                    :required="!userId">
                			                    <div class="invalid-feedback">Passwords must match</div>
                				            </div>

                				            <div class="form-group-row" v-if="isOpen">
                					            <div class="form-group">
                                                    <label for="groups">Groups</label>
                	                                <multiselect 
                	                                	v-model="selectedGroups"
                	                                	:options="groups"
                                                        id="groups"
                	                                	tag-placeholder="Add as new group" 
                	                                	placeholder="Groups" 
                	                                	:multiple="true" 
                	                                	:taggable="true" 
                	                                	@tag="addGroup"></multiselect>
                	                            </div>
                					            <div class="form-group">
                                                    <label for="permissions">Permissions</label>
                	                                <multiselect 
                	                                	v-model="selectedPermissions" 
                	                                	:options="permissions"
                                                        id="permissions"
                	                                	tag-placeholder="Add as new permission"
                	                                	placeholder="Permissions" 
                	                                	:multiple="true" 
                	                                	:taggable="true" 
                	                                	@tag="addPermission"></multiselect>
                	                            </div>
                                            </div>

                                            <div class="form-group">
                                                <div class="form-check form-check-inline">
                                                    <label class="form-check-label">
                                                        <input 
                                                            type="checkbox"
                                                            class="form-check-input"
                                                            id="is_admin"
                                                            v-model="user.admin"
                                                            name="is_admin"
                                                            required>
                                                        Administrator
                                                    </label>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </main>
                        <footer class="modal-footer">
                            <button v-on:click="onCancelClick" class="btn btn-link">Cancel</button>
                            <button v-on:click="onSaveClick" class="btn btn-primary">Save</button>
                        </footer>
                    </div>
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
            server: {
                type: String,
                default: ''
            },
            openModal: Boolean, // Requested modal state
            userId: String
        },
        data: () => {
            return {
                user: {}, // form state
                userToEdit: {}, // from API
                password: '', // Password change model
                passwordConfirm: '',
                passwordMatchError: false,
                passwordLengthError: false,
                groups: ['Administrator', 'Editor', 'User'],
                selectedGroups: [], // Groups tag component model
                permissions: ['Read all users', 'Write all users', 'Edit all users', 'Delete all users'],
                selectedPermissions: [], // Permissions tag component model
                isOpen: false // Actual modal state
            }
        },
        watch: {
            openModal: function (val) {
            	if (val === this.isOpen) {
            		// Already in requested state
            		return;
            	}
                if (val) {
                    this.$refs.form.classList.remove('was-validated');
                    this.server = this.server || '';

                	this.selectedGroups.length = 0;
                	this.selectedPermissions.length = 0;
                    
                    let groupsPromise = this.fetchGroups()
                        .then(groups => {
                            this.groups.length = 0;
                            this.groups.push(...groups);
                        });
                    let permissionsPromise = this.fetchPermissions()
                        .then(permissions => {
                            this.permissions.length = 0;
                            this.permissions.push(...permissions);
                        });
                    let userPromise = this.userId ? this.fetchUser() : Promise.resolve({});

                	userPromise.then(user => {
                        Object.assign(this.userToEdit, user);
                        // let userCopy = Object.assign({}, this.userToEdit);
                        let {groups, permissions} = user;
                        Object.assign(this.user, user);
                        this.selectedGroups.push(...groups || []);
                        this.selectedPermissions.push(...permissions || []);
                    });

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
            fetchUser () {
                return fetch(`${this.server}/auth/users/${this.userId}`)
                    .then(this.handleResponse)
                    .catch(e => {
                        console.error('Error fetching user to edit', e);
                    });
            },
            fetchGroups () {
                return fetch(`${this.server}/auth/groups`)
                    .then(this.handleResponse)
                    .catch(e => {
                        console.error('Error fetching user to edit', e);
                    });
            },
            fetchPermissions () {
                return fetch(`${this.server}/auth/permissions`)
                    .then(this.handleResponse)
                    .catch(e => {
                        console.error('Error fetching user to edit', e);
                    });
            },
            onCancelClick () {
                this.close()
            },
            onSaveClick () {
                if (this.$refs.form.checkValidity() === false) {
                    console.debug("Form not valid");
                    this.$refs.form.classList.add('was-validated');
                    return;
                }
            	console.debug('saving groups', this.selectedGroups);
            	Object.assign(this.userToEdit, this.user);
            	this.userToEdit.groups = [];
            	this.userToEdit.permissions = [];
            	this.userToEdit.groups.push(...this.selectedGroups);
            	this.userToEdit.permissions.push(...this.selectedPermissions);
                let requestBody = Object.assign({}, this.userToEdit);

                let url = this.userToEdit.id ? `${this.server}/auth/users/${this.userToEdit.id}` : `${this.server}/users`;
                let method = this.userToEdit.id ? 'PUT' : 'POST';
                fetch(url, {
                    method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                })
                .then(response => {
                    if (response.ok) {
                        // Success
                        let event;
                        if (this.userToEdit.id) {
                            event = new CustomEvent('user-edited.ft', {detail: {user: Object.assign({id:3}, this.userToEdit)}})
                        } else {
                            event = new CustomEvent('user-created.ft', {detail: {user: Object.assign({id:3}, this.userToEdit)}})
                        }
                        document.dispatchEvent(event);
                        this.close()
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
                    console.debug('Error creating user or parsing response', response)
                })

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
			checkPasswords (required) {
				this.$refs.password.classList.remove('error')
				this.$refs.passwordConfirm.classList.remove('error')
				this.passwordLengthError = false
				this.passwordMatchError = false
				if (this.password.length && this.passwordConfirm.length) {
                    this.$refs.password.setCustomValidity('');
                    this.$refs.passwordConfirm.setCustomValidity('');
					if (this.password.length < 6) {
						// this.$refs.password.classList.add('error')
						// this.passwordLengthError = true
                        this.$refs.password.setCustomValidity('Password must be at least 6 characters long.');
					}
					if (this.passwordConfirm.length < 6) {
						this.$refs.passwordConfirm.setCustomValidity('Password must be at least 6 characters long.');
					}
					if (this.passwordConfirm !== this.password) {
						this.$refs.passwordConfirm.setCustomValidity('Password must be at least 6 characters long.');
					}
				}
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
                window.setTimeout(() => {
                    this.$refs.modal.classList.add('show');    
                }, 100);
                
                this.isOpen = true;
            },
            close () {
                this.$refs.modal.classList.remove('show');
                window.setTimeout(() => {
                    this.$refs.modalTemplate.appendChild(this.$refs.modalWrapper);
                }, 300);
                this.isOpen = false;
            }
        },
        components: {
        	Multiselect
        }
    }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="scss">
    .user-edit-modal {
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
        .modal {
            display: block;
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

        .form-control:focus {
            outline: 0;
        }
        .modal-footer {
            display: flex;
            justify-content: flex-end;
        }
    }
</style>
