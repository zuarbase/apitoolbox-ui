<template>
    <div v-show="false" ref="modalTemplate">
        <div class="modal-window group-edit-modal" ref="modalWrapper">
            <div class="modal fade" ref="modal">
                <div class="modal-dialog modal-md">
                    <div class="modal-content">
                        <header class="modal-header">
                            <h3 v-if="!groupId">Add Group</h3>
                            <h3 v-if="groupId">Edit Group</h3>
                        </header>
                        <main class="modal-body">
                            <div class="container-fluid">
                                <div class="row">
                                    <div class="col">
                                        <form class="form needs-validation" ref="form" novalidate>
                                            <div class="form-group">
                                                <label for="name">Name</label>
                                                <input
                                                    type="text"
                                                    class="form-control"
                                                    id="name"
                                                    name="name"
                                                    placeholder="Name"
                                                    ref="name"
                                                    v-model="groupToEdit.name"
                                                    :required="true">
                                                <div class="invalid-feedback">Please provide a group name. Eg; Editor.</div>
                                            </div>
                                            <div class="form-group">
                                                <label for="permissions">Permissions</label>
                                                <multiselect 
                                                    v-model="selectedPermissions" 
                                                    :options="permissions"
                                                    id="permissions"
                                                    tag-placeholder="Add as new permission"
                                                    placeholder="Permissions"
                                                    label="alias"
                                                    track-by="id"
                                                    :multiple="true" 
                                                    :taggable="false">
                                                </multiselect>
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
                                class="btn btn-primary">
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
import Multiselect from 'vue-multiselect';
export default {
    name: "GroupEditModal",
    props: {
        server: {
            type: String,
            default: ''
        },
        openModal: Boolean, // Requested modal state
        groupId: String
    },
    data: () => {
        return {
            groupToEdit: {},
            initialPermissions: [],
            permissions: [],
            selectedPermissions: [],
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
                this.groupToEdit = {};
                if (this.groupId) {
                    this.fetchGroup(this.groupId)
                }

                this.fetchPermissions()
                    .then(() => {
                        if (this.groupId) {
                            this.fetchGroupPermissions(this.groupId);
                        }
                    });

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

            this.saveGroup()
                .then(groupResponse => {
                    this.saveGroupPermissions()
                        .then(() => {
                            let event;
                            if (this.groupToEdit.id) {
                                event = new CustomEvent('group-edited.at', {detail: {group: groupResponse}})
                            } else {
                                event = new CustomEvent('group-created.at', {detail: {group: groupResponse}})
                            }
                            document.dispatchEvent(event);
                        });
                })
                .catch(err => {
                    console.error('Error creating group or parsing response', err);
                })
            this.close();
        },
        fetchGroup (id) {
            return fetch(`${this.server}/auth/groups/${id}`)
                .then(this.handleResponse)
                .then(group => {
                    this.groupToEdit = {};
                    Object.assign(this.groupToEdit, group);
                })
                .catch(e => {
                    console.error('Error fetching group', e);
                });
        },
        fetchGroupPermissions (groupId) {
            return fetch(`${this.server}/auth/groups/${groupId}/permissions`)
                .then(this.handleResponse)
                .then(permissions => {
                    this.initialPermissions.length = 0;
                    this.initialPermissions.push(...permissions);

                    this.selectedPermissions.length = 0;
                    this.selectedPermissions.push(...permissions);
                    this.selectedPermissions.sort(permissionSort);
                })
                .catch(e => {
                    console.error('Error fetching group', e);
                });
        },
        fetchPermissions () {
            return fetch(`${this.server}/auth/permissions`)
                .then(this.handleResponse)
                .then(permissions => {
                    this.permissions = [];
                    this.permissions.push(...permissions);
                    this.permissions.sort(permissionSort);
                })
                .catch(e => {
                    console.error('Error fetching permissions', e);
                });
        },
        saveGroup () {
            let group = Object.assign({}, this.groupToEdit); // So we don't break permissions in UI
            let request;
            if (this.groupId) {
                request = fetch(`${this.server}/auth/groups/${this.groupId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(group)
                });
            } else {
                request = fetch(`${this.server}/auth/groups`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(group)
                });
            }
            return request
                .then(this.handleResponse)
                .then(group => {
                    this.groupId = group.id;
                    return Promise.resolve(group);
                });
        },
        saveGroupPermissions () {
            let requests = [];
            this.selectedPermissions.forEach(selectedPermission => {
                if (!this.initialPermissions.find(ip => ip.id === selectedPermission.id)) {
                    requests.push(this.grantGroupPermission(selectedPermission));
                }
            });
            this.initialPermissions.forEach(initialPermission => {
                if (!this.selectedPermissions.find(sp => sp.id === initialPermission.id)) {
                    requests.push(this.revokeGroupPermission(initialPermission));
                }
            });
            return Promise.all(requests);
        },
        grantGroupPermission (permission) {
            return fetch(`${this.server}/auth/groups/${this.groupId}/permissions`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({permission_id: permission.id})
                })
                .then(this.handleResponse);
        },
        revokeGroupPermission (permission) {
            return fetch(`${this.server}/auth/groups/${this.groupId}/permissions/${permission.id}`, {
                    method: 'DELETE',
                    headers: {'Content-Type': 'application/json'}
                })
                .then(this.handleResponse);
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
    },
    components: {
        Multiselect
    }
};
function permissionSort (a, b) {
    return a.alias.toLowerCase().localeCompare(b.alias.toLowerCase());
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="scss">
    .group-edit-modal {
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
