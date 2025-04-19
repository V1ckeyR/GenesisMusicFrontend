<script setup>
import { ref, computed, watch } from 'vue'

import TrackCard from '@/components/TrackCard.vue'


const tracks = ref([
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
])
const sortBy = ref(null);
const searchBy = ref(null);
const searchByRaw = ref(null)

let debounceTimer = null;

watch(searchByRaw, (value) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        searchBy.value = value;
    }, 200);
})

function onCreateClick() {
    console.log('Create button clicked');
    // TODO: open modal to add track
}

const sortedTracks = computed(() => {
    let result = [...tracks.value]

    // Step 1: Filter by search query
    if (searchBy.value) {
        const search = searchBy.value.trim().toLowerCase()
        result = result.filter((track) =>
            ['title', 'artist', 'album'].some((key) =>
                track[key]?.toLowerCase().includes(search)
            )
        )
    }

    // Step 2: Sort by selected field
    if (sortBy.value) {
        result.sort((a, b) => {
            const aVal = a[sortBy.value]?.toLowerCase() || ''
            const bVal = b[sortBy.value]?.toLowerCase() || ''
            return aVal.localeCompare(bVal)
        })
    }

    return result
})

</script>

<template>
    <el-container>
        <el-header>
            <div class="actions">
                <el-button circle type="primary" @click="onCreateClick" icon="Plus" />

                <el-select v-model="sortBy" placeholder="Sort by" clearable class="input-field">
                    <el-option label="Title" value="title" />
                    <el-option label="Artist" value="artist" />
                    <el-option label="Album" value="album" />
                </el-select>

                <el-input v-model="searchByRaw" placeholder="Search..." clearable prefix-icon="Search"
                    class="input-field" style="max-width: 100%;" />
            </div>
        </el-header>

        <el-main>
            <div class="tracks-page">
                <TrackCard v-for="track in sortedTracks" :key="track.id" :track="track" class="mb-2" />
            </div>
        </el-main>
    </el-container>
</template>

<style>
.actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1em;
}

.input-field {
    width: 240px;
    max-width: 240px;
    margin: 0 1em;
}

.tracks-page {
    margin: 0 1em;
}
</style>