<template>
    <div class="permission-list__wrapper">
        <div class="row justify-content-sm-end">
            <div class="col-2">
                <button class="btn btn-block btn-primary" v-on:click="onAddPermissionClick">Add Permission</button>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Alias</th>
                            <th width="1">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-if="permissions.length && !loading">
                            <tr v-for="permission in permissions" v-bind:key="permission.id">
                                <td>{{permission.name}}</td>
                                <td>{{permission.alias}}</td>
                                <td>
                                    <button class="btn btn-secondary btn-small" v-on:click="onEditClick(permission)">Edit</button>
                                    <button class="btn btn-secondary btn-small" v-on:click="onDeleteClick(permission)">Delete</button>
                                </td>
                            </tr>
                        </template>
                        <tr v-if="!permissions.length && !loading">
                            <td colspan="3" class="text-center">No data</td>
                        </tr>
                        <tr v-if="loading">
                            <td colspan="3" class="text-center">Loading...</td>
                        </tr>
                </tbody>
                </table>
            </div>
        </div>
        <permission-edit-modal 
            :server="server"
            :permission-to-edit="permissionToEdit" 
            :open-modal="openModal" 
            :on-close="onModalClose">
        </permission-edit-modal>
    </div>
</template>

<script>
    import PermissionEditModal from '../PermissionEditModal/PermissionEditModal.vue'
    export default {
        name: 'PermissionList',
        props: {
            server: String
        },
        data: () => {
            return {
                permissions: [],
                loading:false,
                openModal: false,
                permissionToEdit: {}
            }
        },
        created () {
            this.loading = true;
            fetch(`${this.server}/auth/permissions`)
                .then( res =>res.json())
                .then(permissions => {
                    this.loading = false;
                    this.permissions = permissions;
                    console.log('permissions request success', permissions)
                })
                .catch(err=>{
                    this.loading = false;
                    console.debug('Error retrieving permission list or parsing response', err)
                })

            document.addEventListener('permission-created.ft', (e, p) => {
                console.debug('permission-created.ft', e)
                this.permissions.push(e.detail.permission)
            })

            document.addEventListener('permission-edited.ft', (e, p) => {
                console.debug('permission-edited.ft', e)
                Object.assign(this.permissions.find(permission => permission.id === e.detail.permission.id), e.detail.permission)
            })
        },
        methods: {
            onAddPermissionClick () {
                this.permissionToEdit = {};
                this.openModal = true;
            },
            onEditClick (permission) {
                this.permissionToEdit = permission;
                this.openModal = true;
            },
            onModalClose () {
                this.openModal = false;
            },
            onDeleteClick (permission) {
                fetch(`${this.server}/auth/permissions/${permission.id}`,{
                    method:'DELETE'
                })
                    .then(permissions => {
                        this.permissions = this.permissions.filter(perm=>perm.id !== permission.id);
                    })
                    .catch(err => {
                        this.loading = false;
                        console.debug('Error removing permission or parsing response', err)
                    })
            }
        },
        components: {PermissionEditModal}
    }
</script>

<style lang="scss">
    
    .permission-list__wrapper {
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
