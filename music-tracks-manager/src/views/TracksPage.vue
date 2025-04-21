<script setup lang="ts">
import { ref, onMounted } from 'vue'

import TrackCard from '@/components/TrackCard.vue'
import TrackModal from '@/components/TrackModal.vue'
import TrackCardSkeleton from '@/components/TrackCardSkeleton.vue'
import { ArrowUp, Filter, SortUp } from '@element-plus/icons-vue'

import type { Track, TrackFormPayload } from '@/types/Track'
import { useTracks } from '@/composables/useTracks'
import { useGenres } from '@/composables/useGenres'

const {
    // States
    isLoading,

    tracks,

    total,
    page,
    limit,

    sortBy,
    sortOrder,
    searchByRaw,
    selectedArtist,
    selectedGenre,

    uniqueArtists,

    // Functions
    loadTracks,
    saveTrack,
    resetFilters
} = useTracks()

const {
    availableGenres,
    loadGenres
} = useGenres()

onMounted(() => {
    loadTracks();
    loadGenres();
});

// States
const selectedTrack = ref<Track | null>(null);
const isModalVisible = ref(false);


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
    saveTrack(data, selectedTrack.value!.id);
    isModalVisible.value = false;
}

function onCloseModal() {
    isModalVisible.value = false;
}

function toggleSortOrder() {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}

</script>

<template>
    <div class="common-layout">
        <el-container>
            <el-aside width="200px" class="section">
                <el-button type="primary" plain @click="onCreateClick" icon="Plus">Create Track</el-button>

                <el-divider />

                <span>Sort By <el-icon size="small">
                        <Sort />
                    </el-icon>
                </span>

                <div class="sort-input">
                    <el-select v-model="sortBy" placeholder="Sort by" clearable>
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

                <el-select v-model="selectedArtist" clearable placeholder="Choose artist" style="width: 100%">
                    <el-option v-for="artist in uniqueArtists" :key="artist" :label="artist" :value="artist" />
                </el-select>

                <el-select v-model="selectedGenre" clearable placeholder="Choose genre" style="width: 100%">
                    <el-option v-for="genre in availableGenres" :key="genre" :label="genre" :value="genre" />
                </el-select>
            </el-aside>

            <el-main class="section">
                <el-input v-model="searchByRaw" placeholder="Search..." clearable prefix-icon="Search"
                    class="search-input" />

                <div class="tracks-page">
                    <TrackCardSkeleton v-if="isLoading" v-for="n in limit" :key="'skeleton-' + n" :number="n" />

                    <TrackCard v-else v-for="(track, index) in tracks" :key="track.id" :track="track" :number="index + 1"
                        class="mb-2" @edit="onEditTrack" @delete="onDeleteTrack" />
                </div>

                <TrackModal :track="selectedTrack" :visible="isModalVisible" @save="onSaveTrack"
                    @close="onCloseModal" />
                <el-pagination v-model:current-page="page" v-model:page-size="limit" :page-sizes="[5, 10]"
                    layout="total, sizes, prev, pager, next, jumper" :total="total" background class="pagination"
                    :hide-on-single-page="true" />
            </el-main>
        </el-container>
    </div>
</template>


<style>
.section {
    background-color: #0000006b;
    border-radius: 20px;
    padding: 20px;
    margin: 1rem 0.5rem;
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