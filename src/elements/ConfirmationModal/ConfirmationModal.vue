<template>
    <div v-show="false" ref="modalTemplate">
        <div class="modal-window confirmation-modal" ref="modalWrapper">
            <div class="modal fade" ref="modal">
                <div class="modal-dialog modal-md modal-dialog-scrollable">
                    <div class="modal-content">
                        <header class="modal-header">
                            <h3>{{ title }}</h3>
                        </header>
                        <main class="modal-body">
                            <div class="container-fluid">
                                <div class="row">
                                    <div class="col">
                                        {{ body }}
                                    </div>
                                </div>
                            </div>
                        </main>
                        <footer class="modal-footer">
                            <button
                                v-on:click="onCancelClick"
                                class="btn btn-secondary"
                            >
                                {{ cancelBtn }}
                            </button>
                            <button
                                v-on:click="onConfirmClick"
                                class="btn btn-primary"
                            >
                                {{ confirmBtn }}
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
    name: "ConfirmationModal",
    data: () => {
        return {
            title: "Confirm",
            body: "Confirm your action.",
            confirmBtn: "Ok",
            cancelBtn: "Cancel",

            isOpen: false, // Actual modal state
            resolve: null,
            reject: null,
        };
    },
    methods: {
        // Interface
        confirm({ title, body, confirmBtn, cancelBtn } = {}) {
            this.title = title || this.title;
            this.body = body || this.body;
            this.confirmBtn = confirmBtn || this.confirmBtn;
            this.cancelBtn = cancelBtn || this.cancelBtn;
            this.promise = new Promise((resolve, reject) => {
                this.resolve = resolve;
                this.reject = reject;
            });
            this.open();
            return this.promise;
        },
        // Local Methods
        onCancelClick() {
            this.close();
            this.reject();
        },
        onConfirmClick() {
            this.close();
            this.resolve();
        },
        open() {
            document.body.appendChild(this.$refs.modalWrapper);
            window.setTimeout(() => {
                this.$refs.modal.classList.add("show");
            }, 100);

            this.isOpen = true;
        },
        close() {
            this.$refs.modal.classList.remove("show");
            window.setTimeout(() => {
                this.$refs.modalTemplate.appendChild(this.$refs.modalWrapper);
                this.reset()
            }, 300);
            this.isOpen = false;
        },
        reset() {
            this.title = "Confirm";
            this.title = "Confirm your action.";
            this.confirmBtn = "Ok";
            this.cancelBtn = "Cancel";

            this.promise = null;
        },
    },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="scss">
.confirmation-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    background-color: rgba(0, 0, 0, 0.4);
    transition: all 0.3s;
    *,
    ::after,
    ::before {
        box-sizing: border-box;
    }
    .modal {
        display: block;
    }
    .modal-dialog {
        max-width: 500px;
        position: relative;
        margin: 1.75rem auto;
        transition: transform 0.3s ease-out;
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
