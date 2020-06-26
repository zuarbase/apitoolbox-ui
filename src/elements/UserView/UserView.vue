<template>
    <div class="user-view__wrapper container">
        <div class="row">
            <div class="col-8">
                <h3>{{user.fullname}}</h3>
            </div>
            <div class="col-4"><button class="btn btn-primary" v-on:click="onEditClick">Edit</button></div>
        </div>
        <div class="row py-2">
            <div class="col-2 d-flex justify-content-end font-weight-bold">
                ID    
            </div>
            <div class="col-10 d-flex justify-content-start">
                {{user.id}}
            </div>
        </div>
        <div class="row py-2">
            <div class="col-2 d-flex justify-content-end font-weight-bold">
                Username
            </div>
            <div class="col-10 d-flex justify-content-start">
                {{user.username}}
            </div>
        </div>

        <div class="row py-2">
            <div class="col-2 d-flex justify-content-end font-weight-bold">
                Email
            </div>
            <div class="col-10 d-flex justify-content-start">
                {{user.email}}
            </div>
        </div>

        <div class="row py-2">
            <div class="col-2 d-flex justify-content-end font-weight-bold">
                Groups
            </div>
            <div class="col-10 d-flex justify-content-start">
                <div v-for="group in groups" class="row">
                    <div class="col">
                        <div class="font-weight-italic">{{group.name}}</div>
                        <ul v-if="group.permissions">
                            <li v-for="permission in group.permissions">{{permission.name}}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="row py-2">
            <div class="col-2 d-flex justify-content-end font-weight-bold">
                Permissions
            </div>
            <div class="col-10 d-flex justify-content-start">
                {{permissions.map(p => p.name).join(', ')}}
            </div>
        </div>

        <div class="row py-2">
            <div class="col-2 d-flex justify-content-end font-weight-bold">
                Created at
            </div>
            <div class="col-10 d-flex justify-content-start">
                {{user.created_at}}
            </div>
        </div>

        <div class="row py-2">
            <div class="col-2 d-flex justify-content-end font-weight-bold">
                Last updated at
            </div>
            <div class="col-10 d-flex justify-content-start">
                {{user.updated_at}}
            </div>
        </div>

        <user-edit-modal 
            :user-id="userToEdit.id" 
            :open-modal="openModal" 
            :on-close="onModalClose">
        </user-edit-modal>
    </div>
</template>
<script>
    import UserEditModal from '../UserEditModal/UserEditModal.vue'
    export default {
        name: 'UserView',
        props: {
            server: String,
            userId: String
        },
        data: () => {
            return {
                user: {},
                groups: [],
                permissions: [],
                openModal: false,
                userToEdit: {}
            };
        },
        created () {
            // TODO - this user
            document.addEventListener('user-edited.at', (e, p) => {
                console.debug('user-edited.at', e);
                // Object.assign(this.users.find(user => user.id === e.detail.user.id), e.detail.user);
            });
        },
        watch: {
            userId: function (val) {
                if (val) {
                    this.fetchUser();
                    this.fetchUserGroups()
                        .then(this.fetchGroupPermissions);
                    this.fetchUserPermissions();
                }
            }
        },
        methods: {
            fetchUser () {
                fetch(`${this.server}/auth/users/${this.userId}`)
                    .then(this.handleResponse)
                    .then(user => {
                        this.user = user;
                        console.debug('user', this.user);
                    });
            },
            fetchUserGroups () {
                return fetch(`${this.server}/auth/users/${this.userId}/groups`)
                    .then(this.handleResponse)
                    .then(groups => {
                        console.debug('selected groups', groups);
                        let requests = [];
                        groups.forEach(group => {
                            this.fetchGroupPermission(group)
                                .then(() => {
                                    this.groups.push(group);       
                                });
                        });
                        return Promise.all(requests);
                    })
                    .catch(e => {
                        console.error('Error fetching user groups', e);
                    });
            },
            fetchUserPermissions () {
                return fetch(`${this.server}/auth/users/${this.userId}/permissions`)
                    .then(this.handleResponse)
                    .then(permissions => {
                        this.permissions = permissions;
                    })
                    .catch(e => {
                        console.error('Error fetching user to edit', e);
                    });
            },
            fetchGroupPermission (group) {
                // let requests = [];
                // this.groups.forEach(group => {
                return fetch(`${this.server}/auth/groups/${group.id}/permissions`)
                    .then(this.handleResponse)
                    .then(permissions => {
                        console.debug('permissions', permissions);
                        group.permissions = permissions;
                        return group;
                    })
                    .catch(e => {
                        console.error('Error fetching group permissions', e);
                    });
                // });
                // return Promise.all(requests);
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
            onEditClick () {
                this.userToEdit = this.user;
                this.openModal = false;
                window.setTimeout(() => {
                    this.openModal = true;
                });
            }
        },
        components: {UserEditModal}
    }
</script>

<style lang="scss">
    .user-list__wrapper {
        font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #212529;

        *, ::after, ::before {
            box-sizing: border-box;
        }
    }
</style>
