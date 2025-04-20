<template>
    <div class="track-card" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
        <!-- Cover -->
        <div class="cover" @click="onPlay">
            <img :src="track.coverImage" alt="cover" />
            <el-icon v-if="isHovered" class="play-icon">
                <VideoPlay />
            </el-icon>
        </div>

        <!-- Info -->
        <div class="track-info" @click="onPlay">
            <div class="track-title">{{ track.title }}</div>
            <div class="track-artist">{{ track.artist }} · {{ track.album || "single" }}</div>
        </div>

        <!-- Hover buttons -->
        <div class="track-actions" :class="{ visible: isHovered }">
            <el-icon>
                <MoreFilled />
            </el-icon>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
    track: {
        type: Object,
        required: true
    }
})

const isHovered = ref(false)

const onPlay = () => {
    console.log('Play', props.track.title)
}
</script>

<style scoped>
.track-card {
    display: flex;
    align-items: center;
    padding: 10px;
    transition: background-color 0.3s;
    cursor: pointer;
    border-radius: 20px;
    min-width: 400px;
}

.track-card:hover>.cover img {
    /* background-color: #00000056; */
    filter: brightness(25%)
}

.cover {
    position: relative;
    width: 56px;
    height: 56px;
    margin-right: 12px;
}

.cover img {
    width: 100%;
    height: 100%;
    border-radius: 4px;
    object-fit: cover;
}

.play-icon {
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 24px;
    color: white;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 50%;
    padding: 4px;
}

.track-info {
    flex-grow: 1;
    text-align: start;
}

.track-title {
    font-weight: 600;
    color: #fff;
}

.track-artist {
    font-size: 12px;
    color: #aaa;
}

.track-actions {
    display: flex;
    gap: 10px;
    align-items: center;
    opacity: 0;
}

.track-actions.visible {
    opacity: 1;
}

.track-duration {
    color: #888;
    font-size: 12px;
    margin-left: 16px;
}
</style>