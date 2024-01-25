<template>
    <div class="user-list__wrapper">
        <div class="row justify-content-sm-end">
            <div class="col col-sm-6 d-flex justify-content-start">
                <h3>Users</h3>
            </div>
            <div class="col col-sm-6 d-flex justify-content-end">
                <button class="btn btn-primary" v-on:click="onAddClick">Add User</button>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <table class="table table-striped table-responsive-xs">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Admin</th>
                            <th width="1">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in users">
                            <td>{{user.username}}</td>
                            <td>{{user.fullname}}</td>
                            <td>{{user.email}}</td>
                            <td><input type="checkbox" :checked="user.admin" disabled></td>
                            <td>
                                <button class="btn btn-secondary btn-small" v-on:click="onViewClick(user.id)">View</button>
                                <button class="btn btn-secondary btn-small" v-on:click="onEditClick(user)">Edit</button>
                                <button class="btn btn-danger btn-small" v-on:click="onDeleteClick(user)">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <user-edit-modal 
            :user-id="userToEdit.id" 
            :open-modal="openModal" 
            :on-close="onModalClose">
        </user-edit-modal>
        <confirmation-modal ref="confirmationModal"></confirmation-modal>
    </div>
</template>
<script>
    import UserEditModal from '../UserEditModal/UserEditModal.vue'
    import ConfirmationModal from '../ConfirmationModal/ConfirmationModal.vue'
    export default {
        name: 'UserList',
        props: {
            server: String
        },
        data: () => {
            return {
                users: [],
                openModal: false,
                userToEdit: {}
            };
        },
        created () {
            this.users.length = 0;
            fetch(`${this.server}/auth/users`)
                .then(this.handleResponse)
                .then(json => {
                    this.users.push(...json);
                    this.users.sort(userSort);
                    console.debug('users', this.users);
                });

            document.addEventListener('user-created.at', (e, p) => {
                console.debug('user-created.ft', e);
                this.users.push(e.detail.user);
                this.users.sort(userSort);
            });

            document.addEventListener('user-edited.at', (e, p) => {
                console.debug('user-edited.ft', e);
                Object.assign(this.users.find(user => user.id === e.detail.user.id), e.detail.user);
            });
        },
        methods: {
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
            onAddClick () {
                this.userToEdit = {
                    groups: [],
                    permissions: []
                };
                this.openModal = false;
                window.setTimeout(() => {
                    this.openModal = true;    
                });
            },
            onEditClick (user) {
                this.userToEdit = user;
                this.openModal = false;
                window.setTimeout(() => {
                    this.openModal = true;
                });
            },
            onViewClick (userId) {
                let event = new CustomEvent('user-view.at', {detail: {userId}});
                this.$el.parentNode.dispatchEvent(event);
            },
            onDeleteClick (user) {
                this.$refs.confirmationModal.confirm({
                    heading:'Remove user',
                    body:`Confirm removing user ${user.username}`
                }).then(() => {
                    fetch(`${this.server}/auth/users/${user.id}`,{
                        method:'DELETE'
                    })
                    .then(() => {
                        this.users = this.users.filter(usr=>usr.id !== user.id);
                    })
                    .catch(err => {
                        this.loading = false;
                        console.debug('Error removing user or parsing response', err)
                    })
                })
                .catch(() =>{});
            },
            onModalClose () {
                this.openModal = false;
            }
        },
        components: {
            UserEditModal,
            ConfirmationModal
        }
    }

    function userSort (a, b) {
        return a.username.toLowerCase().localeCompare(b.username.toLowerCase());
    }
</script>

<style lang="scss">
    
    .user-list__wrapper {
        font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #212529;

        *, ::after, ::before {
            box-sizing: border-box;
        }
        
        .table {
            width: 100%;
            max-width: 100%;
            border-collapse: collapse;
            text-align: left;
        }
        .table thead th {
            vertical-align: bottom;
            border-bottom: 2px solid #dee2e6;
            padding: .75rem;
            border-top: 1px solid #dee2e6;
        }
        .table th, .table td {
            padding: .75rem;
            vertical-align: top;
            border-top: 1px solid #dee2e6;
        }
        .table td:last-of-type{
            white-space: nowrap;
        }
        .permissions {
            font-size: .8rem;
            font-family: Consolas, "Andale Mono WT", "Andale Mono", "Lucida Console", "Lucida Sans Typewriter", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Liberation Mono", "Nimbus Mono L", Monaco, "Courier New", Courier, monospace;
        }

        .btn {
            border-radius: 2px;
            padding: .5rem 1rem;
            line-height: 1.5rem;
            font-size: 1rem;
            font-weight: bold;
            border: none;
            margin-bottom: 20px;
            color: #fff;
        }
        .btn-small {
            margin-bottom: 0px;
            padding: .1rem .3rem;
            line-height: .8rem;
            font-size: .8rem;
            font-weight: normal;
        }
        .btn-secondary {
            background: transparent;
            border: solid 1px #fa225b;
            color: #fa225b;
        }
        .btn.btn-secondary:hover {
            box-shadow: 0 0 4px 1px rgba(250, 34, 91, 0.1);
        }
        .btn:hover {
            cursor: pointer;
            box-shadow: 0 0 10px 4px rgba(250, 34, 91, 0.1);
        }
        .btn:focus {
            outline: 0;
        }
    }
</style>
