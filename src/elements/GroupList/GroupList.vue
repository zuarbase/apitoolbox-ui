<template>
    <div class="group-list__wrapper container">
        <div class="row justify-content-sm-end">
            <div class="col col-sm-6 d-flex justify-content-start">
                <h3>Groups</h3>
            </div>
            <div class="col col-sm-6 d-flex justify-content-end">
                <button class="btn btn-primary" v-on:click="onAddGroupClick">Add Group</button>
            </div>
        </div>
        <div class="row mt-4">
            <div class="col">
                <table class="table table-striped table-responsive-xs">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th width="1">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-if="groups.length && !loading">
                            <tr v-for="group in groups" v-bind:key="group.id">
                                <td>{{group.name}}</td>
                                <td>
                                    <button class="btn btn-secondary btn-small" v-on:click="onViewClick(group)">View</button>
                                    <button class="btn btn-secondary btn-small" v-on:click="onEditClick(group)">Edit</button>
                                    <button class="btn btn-secondary btn-small" v-on:click="onDeleteClick(group)">Delete</button>
                                </td>
                            </tr>
                        </template>
                        <tr v-if="!groups.length && !loading">
                            <td colspan="3" class="text-center">No data</td>
                        </tr>
                        <tr v-if="loading">
                            <td colspan="3" class="text-center">Loading...</td>
                        </tr>
                </tbody>
                </table>
            </div>
        </div>
        <group-edit-modal 
            :server="server"
            :group-id="groupToEdit.id"
            :open-modal="openModal">
        </group-edit-modal>
    </div>
</template>

<script>
import GroupEditModal from '../GroupEditModal/GroupEditModal.vue'
export default {
    name: 'GroupList',
    props: {
        server: String
    },
    data: () => {
        return {
            groups: [],
            loading: false,
            openModal: false,
            groupToEdit: {}
        }
    },
    created () {
        this.loading = true;
        fetch(`${this.server}/auth/groups`)
            .then(res => res.json())
            .then(groups => {
                this.loading = false;
                this.groups = groups.sort(groupSort);
            })
            .catch(err => {
                this.loading = false;
                console.debug('Error retrieving group list or parsing response', err)
            });

        document.addEventListener('group-created.at', (e, p) => {
            this.groups.push(e.detail.group);
            this.groups.sort(groupSort);
        });

        document.addEventListener('group-edited.at', (e, p) => {
            Object.assign(this.groups.find(group => group.id === e.detail.group.id), e.detail.group);
        });
    },
    methods: {
        onAddGroupClick () {
            this.groupToEdit = {};
            this.openModal = false;
            window.setTimeout(() => {
                this.openModal = true;
            });
        },
        onViewClick (group) {
            const event = new CustomEvent('group-view.at', { detail: { group: group } });
            this.$el.parentNode.dispatchEvent(event);
        },
        onEditClick (group) {
            this.groupToEdit = group;
            this.openModal = false;
            window.setTimeout(() => {
                this.openModal = true;
            });
        },
        onModalClose () {
            this.openModal = false;
        },
        onDeleteClick (group) {
            fetch(`${this.server}/auth/groups/${group.id}`,{
                method: 'DELETE'
            })
                .then(groups => {
                    this.groups = this.groups.filter(grp => grp.id !== group.id);
                })
                .catch(err => {
                    this.loading = false;
                    console.debug('Error removing group or parsing response', err)
                })
        }
    },
    components: { GroupEditModal }
}
function groupSort (a, b) {
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
}
</script>

<style lang="scss">
    .group-list__wrapper {
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
