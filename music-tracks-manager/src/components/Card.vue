<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Track } from '@/types/Track'
import { Edit } from '@element-plus/icons-vue'
import AudioPlayer from './AudioPlayer.vue';

const props = defineProps<{
    track: Track,
    number: number
}>()

const isHovered = ref<Boolean>(false);

const emit = defineEmits<{
    (e: 'edit', payload: Track): void
    (e: 'delete', payload: Track): void
    (e: 'upload-audio', payload: Track): void
    (e: 'delete-audio', payload: Track): void
}>();

const onEdit = () => emit("edit", props.track)
const onDelete = () => emit("delete", props.track)

function handleAudioCommand(command: string) {
    switch (command) {
        case 'upload':
            emit('upload-audio', props.track)
            break
        case 'delete':
            emit('delete-audio', props.track)
            break
    }
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

<template>
    <div class="track-card" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
        <!-- Number -->
        <div class="track-number-wrapper">
            <span class="track-number">{{ number }}</span>
        </div>

        <!-- Cover -->
        <div class="cover">
            <img v-if="track.coverImage" :src="track.coverImage" alt="cover" @error="onImageError" />
            <el-icon v-else :size="64">
                <Picture />
            </el-icon>
        </div>

        <!-- Info -->
        <div class="track-info">
            <div class="track-title" :data-testid="`track-item-${props.track.id}-title`">{{ track.title }}</div>
            <div class="track-artist" :data-testid="`track-item-${props.track.id}-artist`">{{ track.artist }} · {{ track.album || "single" }} | created at {{
                formatDate(track.createdAt) }} | updated at {{ formatDate(track.updatedAt) }}</div>
            <AudioPlayer v-if="track.audioFile" :id="track.id" :file-name="track.audioFile!"/>
            <div v-else style="height: 32px; margin-top: 8px; margin-bottom: 6px;" />
        </div>

        <!-- Hover buttons -->
        <div class="track-actions" :class="{ visible: isHovered }">
            <el-icon @click="onEdit" :data-testid="`edit-track-${props.track.id}`">
                <Edit />
            </el-icon>
            <el-icon @click="onDelete" :data-testid="`delete-track-${props.track.id}`">
                <Delete />
            </el-icon>
            <el-dropdown trigger="click" @command="handleAudioCommand">
                <el-icon class="more-icon">
                    <MoreFilled />
                </el-icon>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="upload" :data-testid="`upload-track-${props.track.id}`">Upload Audio</el-dropdown-item>
                        <el-dropdown-item command="delete" :disabled="!track.audioFile">Delete Audio</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<style scoped>
.track-card {
    display: flex;
    align-items: center;
    padding: 5px;
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
    width: 64px;
    height: 64px;
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
    top: 16px;
    left: 16px;
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

audio {
    height: 32px;
}
</style>