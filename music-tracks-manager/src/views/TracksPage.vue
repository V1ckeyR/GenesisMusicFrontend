<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import axios from 'axios'

import TrackCard from '@/components/TrackCard.vue'
import TrackModal from '@/components/TrackModal.vue'
import { ArrowUp } from '@element-plus/icons-vue'

import type { Track, TrackFormPayload } from '@/types/Track'
import { fetchTracks } from '@/services/requests'

// Sort Types
type SortField = 'title' | 'artist' | 'album' | 'createdAt' | null;
type SortOrder = 'asc' | 'desc';

// States
const loading = ref(false)
const tracks = ref<Track[]>([]);
const sortBy = ref<SortField>(null);
const sortOrder = ref<SortOrder>('asc');
const searchByRaw = ref('');
const searchBy = ref('');
const selectedTrack = ref<Track | null>(null);
const isModalVisible = ref(false);


// Initial requests
onMounted(async () => {
    loading.value = true
    // TODO: loading skelet
    try {
        const response = await fetchTracks({"page": 1, "limit": 10})
        tracks.value = response.data
    } catch (error) {
        console.error('Failed to load tracks:', error)
        // TODO: show error
    } finally {
        loading.value = false
    }
})

// Debounce
let debounceTimer: number | null = null;

watch(searchByRaw, (value) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(() => {
        searchBy.value = value.trim().toLowerCase();
    }, 200);
})

// Functions
function onCreateClick() {
    selectedTrack.value = null;
    isModalVisible.value = true;
}

function onEditTrack(track: Track) {
    selectedTrack.value = track;
    isModalVisible.value = true;
}

function onDeleteTrack(track: Track) {
    console.log('Going to delete track', track.title);
}

function onSaveTrack(data: TrackFormPayload) {
    if (selectedTrack.value) {
        const idx = tracks.value.findIndex(t => t.id === selectedTrack.value!.id);
        if (idx !== -1) {
            // If id is present - set new data. PUT /api/tracks/{id}
            tracks.value[idx] = { ...tracks.value[idx], ...data };  // mock

            isModalVisible.value = false;
            return;
        }
    }

    // else POST /api/tracks, /api/tracks/{id}/upload
    const newTrack: Track = {
        ...data,
        id: Date.now().toString(),
        audioFile: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }

    tracks.value.push(newTrack);  // mock

    isModalVisible.value = false;
}

function onCloseModal() {
    isModalVisible.value = false;
}

function toggleSortOrder() {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}

// Computed
const sortedTracks = computed(() => {
    let result = [...tracks.value]

    // Step 1: Filter by search query
    if (searchBy.value) {
        result = result.filter((track) => {
            const byTitle = track.title.toLowerCase().includes(searchBy.value);
            const byArtist = track.artist.toLowerCase().includes(searchBy.value);
            const byAlbum = track.album?.toLowerCase().includes(searchBy.value);
            return byTitle || byArtist || byAlbum
        })
    }

    // Step 2: Sort by selected field
    if (sortBy.value) {
        result.sort((a, b) => {
            const aVal = a[sortBy.value!];
            const bVal = b[sortBy.value!];

            const compare = String(aVal).localeCompare(String(bVal));
            return sortOrder.value === 'asc' ? compare : -compare;
        })
    }

    return result
})

</script>

<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <div class="actions">
                    <el-button type="primary" plain @click="onCreateClick" icon="Plus">Create Track</el-button>

                    <div class="sort-input">
                        <el-select v-model="sortBy" placeholder="Sort by" clearable class="input-field">
                            <el-option label="Title" value="title" />
                            <el-option label="Artist" value="artist" />
                            <el-option label="Album" value="album" />
                            <el-option label="Created At" value="createdAt" />
                        </el-select>
                        <el-button @click="toggleSortOrder" circle class="sort-order-button"
                            :title="sortOrder === 'asc' ? 'Ascending' : 'Descending'">
                            <el-icon :class="{ rotated: sortOrder === 'desc' }">
                                <ArrowUp />
                            </el-icon>
                        </el-button>

                    </div>

                    <el-input v-model="searchByRaw" placeholder="Search..." clearable prefix-icon="Search"
                        class="input-field search-input" />
                </div>
            </el-header>

            <el-container>
                <el-aside width="200px">Filters will be here</el-aside>
                <el-main>
                    <div class="tracks-page">
                        <TrackCard v-for="(track, index) in sortedTracks" :key="track.id" :track="track"
                            :number="index + 1" class="mb-2" @edit="onEditTrack" @delete="onDeleteTrack" />
                    </div>

                    <TrackModal :track="selectedTrack" :visible="isModalVisible" @save="onSaveTrack"
                        @close="onCloseModal" />
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>


<style>
.actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    gap: 1rem;
}

.el-header {
    height: auto !important;
    min-width: 80vw;
    margin: 1rem 0;
}

.input-field {
    width: 140px !important;
    max-width: 240px;
    flex: 0 0 auto;
    /* margin: 0 1em; */
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

.search-input {
    /* align-self: stretch; */
    flex-grow: 1;
    /* max-width: none; */
}

.tracks-page {
    display: block;
    margin: 0 1em;
}
</style>