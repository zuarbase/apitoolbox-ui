<template>
    <div class="z-background-wrapper" v-if="src">
        <div v-if="type==='image'" class="z-background-image" v-bind:style="{backgroundImage: 'url(' + src + ')'}" test-id="background-image"></div>
        <video v-else class="z-background-video" autoplay muted loop test-id="background-video">
            <source v-bind:src="src" type="video/mp4">
        </video>
    </div>
</template>

<script>
export default {
    name: 'BackgroundVisual',
    props: {
        src: String
    },
    computed: {
        type () {
            return this.src ? this.src.endsWith('.mp4') || this.src.endsWith('.mov') || this.src.endsWith('.webm') ? 'video' : 'image' : null;
        }
    }
};
</script>

<style>
    z-background-visual {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    .z-background-wrapper {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
    }
    .z-background-image {
        width: 100%;
        height: 100%;
        background-position: center;
        background-size: cover;
    }
    .z-background-video {
        position: relative; /* fixed */
        top: 0;
        left: 50%;
        /* z-index: -1; */
        pointer-events: none;
        overflow: hidden;
        min-height: 100vh;
        min-width: 100vw;
        transform: translate(-50%);
    }
    .z-background-video source {
        width: 100vw;
        height: 56.25vw;
        min-height: 100vh;
        min-width: 177.77vh;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>
