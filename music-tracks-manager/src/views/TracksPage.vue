<script setup lang="ts">
import { ref, computed, watch } from 'vue'

import TrackCard from '@/components/TrackCard.vue'
import TrackModal from '@/components/TrackModal.vue'
import type { Track, TrackFormPayload } from '@/types/Track'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';

// Sort Types
type SortField = 'title' | 'artist' | 'album' | 'createdAt' | null;
type SortOrder = 'asc' | 'desc';

// States
const tracks = ref<Track[]>([
    {
        "id": "1741096482745",
        "title": "Bohemian Rhapsody",
        "artist": "Justin Bieber",
        "album": "SOS",
        "genres": [
            "Rock",
            "Country"
        ],
        "slug": "bohemian-rhapsody",
        "coverImage": "https://picsum.photos/seed/Bohemian%20Rhapsody/300/300",
        "audioFile": "test.mp3",
        "createdAt": "2025-03-04T13:54:42.745Z",
        "updatedAt": "2025-04-08T11:40:49.284Z"
    },
    {
        "id": "1741096482744",
        "title": "Imagine",
        "artist": "Post Malone",
        "album": "Harry's House",
        "genres": [
            "Rock",
            "Pop"
        ],
        "slug": "imagine",
        "coverImage": "https://picsum.photos/seed/Imagine/300/300",
        "createdAt": "2025-03-04T13:54:42.744Z",
        "updatedAt": "2025-03-04T13:54:42.744Z"
    },
    {
        "id": "1741096482743",
        "title": "What'd I Say",
        "artist": "Post Malone",
        "album": "Justice",
        "genres": [
            "Hip Hop"
        ],
        "slug": "whatd-i-say",
        "coverImage": "https://picsum.photos/seed/What'd%20I%20Say/300/300",
        "createdAt": "2025-03-04T13:54:42.743Z",
        "updatedAt": "2025-04-07T14:35:43.800Z"
    },
    {
        "id": "1741096482742",
        "title": "Johnny B. Goode",
        "artist": "Lady Gaga",
        "genres": [
            "Pop",
            "R&B",
            "Rock"
        ],
        "slug": "johnny-b-goode",
        "coverImage": "https://picsum.photos/seed/Johnny%20B.%20Goode/300/300",
        "createdAt": "2025-03-04T13:54:42.742Z",
        "updatedAt": "2025-03-04T13:54:42.742Z"
    },
    {
        "id": "1741096482741",
        "title": "Like a Rolling Stone",
        "artist": "Rihanna",
        "genres": [
            "Blues",
            "R&B",
            "Hip Hop"
        ],
        "slug": "like-a-rolling-stone",
        "coverImage": "https://picsum.photos/seed/Like%20a%20Rolling%20Stone/300/300",
        "createdAt": "2025-03-04T13:54:42.741Z",
        "updatedAt": "2025-03-04T13:54:42.741Z"
    },
    {
        "id": "1741096482740",
        "title": "Love Story",
        "artist": "Lady Gaga",
        "album": "30",
        "genres": [
            "Indie"
        ],
        "slug": "love-story",
        "coverImage": "https://picsum.photos/seed/Love%20Story/300/300",
        "createdAt": "2025-03-04T13:54:42.740Z",
        "updatedAt": "2025-03-04T13:54:42.740Z"
    },
    {
        "id": "1741096482739",
        "title": "Peaches",
        "artist": "Drake",
        "album": "DAMN.",
        "genres": [
            "Indie",
            "R&B",
            "Rock"
        ],
        "slug": "peaches",
        "coverImage": "https://picsum.photos/seed/Peaches/300/300",
        "createdAt": "2025-03-04T13:54:42.739Z",
        "updatedAt": "2025-03-04T13:54:42.739Z"
    },
    {
        "id": "1741096482738",
        "title": "Smells Like Teen Spirit",
        "artist": "Beyoncé",
        "genres": [
            "Indie"
        ],
        "slug": "smells-like-teen-spirit",
        "coverImage": "https://picsum.photos/seed/Smells%20Like%20Teen%20Spirit/300/300",
        "createdAt": "2025-03-04T13:54:42.738Z",
        "updatedAt": "2025-03-04T13:54:42.738Z"
    },
    {
        "id": "1741096482737",
        "title": "As It Was",
        "artist": "Harry Styles",
        "genres": [
            "Rock",
            "Blues"
        ],
        "slug": "as-it-was",
        "coverImage": "https://picsum.photos/seed/As%20It%20Was/300/300",
        "createdAt": "2025-03-04T13:54:42.737Z",
        "updatedAt": "2025-03-04T13:54:42.737Z"
    },
    {
        "id": "1741094505682",
        "title": "Pagination Test Track 4",
        "artist": "Pagination Artist",
        "genres": [
            "Electronic"
        ],
        "slug": "pagination-test-track-4",
        "createdAt": "2025-03-04T13:21:45.682Z",
        "updatedAt": "2025-03-04T13:21:45.682Z"
    }
])  // mock
const sortBy = ref<SortField>(null);
const sortOrder = ref<SortOrder>('asc');
const searchByRaw = ref('');
const searchBy = ref('');
const selectedTrack = ref<Track | null>(null);
const isModalVisible = ref(false);

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