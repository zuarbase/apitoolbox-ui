<template>
    <div class="group-view__wrapper container">
        <div class="row">
            <div class="col-8">
                <h3>{{group.name}}</h3>
            </div>
            <div class="col-4"><button class="btn btn-primary" v-on:click="onEditClick">Edit</button></div>
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
                {{group.created_at}}
            </div>
        </div>

        <div class="row py-2">
            <div class="col-2 d-flex justify-content-end font-weight-bold">
                Last updated at
            </div>
            <div class="col-10 d-flex justify-content-start">
                {{group.updated_at}}
            </div>
        </div>

        <group-edit-modal 
            :group-id="group.id" 
            :open-modal="openModal">
        </group-edit-modal>
    </div>
</template>
<script>
    import GroupEditModal from '../GroupEditModal/GroupEditModal.vue'
    export default {
        name: 'GroupView',
        props: {
            server: String,
            groupId: String
        },
        data: () => {
            return {
                openModal: false,
                group: {},
                permissions: []
            };
        },
        created () {
            // TODO - this group
            document.addEventListener('group-edited.at', (e, p) => {
                console.debug('group-edited.at', e);
                // Object.assign(this.users.find(user => user.id === e.detail.user.id), e.detail.user);
            });
        },
        watch: {
            groupId: function (val) {
                if (val) {
                    this.fetchGroup();
                    this.fetchGroupPermissions();
                }
            }
        },
        methods: {
            fetchGroup () {
                fetch(`${this.server}/auth/groups/${this.groupId}`)
                    .then(this.handleResponse)
                    .then(group => {
                        this.group = group;
                    });
            },
            fetchGroupPermissions () {
                fetch(`${this.server}/auth/groups/${this.groupId}/permissions`)
                    .then(this.handleResponse)
                    .then(permissions => {
                        this.permissions = permissions;
                        console.debug('permissions', this.permissions);
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
            onEditClick () {
                this.openModal = false;
                window.setTimeout(() => {
                    this.openModal = true;
                });
            }
        },
        components: {GroupEditModal}
    }
</script>

<style lang="scss">
    .group-view__wrapper {
        font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #212529;

        *, ::after, ::before {
            box-sizing: border-box;
        }
    }
</style>
