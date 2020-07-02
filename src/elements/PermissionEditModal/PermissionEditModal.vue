<template>
    <div v-show="false" ref="modalTemplate">
        <div class="modal-window permission-edit-modal" ref="modalWrapper">
            <div class="modal fade" ref="modal">
                <div class="modal-dialog modal-md modal-dialog-scrollable">
                    <div class="modal-content">
                        <header class="modal-header">
                            <h3 v-if="!permissionId">Add Permission</h3>
                            <h3 v-if="permissionId">Edit Permission</h3>
                        </header>
                        <main class="modal-body">
                            <div class="container-fluid">
                                <div class="row">
                                    <div class="col">
                                        <form class="form needs-validation" ref="form" novalidate>
                                            <div class="form-group">
                                                <label for="alias">Alias</label>
                                                <input
                                                    type="text"
                                                    class="form-control"
                                                    id="alias"
                                                    name="alias"
                                                    placeholder="Alias"
                                                    ref="alias"
                                                    v-model="permissionToEdit.alias"
                                                    :required="true">
                                                <div class="invalid-feedback">Please provide a human-readable alias for the permission. Eg; Read all users.</div>
                                            </div>
                                            <div class="form-group">
                                                <label for="name">Name</label>
                                                <input
                                                    type="text"
                                                    class="form-control"
                                                    id="name"
                                                    name="name"
                                                    placeholder="Name"
                                                    ref="name"
                                                    v-model="permissionToEdit.name"
                                                    :required="true">
                                                <div class="invalid-feedback">Please provide a permission string in the format OBJECT.ID.ACTION. Eg; USERS.*.READ</div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </main>
                        <footer class="modal-footer">
                            <button v-on:click="onCancelClick" class="btn btn-secondary">
                                Cancel
                            </button>
                            <button
                                v-on:click="onSaveClick"
                                class="btn btn-primary"
                            >
                                Save
                            </button>
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "PermissionEditModal",
    props: {
        server: {
            type: String,
            default: ''
        },
        openModal: Boolean, // Requested modal state
        permissionId: String
    },
    data: () => {
        return {
            permissionToEdit: {},
            isOpen: false // Actual modal state
        };
    },
    watch: {
        openModal: function(val) {
            if (val === this.isOpen) {
                // Already in requested state
                return;
            }
            if (val) {
                if (this.permissionId) {
                    this.fetchPermission(this.permissionId)
                        .then(permission => {
                            this.permissionToEdit = {};
                            console.debug('this', this);
                            console.debug('this.permissionToEdit', this.permissionToEdit);
                            console.debug('permission to edit', permission);
                            Object.assign(this.permissionToEdit, permission);
                        });
                }
                this.open();
            } else {
                this.close();
            }
        }
    },
    methods: {
        onCancelClick() {
            this.close();
        },
        onSaveClick() {
            if (this.$refs.form.checkValidity() === false) {
                this.$refs.form.classList.add('was-validated');
                return;
            }
            let request;
            if (this.permissionId) {
                request = fetch(`${this.server}/auth/permissions/${this.permissionId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(this.permissionToEdit)
                });
            } else {
                request = fetch(`${this.server}/auth/permissions`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(this.permissionToEdit)
                });
            }
            request
                .then(this.handleResponse)
                .then(permission=>{
                    let event;
                    if (this.permissionToEdit.id) {
                        event = new CustomEvent('permission-edited.ft', {detail: {permission}})
                    } else {
                        event = new CustomEvent('permission-created.ft', {detail: {permission}})
                    }
                    document.dispatchEvent(event);
                })
                .catch(err=>{
                    console.debug('Error creating permission or parsing response', err)
                })
            this.close();
        },
        fetchPermission (id) {
            return fetch(`${this.server}/auth/permissions/${id}`)
                .then(this.handleResponse)
                .catch(e => {
                    console.error('Error fetching permission', e);
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
        open () {
            document.body.appendChild(this.$refs.modalWrapper);
            window.setTimeout(() => {
                this.$refs.modal.classList.add('show');    
            }, 100);
            
            this.isOpen = true;
        },
        close () {
            this.$refs.modal.classList.remove('show');
            this.$refs.form.classList.remove('was-validated');
            window.setTimeout(() => {
                this.$refs.modalTemplate.appendChild(this.$refs.modalWrapper);
            }, 300);
            this.isOpen = false;
        }
    }
};
</script>

<style lang="scss">
    .permission-edit-modal {
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
