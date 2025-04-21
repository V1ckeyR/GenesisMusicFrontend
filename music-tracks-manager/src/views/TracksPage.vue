<script setup lang="ts">
import { ref, onMounted } from 'vue'

import TrackCard from '@/components/TrackCard.vue'
import TrackModal from '@/components/TrackModal.vue'
import { ArrowUp } from '@element-plus/icons-vue'

import type { Track, TrackFormPayload } from '@/types/Track'
import { useTracks } from '@/composables/useTracks'

const {
    // States
    isLoading,

    tracks,

    total,
    page,
    limit,
    totalPages,

    sortBy,
    sortOrder,
    searchByRaw,
    searchBy,

    // Functions
    loadTracks,
    saveTrack
} = useTracks()

onMounted(() => loadTracks());

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
                        <TrackCard v-for="(track, index) in tracks" :key="track.id" :track="track" :number="index + 1"
                            class="mb-2" @edit="onEditTrack" @delete="onDeleteTrack" />
                    </div>

                    <TrackModal :track="selectedTrack" :visible="isModalVisible" @save="onSaveTrack"
                        @close="onCloseModal" />
                    <el-pagination v-model:current-page="page" v-model:page-size="limit" :page-sizes="[5, 10, 20, 50]"
                        layout="total, sizes, prev, pager, next, jumper" :total="total" background class="pagination"
                        :hide-on-single-page="true" />
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