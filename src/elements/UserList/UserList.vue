<template>
    <div class="user-list__wrapper">
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Groups</th>
                    <th>Permissions</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users">
                    <th>{{user.id}}</th>
                    <td>{{user.email}}</td>
                    <td>{{user.name}}</td>
                    <td>{{user.groups.join(', ')}}</td>
                    <td class="permissions">{{user.permissions.join(', ')}}</td>
                    <td>
                        <button class="btn btn-secondary btn-small" v-on:click="onEditClick(user)">Edit</button>
                        <button class="btn btn-secondary btn-small">Delete</button>
                    </td>
                </tr>
          </tbody>
        </table>
        <user-edit-modal 
            :user-to-edit="userToEdit" 
            :open-modal="openModal" 
            :on-close="onModalClose">
        </user-edit-modal>
    </div>
</template>

<script>
    import UserEditModal from '../UserEditModal/UserEditModal.vue'
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
            }
        },
        created () {
            setTimeout(() => {
                this.users = [
                    {
                        id: 1,
                        name: 'Matt Laue',
                        email: 'matt@zuar.com',
                        groups: ['Administrator'],
                        permissions: ['Read', 'Write', 'Edit', 'Delete']
                    },
                    {
                        id: 2,
                        name: 'Dylan Spurgin',
                        email: 'dylan@dylanspurgin.com',
                        groups: ['Editor'],
                        permissions: ['Read', 'Write', 'Edit']
                    }
                ]
            }, 300)
            // fetch(`${this.server}/api/users`)
            //     .then(response => {
            //         console.debug('users', response)
            //     })

            document.addEventListener('user-created.ft', (e, p) => {
                console.debug('user-created.ft', e)
                this.users.push(e.detail.user)
            })

            document.addEventListener('user-edited.ft', (e, p) => {
                console.debug('user-edited.ft', e)
                Object.assign(this.users.find(user => user.id === e.detail.user.id), e.detail.user)
            })
        },
        methods: {
            onEditClick (user) {
                console.debug('edit click', user)
                this.userToEdit = user
                this.openModal = true
            },
            onModalClose () {
                this.openModal = false
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