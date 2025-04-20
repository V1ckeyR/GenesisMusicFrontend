<template>
    <div class="track-card" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
        <!-- Number -->
        <div class="track-number-wrapper">
            <span class="track-number">{{ number }}</span>
        </div>

        <!-- Cover -->
        <div class="cover" @click="onPlay">
            <img v-if="track.coverImage" :src="track.coverImage" alt="cover" @error="onImageError" />
            <el-icon v-else :size="56">
                <Picture />
            </el-icon>
            <el-icon v-if="isHovered" class="play-icon">
                <VideoPlay />
            </el-icon>
        </div>

        <!-- Info -->
        <div class="track-info" @click="onPlay">
            <div class="track-title">{{ track.title }}</div>
            <div class="track-artist">{{ track.artist }} · {{ track.album || "single" }} | created at {{
                formatDate(track.createdAt) }} | updated at {{ formatDate(track.updatedAt) }}</div>
            <div class="track-actions track-artist" :class="{ visible: isHovered }">{{ track.slug }}...</div>
        </div>

        <!-- Hover buttons -->
        <div class="track-actions" :class="{ visible: isHovered }" @click="onEdit">
            <el-icon>
                <Edit />
            </el-icon>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Track } from '@/types/Track'
import { Edit } from '@element-plus/icons-vue';

const props = defineProps<{
    track: Track,
    number: number
}>()

const emit = defineEmits<{
    (e: 'edit', payload: Track): void
}>();


const isHovered = ref<Boolean>(false)

function onPlay() {
    console.log('Play', props.track.title)
}

function onEdit() {
    emit("edit", props.track)
}

function formatDate(iso: string): string {
    return new Intl.DateTimeFormat('uk-UA', {
        dateStyle: 'short',
        timeStyle: 'short'
    }).format(new Date(iso))
}

function onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'https://element-plus.org/images/element-plus-logo.svg'
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
    filter: brightness(25%)
}

.track-number {
    font-weight: bold;
    color: #aaa;
}

.track-number-wrapper {
    width: 1.5em;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-variant-numeric: tabular-nums;
    font-weight: bold;
    color: #bbb;
    margin-right: 0.75rem;
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