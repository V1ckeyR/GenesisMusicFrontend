<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { Track } from '@/types/Track'
import { useTrackStore } from '@/stores/trackStore';

const trackStore = useTrackStore();

const visible = defineModel<boolean>('visible');

const props = defineProps<{
    track: Track | null,
}>()

const emit = defineEmits<{
    (e: 'close'): void
}>();

const onClose = () => emit('close');

const isDragging = ref(false)

function onFileDrop(event: DragEvent) {
    event.preventDefault()
    isDragging.value = false
    const file = event.dataTransfer?.files?.[0]
    if (file && props.track) {
        handleUpload(file)
    }
}

function handleFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file && props.track) {
        handleUpload(file)
    }
    (event.target as HTMLInputElement).value = ''
}

async function handleUpload(file: File) {
    const isValid = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/x-wav'].includes(file.type)
    const isLt10MB = file.size / 1024 / 1024 < 10

    if (!isValid) {
        ElMessage.error('Allowed formats: MP3, WAV, OGG')
        return
    }

    if (!isLt10MB) {
        ElMessage.error('File must be smaller than 10MB')
        return
    }

    const audioUrl = await trackStore.uploadAudioFile(props.track!, file)
    if (audioUrl) {
        onClose();
    }
}
</script>

<template>
    <el-dialog v-model="visible" title="Upload Audio" width="400px" @close="onClose">
        <div class="drop-zone" :class="{ dragging: isDragging }" @dragover.prevent="isDragging = true"
            @dragleave="isDragging = false" @drop="onFileDrop">
            <p>Drag and drop your audio file here</p>
            <p>or</p>
            <label class="upload-button">
                Choose File
                <input type="file" accept=".mp3,.wav,.ogg" @change="handleFileChange" />
            </label>
        </div>

        <template #footer>
            <el-button @click="onClose">Cancel</el-button>
        </template>
    </el-dialog>
</template>

<style scoped>
.drop-zone {
    border: 2px dashed #ccc;
    padding: 2rem;
    text-align: center;
    border-radius: 8px;
    transition: border-color 0.3s;
}

.drop-zone.dragging {
    border-color: #409eff;
    background-color: rgba(64, 158, 255, 0.05);
}

.upload-button {
    display: inline-block;
    background-color: #409eff;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 0.5rem;
}

.upload-button input {
    display: none;
}
</style>
