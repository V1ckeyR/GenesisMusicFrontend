<script setup lang="ts">
import { reactive, computed, ref, watch, nextTick, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { Track, TrackFormPayload } from '@/types/Track'
import { useGenreStore } from '@/stores/genreStore'
import Loader from '@/components/Loader.vue'

const genreStore = useGenreStore()

const availableGenres = computed(() => genreStore.genres);
const isLoading = computed(() => genreStore.isLoading);

const visible = defineModel<boolean>('visible');

const props = defineProps<{
    track: Track | null
}>();

const emit = defineEmits<{
    (e: 'save', payload: TrackFormPayload): void
    (e: 'close'): void
    (e: 'delete', track: Track): void
}>();

const formRef = ref<FormInstance>()
const defaultForm: TrackFormPayload = {
    title: '',
    artist: '',
    album: '',
    genres: [],
    coverImage: '',
}

const initialFormState = ref<TrackFormPayload>({ ...defaultForm })

const form = reactive<TrackFormPayload>({ ...defaultForm });

watch(
    () => props.track,
    (track) => {
        if (track) {
            initialFormState.value = {
                title: track.title,
                artist: track.artist,
                album: track.album,
                genres: [...track.genres],
                coverImage: track.coverImage,
            }

            Object.assign(form, initialFormState.value);
        } else {
            initialFormState.value = { ...defaultForm }
            resetForm()
        }
    },
    { immediate: true }
)

const dialogTitle = computed(() => (props.track ? 'Edit Track' : 'New Track'));

function resetForm() {
    Object.assign(form, { ...initialFormState.value });
    nextTick(() => {
        formRef.value?.clearValidate()
    })
}

function onClose() {
    resetForm();
    emit('close');
}

function onDelete() {
    emit("delete", props.track!);
    resetForm();
}

function submitForm() {
    formRef.value?.validate((valid) => {
        if (valid) {
            const payload: TrackFormPayload = { ...form };
            emit('save', payload);
        }
    })
}

// Cover Image
const pattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i;

function isValidImageUrl(url: string): boolean {
    return pattern.test(url.trim())
}

const coverPreviewUrl = computed(() =>
    form.coverImage && pattern.test(form.coverImage.trim()) ? form.coverImage.trim() : null
)

// Validators
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
    coverImage: [
        { required: false, message: 'Enter cover image URL', trigger: 'blur' },
        {
            validator: (_rule, value, callback) => {
                if (value && !isValidImageUrl(value)) {
                    callback(new Error('Enter a valid image URL (.jpg, .png, .webp, .svg, .gif)'))
                } else {
                    callback()
                }
            },
            trigger: 'blur'
        }]
}
</script>
<template>
    <el-dialog v-model="visible" :title="dialogTitle" width="500px" :close-on-click-modal="true" @close="onClose"
        data-testid="track-form">
        <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
            <el-form-item label="Title" prop="title">
                <el-input v-model.trim="form.title" autocomplete="off" data-testid="input-title" />
                <template #error="{ error }">
                    <div v-if="error" data-testid="error-title" class="el-form-item__error">{{ error }}</div>
                </template>
            </el-form-item>

            <el-form-item label="Artist" prop="artist">
                <el-input v-model.trim="form.artist" autocomplete="off" data-testid="input-artist" />
                <template #error="{ error }">
                    <div v-if="error" data-testid="error-artist" class="el-form-item__error">{{ error }}</div>
                </template>
            </el-form-item>

            <el-form-item label="Album" prop="album">
                <el-input v-model.trim="form.album" autocomplete="off" data-testid="input-album" />
                <template #error="{ error }">
                    <div v-if="error" data-testid="error-album" class="el-form-item__error">{{ error }}</div>
                </template>
            </el-form-item>

            <el-form-item label="Genres" prop="genres">
                <Loader :visible="isLoading" />
                <el-select v-model="form.genres" multiple filterable allow-create default-first-option
                    placeholder="Select or type genres" style="width: 100%" data-testid="genre-selector">
                    <el-option v-for="genre in availableGenres" :key="genre" :label="genre" :value="genre"
                        :disabled="isLoading" />
                </el-select>
                <template #error="{ error }">
                    <div v-if="error" data-testid="error-genre" class="el-form-item__error">{{ error }}</div>
                </template>
            </el-form-item>

            <el-form-item label="Cover Image" prop="coverImage">
                <el-input v-model="form.coverImage" placeholder="https://example.com/cover.jpg"
                    data-testid="input-cover-image" />
                <template #error="{ error }">
                    <div v-if="error" data-testid="error-cover-image" class="el-form-item__error">{{ error }}</div>
                </template>
            </el-form-item>

            <div class="cover">
                <img v-if="coverPreviewUrl" :src="coverPreviewUrl" alt="Preview" @error="form.coverImage = ''" />
                <el-icon v-else :size="56">
                    <Picture />
                </el-icon>
            </div>

        </el-form>
        <template #footer>
            <el-button v-if="props.track?.id" type="danger" @click="onDelete">Delete</el-button>
            <el-button @click="onClose">Cancel</el-button>
            <el-button @click="resetForm">Reset</el-button>
            <el-button type="primary" @click="submitForm" data-testid="submit-button">Save</el-button>
        </template>
    </el-dialog>
</template>

<style scoped>
.el-tag {
    color: white;
    background-color: #409EFF;
}

.el-form {
    padding-right: 2rem;
}

svg {
    color: white;
}

.cover {
    display: inline-flex;
    flex-direction: row-reverse;
    width: 100%;
    height: 100%;
}

.cover img {
    width: 56px;
    height: 56px;
    border-radius: 4px;
    object-fit: cover;
}
</style>