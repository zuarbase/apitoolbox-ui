<template>
    <div class="z-background-wrapper" v-if="source">
        <div v-if="type==='image'" class="z-background-image" v-bind:style="{backgroundImage: 'url(' + source + ')'}" test-id="background-image"></div>
        <div v-else-if="type==='color'" class="z-background-color" v-bind:style="{backgroundColor: source}" test-id="background-color"></div>
        <video v-else-if="type==='video'" class="z-background-video" autoplay muted loop test-id="background-video">
            <source v-bind:src="source" type="video/mp4">
        </video>
    </div>
</template>

<script>
export default {
    name: 'BackgroundVisual',
    props: {
        src: String,
        color: String
    },
    data () {
        return {
            hexColorRegex: /^#.{6}$/g
        }
    },
    computed: {
        source () {
            return this.src || this.color || '';
        },
        type () {
            if (this.source) {
                if (this.source.endsWith('.mp4') || this.source.endsWith('.mov') || this.source.endsWith('.webm')) {
                    return 'video';
                } else if (this.hexColorRegex.test(this.source)) {
                    return 'color';
                } else {
                    return 'image';
                }
            } else {
                return false;
            }
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
    .z-background-color {
        width: 100%;
        height: 100%;
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
