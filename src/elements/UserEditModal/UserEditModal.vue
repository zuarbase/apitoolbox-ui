<template>
    <div v-show="false" ref="modalTemplate">
        <div ref="modal">
            <div class="modal">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-body">
                            <header class="modal-header">
                                <h1 v-if="!isEdit" class="modal-title">Add User</h1>
                                <h1 v-if="isEdit"  class="modal-title">Edit User</h1>
                            </header>
                            <main class="main">
                                <form
                                    class="form"
                                    novalidate>
                                    <div class="form-group">
                                        <label for="username">Username</label>
                                        <input 
                                            type="text" 
                                            class="form-control" 
                                            name="username" 
                                            placeholder="Username"
                                            ref="name"
                                            v-model="user.username"
                                            disabled />
                                    </div>

                                    <div class="form-group">
                                        <label for="name">Name</label>
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
                                        <label for="email">Email</label>
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
                                        <label v-if="!isEdit" for="password">Password</label>
                                        <label v-if="isEdit" for="password">Change Password <small>(optional)</small></label>
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
                                        <small class="error-message text-danger" v-if="passwordMatchError">Passwords do not match.</small>
                                        <small class="error-message text-danger" v-if="passwordLengthError">Password must be at least 6 characters in length.</small>
                                    </div>

                                    <div class="form-group-row" v-if="isOpen">
                                        <div class="form-group">
                                            <label for="groups">Groups</label>
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
                                            <label for="permissions">Permissions</label>
                                            <multiselect 
                                                v-model="selectedPermissions" 
                                                :options="permissions"
                                                tag-placeholder="Add as new permission"
                                                placeholder="Permissions" 
                                                :multiple="true" 
                                                :taggable="true" 
                                                @tag="addPermission"></multiselect>
                                        </div>

                                        <div v-if="success" class="alert alert-success" role="alert">
                                            <h4 class="alert-heading">Success</h4>
                                            <p v-if="!isEdit">User created.</p>
                                            <p v-if="isEdit">User updated.</p>
                                        </div>

                                         <div v-if="error" class="alert alert-danger" role="alert">
                                            <h4 class="alert-heading">{{error.error || 'Error'}}</h4>
                                            <p>{{error.detail || error}}</p>
                                        </div>

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
    import Multiselect from 'vue-multiselect'
    export default {
        name: 'UserEditModal',
        props: {
            openModal: Boolean, // Requested modal state
            userToEdit: String,
            server: String
        },
        data: () => {
            return {
                user: {},
                isEdit: false,
                password: '', // Password change model
                passwordConfirm: '',
                passwordMatchError: false,
                passwordLengthError: false,
                groups: ['Administrator', 'Editor', 'User'],
                selectedGroups: [], // Groups tag component model
                permissions: ['Read', 'Write', 'Edit', 'Delete'],
                selectedPermissions: [], // Permissions tag component model
                isOpen: false, // Actual modal state
                success: false,
                error: false,
                errorClass: 'is-invalid'
            }
        },
        created () {
            if (this.userToEdit) {
                this.user = JSON.parse(this.userToEdit);
                this.isEdit = !!this.user.id;
            }
        },
        watch: {
            openModal: function (val) {
                if (val === this.isOpen) {
                    // Already in requested state
                    return;
                }
                if (val) {
                    this.selectedGroups.length = 0
                    this.selectedPermissions.length = 0
                    if (this.user.id) {
                        let userCopy = Object.assign({}, this.user);
                        let {groups, permissions, ...user} = userCopy;
                        Object.assign(this.user, user);
                        this.selectedGroups.push(...groups);
                        this.selectedPermissions.push(...permissions);
                        console.debug('Adding groups', this.selectedGroups);
                    }
                    this.open();
                } else {
                    this.close();
                }
            },
            userToEdit: function (val) {
                this.user = JSON.parse(val);
                this.isEdit = !!this.user.id;
            },
            password: function (val) {
                this.checkPasswords();
            },
            passwordConfirm: function (val) {
                this.checkPasswords();
            }
        },
        methods: {
            onCancelClick () {
                this.close();
            },
            onSaveClick () {
                this.error = false;
                this.checkPasswords(true);
                if (this.passwordLengthError || this.passwordMatchError) {
                    return;
                }

                this.user.groups = this.user.groups || [];
                this.user.permissions = this.user.permissions || [];
                this.user.groups.length = 0;
                this.user.permissions.length = 0;
                this.user.groups.push(...this.selectedGroups);
                this.user.permissions.push(...this.selectedPermissions);
                let requestBody = Object.assign({}, this.user);

                let path = this.user.id ? `${this.server}/auth/user/${this.user.id}` : `${this.server}/user`;
                fetch(path, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                })
                .then(this.handleResponse)
                .then(json => {
                    if (this.isEdit) {
                        event = new CustomEvent('user-edited.ft', {detail: {user: Object.assign({id:3}, this.user)}});
                    } else {
                        event = new CustomEvent('user-created.ft', {detail: {user: Object.assign({id:3}, this.user)}});
                    }
                    document.dispatchEvent(event);
                    this.success = true;
                    setTimeout(() => {
                        this.close();
                        this.reset();
                    }, 1000);
                })
                .catch(error => {
                    let defaultError = 'Error saving user or parsing response.';
                    console.debug(defaultError, error);
                    if (typeof error === 'Object') {
                        this.error = error.statusText;
                        if (error.detail) {
                            this.error += `: ${error.detail}`;
                        }
                    } else if (typeof error === 'String') {
                        this.error = error;
                    } else {
                        this.error = defaultError;
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
            addGroup (newGroup) {
                this.user.groups.push(newGroup);
                this.groups.push(newGroup);
            },
            addPermission (newPermission) {
                this.user.permissions.push(newPermission);
                this.permissions.push(newPermission);
            },
            checkPasswords (isSaving) {
                try {
                    this.$refs.password.classList.remove(this.errorClass);
                    this.$refs.passwordConfirm.classList.remove(this.errorClass);
                    this.passwordLengthError = false;
                    this.passwordMatchError = false;
                    if ((isSaving && this.password.length) || (this.password.length && this.passwordConfirm.length)) {
                        if (this.password.length < 6) {
                            this.$refs.password.classList.add(this.errorClass);
                            this.passwordLengthError = true;
                        }
                        if (this.passwordConfirm.length < 6) {
                            this.$refs.passwordConfirm.classList.add(this.errorClass);
                        }
                        if (this.passwordConfirm !== this.password) {
                            this.$refs.passwordConfirm.classList.add(this.errorClass);
                            this.passwordMatchError = true;
                        }
                    }
                } catch (e) {
                    console.debug('Error validating passwords', e);
                }
            },
            open () {
                document.body.appendChild(this.$refs.modal);
                this.isOpen = true;
            },
            close () {
                this.$refs.modalTemplate.appendChild(this.$refs.modal);
                this.isOpen = false;
                if (typeof this.onClose === 'function') {
                    this.onClose();
                }
            },
            reset () {
                this.success = false;
                this.disabled = false;
                this.error = false;
            }
        },
        components: {
            Multiselect
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
