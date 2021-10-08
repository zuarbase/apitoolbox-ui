<template>
    <div class="user-add-button__wrapper">
        <span v-on:click="onButtonClick">
            <slot></slot>
        </span>
        <subscribe-modal :server="server" :selected-dashboard="dashboard" :open-modal="openModal" :on-close="onModalClose"></subscribe-modal>
    </div>
</template>

<script>
import SubscribeModal from '../SubscribeModal/SubscribeModal.vue';
export default {
    name: 'UserAddButton',
    props: {
        server: String,
        buttonText: String,
        dashboard: Object
    },
    data: () => {
        return {
            openModal: false
        };
    },
    methods: {
        onButtonClick () {
            this.openModal = true;
        },
        onModalClose () {
            this.openModal = false;
        }
    },
    components: { SubscribeModal }
};
</script>

<style scoped lang="scss">
.user-add-button__wrapper {
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #212529;

    *, ::after, ::before {
        box-sizing: border-box;
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
    .btn-primary {
        background: #fa225b;
    }
    .btn-link {
        color: #fa225b;
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
}
</style>
