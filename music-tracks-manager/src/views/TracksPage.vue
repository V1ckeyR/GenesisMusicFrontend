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

            <el-aside width="200px" class="section">
                <el-button type="primary" plain @click="onCreateClick" icon="Plus"
                    data-testid="create-track-button">Create Track</el-button>

                <el-divider />

                <span>Sort By <el-icon size="small">
                        <Sort />
                    </el-icon>
                </span>

                <div class="sort-input">
                    <el-select v-model="sortBy" placeholder="Sort by" clearable data-testid="sort-select">
                        <el-option label="Title" value="title" />
                        <el-option label="Artist" value="artist" />
                        <el-option label="Album" value="album" />
                        <el-option label="Created At" value="createdAt" />
                    </el-select>
                    <el-button @click="toggleSortOrder" circle class="sort-order-button"
                        :title="sortOrder === 'asc' ? 'Ascending' : 'Descending'">
                        <el-icon :class="{ rotated: sortOrder === 'desc' }" size="small">
                            <SortUp />
                        </el-icon>
                    </el-button>
                </div>

                <el-divider />

                <span>Filters <el-icon size="small">
                        <Filter />
                    </el-icon>
                </span>

                <el-button v-if="selectedArtist || selectedGenre" type="default" plain icon="Close" style="width: 100%"
                    @click="resetFilters">
                    Reset Filters
                </el-button>

                <el-select v-model="selectedArtist" clearable placeholder="Choose artist" style="width: 100%"
                    data-testid="filter-artist">
                    <el-option v-for="artist in uniqueArtists" :key="artist" :label="artist" :value="artist" />
                </el-select>

                <el-select v-model="selectedGenre" v-loading="isLoadingGenres" clearable placeholder="Choose genre" style="width: 100%"
                    data-testid="filter-genre">
                    <el-option v-for="genre in availableGenres" :key="genre" :label="genre" :value="genre" />
                </el-select>
            </el-aside>

            <el-main class="section">
                <el-input v-model="searchByRaw" placeholder="Search..." clearable prefix-icon="Search"
                    class="search-input" data-testid="search-input" />

                <div class="tracks-page">
                    <CardSkeleton v-if="isLoading" data-testid="loading-tracks" v-for="n in limit"
                        :key="'skeleton-' + n" :number="n" />

                    <Card v-else v-for="(track, index) in tracks" :key="track.id" :track="track"
                        :number="(page - 1) * limit + index + 1" @edit="onEditTrack" @delete="onDeleteTrack"
                        @upload-audio="onUploadAudio" @delete-audio="confirmAndDeleteAudio"
                        :data-testid="`track-item-${track.id}`" />
                </div>

                <el-affix position="bottom" :offset="60">
                    <el-pagination v-model:current-page="page" v-model:page-size="limit" :page-sizes="[5, 10, 15, 20]"
                        layout="total, sizes, prev, pager, next, jumper" :total="total" background class="pagination"
                        :hide-on-single-page="true" data-testid="pagination" />
                </el-affix>
            </el-main>
        </el-container>
    </div>
</template>


<style scoped>
.pagination {
    background-color: #0000009d;
    padding: 10px;
    width: 100%;
    border-radius: 20px;
}

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