<script setup lang="ts">
import { reactive, computed, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { Track, TrackFormPayload } from '@/types/Track'

const visible = defineModel<boolean>('visible');

const props = defineProps<{
    track: Track | null
}>();

const emit = defineEmits<{
    (e: 'save', payload: TrackFormPayload): void
    (e: 'close'): void
}>();

const formRef = ref<FormInstance>()
const defaultForm: TrackFormPayload = {
    title: '',
    artist: '',
    album: '',
    genres: [],
    coverImage: '',
    slug: ''
}

const form = reactive<TrackFormPayload>({ ...defaultForm });


const availableGenres = ref<string[]>(['Pop', 'Rock', 'Jazz', 'Hip-hop']);  // mock

watch(
    () => props.track,
    (track) => {
        if (track) {
            Object.assign(form, {
                title: track.title,
                artist: track.artist,
                album: track.album,
                genres: [...track.genres],
                coverImage: track.coverImage,
                slug: track.slug
            })
        } else {
            resetForm()
        }
    },
    { immediate: true }
)

const dialogTitle = computed(() => (props.track ? 'Edit Track' : 'New Track'));

function resetForm() {
    Object.assign(form, { ...defaultForm });
}

function onClose() {
    resetForm();
    emit('close');
}

function submitForm() {
    formRef.value?.validate((valid) => {
        if (valid) {
            const payload: TrackFormPayload = { ...form };
            emit('save', payload);
        }
    })
}

const rules: FormRules = {
    title: [{ required: true, message: 'Enter title', trigger: 'blur' }],
    artist: [{ required: true, message: 'Enter artist', trigger: 'blur' }],
    album: [{ required: false, message: 'Enter album', trigger: 'blur' }],
    genres: [
        {
            type: 'array',
            required: true,
            message: 'Select at least one genre',
            trigger: 'change'
        }
    ],
    coverImage: [{ required: false, message: 'Enter cover image URL', trigger: 'blur' }]
}
</script>
<template>
    <el-dialog v-model="visible" :title="dialogTitle" width="500px" :close-on-click-modal="true" @close="onClose">
        <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
            <el-form-item label="Title" prop="title">
                <el-input v-model="form.title" autocomplete="off" />
            </el-form-item>

            <el-form-item label="Artist" prop="artist">
                <el-input v-model="form.artist" autocomplete="off" />
            </el-form-item>

            <el-form-item label="Album" prop="album">
                <el-input v-model="form.album" autocomplete="off" />
            </el-form-item>

            <el-form-item label="Genres" prop="genres">
                <el-select v-model="form.genres" multiple filterable allow-create default-first-option
                    placeholder="Select or type genres" style="width: 100%">
                    <el-option v-for="genre in availableGenres" :key="genre" :label="genre" :value="genre"/>
                </el-select>
            </el-form-item>

            <el-form-item label="Slug" prop="slug">
                <el-input v-model="form.slug" autocomplete="off" />
            </el-form-item>

            <el-form-item label="Cover Image" prop="coverImage">
                <el-input v-model="form.coverImage" placeholder="https://example.com/cover.jpg" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="resetForm">Reset</el-button>
            <el-button @click="onClose">Cancel</el-button>
            <el-button type="primary" @click="submitForm">Save</el-button>
        </template>
    </el-dialog>
</template>

<style>
.el-tag {
    color: white;
    background-color: #409EFF;
}

svg {
    color: white;
}
</style>