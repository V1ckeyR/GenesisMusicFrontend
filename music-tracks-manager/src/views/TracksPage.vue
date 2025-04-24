<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import { Filter, SortUp } from '@element-plus/icons-vue'

import type { Track, TrackFormPayload } from '@/types/Track'
import { useGenreStore } from '@/stores/genreStore'
import { useTrackStore } from '@/stores/trackStore'
import Form from '@/components/Form.vue'
import Card from '@/components/Card.vue'
import CardSkeleton from '@/components/CardSkeleton.vue'
import AudioUpload from '@/components/AudioUpload.vue'
import Pagination from '@/components/Pagination.vue'
import Sidebar from '@/components/Sidebar.vue'

const genreStore = useGenreStore();
const trackStore = useTrackStore();

// States
const {
    tracks, total, page, limit,
    sortBy, sortOrder,
    searchByRaw, selectedArtist, selectedGenre,
    uniqueArtists, isLoading
} = storeToRefs(trackStore)

const { loadTracks, saveTrack, removeTrack, resetFilters, toggleSortOrder, forceReload, confirmAndDeleteAudio } = trackStore

watch(
    [page, limit, sortBy, sortOrder, searchByRaw, selectedArtist, selectedGenre],
    () => {
        forceReload()
    },
    { immediate: true }
)

const availableGenres = computed(() => genreStore.genres)
const isLoadingGenres = computed(() => genreStore.isLoading)

const selectedTrack = ref<Track | null>(null);
const isTrackFormVisible = ref(false);
const isUploadDialogVisible = ref(false)

onMounted(() => {
    genreStore.loadGenres();
    loadTracks();
})

// Functions
function onCreateClick() {
    selectedTrack.value = null;
    isTrackFormVisible.value = true;
}

function onEditTrack(track: Track) {
    selectedTrack.value = track;
    isTrackFormVisible.value = true;
}

function onDeleteTrack(track: Track) {
    removeTrack(track);
    onCloseModal();
}

function onSaveTrack(data: TrackFormPayload) {
    saveTrack(data, selectedTrack.value?.id);
    onCloseModal();
}

function onCloseModal() {
    isTrackFormVisible.value = false;
    selectedTrack.value = null;
}

function onUploadAudio(track: Track) {
    isUploadDialogVisible.value = true;
    selectedTrack.value = track;
}

function onCloseUploadDialog() {
    isUploadDialogVisible.value = false;
    selectedTrack.value = null;
}

</script>

<template>
    <div class="common-layout">
        <h2 class="section" data-testid="tracks-header">Genesis Music Manager</h2>
        <el-container>
            <Form :track="selectedTrack" :visible="isTrackFormVisible" @save="onSaveTrack" @close="onCloseModal"
                @delete="onDeleteTrack" />

            <AudioUpload :visible="isUploadDialogVisible" :track="selectedTrack" @close="onCloseUploadDialog" />

            <Sidebar class="section" @create="onCreateClick"/>

            <el-main class="section">
                <el-input v-model="searchByRaw" placeholder="Search..." clearable prefix-icon="Search"
                    class="search-input" data-testid="search-input" :disabled="isLoading" :aria-disabled="isLoading" />

                <div class="tracks-page" :data-loading="isLoading" data-testid="loading-tracks">
                    <CardSkeleton v-if="isLoading" v-for="n in limit" :key="'skeleton-' + n" :number="n" />

                    <Card v-else v-for="(track, index) in tracks" :key="track.id" :track="track"
                        :number="(page - 1) * limit + index + 1" @edit="onEditTrack" @delete="onDeleteTrack"
                        @upload-audio="onUploadAudio" @delete-audio="confirmAndDeleteAudio"
                        :data-testid="`track-item-${track.id}`" />
                </div>

                <Pagination />
            </el-main>
        </el-container>
    </div>
</template>


<style>
.section {
    background-color: #0000006b;
    border-radius: 20px;
    padding: 20px;
    margin: 0.5rem;
}

.tracks-page {
    padding: 0.5rem 0;
}

.sort-input {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.sort-order-button .el-icon {
    transition: transform 0.3s ease;
}

.sort-order-button .rotated {
    transform: rotate(180deg);
}

.el-aside {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    text-align: left;
}
</style>