<template>
    <div v-show="false" ref="permissionModalTemplate">
        <div class="modal__wrapper" ref="permissionModalWrapper">
            <div class="modal-backdrop">
                <div
                    class="modal"
                    v-bind:class="{ show: isOpen, 'd-block': isOpen }"
                >
                    <header class="header">
                        <h1 v-if="!permission.id">Add User</h1>
                        <h1 v-if="permission.id">Edit User</h1>
                    </header>
                    <main class="main">
                        <form class="form" novalidate>
                            <div class="form-group">
                                <input
                                    type="text"
                                    class="form-control"
                                    name="name"
                                    placeholder="Name"
                                    ref="name"
                                    v-model="permission.name"
                                    :required="true"
                                />
                            </div>
                            <div class="form-group">
                                <input
                                    type="text"
                                    class="form-control"
                                    name="alias"
                                    placeholder="Alias"
                                    ref="alias"
                                    v-model="permission.alias"
                                    :required="true"
                                />
                            </div>
                        </form>
                    </main>
                    <footer class="footer">
                        <button v-on:click="onCancelClick" class="btn btn-link">
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
</template>

<script>
export default {
    name: "PermissionEditModal",
    props: {
        server: String,
        openModal: Boolean, // Requested modal state
        onClose: Function,
        permissionToEdit: Object
    },
    data: () => {
        return {
            permission: {},
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
                if (this.permissionToEdit.id) {
                    let permissionCopy = Object.assign({}, this.permissionToEdit);
                    Object.assign(this.permission, permissionCopy);
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
            let request;
            Object.assign(this.permissionToEdit, this.permission);

            if (this.permissionToEdit.id) {
                request = fetch(`${this.server}/auth/permissions/${this.permissionToEdit.id}`, {
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
                .then(res => res.json())
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
        open() {
            console.debug("Opening modal");
            document.body.appendChild(this.$refs.permissionModalWrapper);
            this.isOpen = true;
        },
        close() {
            this.$refs.permissionModalTemplate.appendChild(
                this.$refs.permissionModalWrapper
            );
            this.isOpen = false;
            if (typeof this.onClose === "function") {
                this.onClose();
            }
        }
    }
};
</script>

<style lang="scss">
.modal__wrapper {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 999;

    *,
    ::after,
    ::before {
        box-sizing: border-box;
    }

    .modal-backdrop {
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.4);
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
        padding: 0.5rem 1rem;
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
        padding: 0.375rem 0.75rem;
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
    .form-control.error,
    .form-control.vf-invalid {
        border-color: #d9534f;
        background: #fff0f4;
    }
    .error-message {
        color: #d9534f;
        font-size: 0.8rem;
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
