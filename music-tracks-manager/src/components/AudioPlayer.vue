<template>
    <div class="audio-player" :data-testid="`audio-player-${id}`">
        <button v-if="!isPlaying" @click="play" :data-testid="`play-button-${id}`" class="control-button">
            <el-icon>
                <VideoPlay />
            </el-icon>
        </button>
        <button v-else @click="pause" :data-testid="`pause-button-${id}`" class="control-button">
            <el-icon>
                <VideoPause />
            </el-icon>
        </button>

        <div class="progress-wrapper" @click="seek($event)">
            <div class="progress-bar" :style="{ width: progress + '%' }" :data-testid="`audio-progress-${id}`"></div>
        </div>

        <div class="time-display">
            {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
        </div>

        <input type="range" min="0" max="1" step="0.01" v-model.number="volume" class="volume-slider"
            :title="`Volume: ${Math.round(volume * 100)}%`" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAudioStore } from '@/stores/audioStore'
import { VideoPlay, VideoPause } from '@element-plus/icons-vue'

const props = defineProps<{
    id: string
    fileName: string
}>()

const audioStore = useAudioStore()

const isPlaying = computed(() => audioStore.isPlaying && audioStore.currentFile === props.fileName)
const currentTime = computed(() => audioStore.currentTime)
const duration = computed(() => audioStore.duration)
const progress = computed(() => audioStore.progressFor(props.fileName))
const volume = computed({
    get: () => audioStore.volume,
    set: (val) => audioStore.setVolume(val)
})

function play() {
    audioStore.play(props.fileName)
}

function pause() {
    audioStore.pause()
}

function seek(event: MouseEvent) {
    const wrapper = event.currentTarget as HTMLElement
    const rect = wrapper.getBoundingClientRect()
    const offsetX = event.clientX - rect.left
    const ratio = offsetX / rect.width
    audioStore.seek(ratio)
}

function formatTime(sec: number): string {
    const minutes = Math.floor(sec / 60)
    const seconds = Math.floor(sec % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.audio-player {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
}

.control-button {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0.5rem;
}

.progress-wrapper {
    flex-grow: 1;
    height: 4px;
    background-color: #ccc;
    border-radius: 2px;
    overflow: hidden;
    cursor: pointer;
    position: relative;
}

.progress-bar {
    height: 100%;
    background-color: #409eff;
    transition: width 0.1s linear;
}

.volume-slider {
    width: 80px;
    cursor: pointer;
}

.time-display {
    font-size: 0.8rem;
    color: #aaa;
    white-space: nowrap;
    min-width: 60px;
    text-align: right;
}
</style>