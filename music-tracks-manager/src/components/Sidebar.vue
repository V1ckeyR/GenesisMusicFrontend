<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useTrackStore } from '@/stores/trackStore'
import { useGenreStore } from '@/stores/genreStore'
import { Filter, SortUp } from '@element-plus/icons-vue'

const trackStore = useTrackStore()
const genreStore = useGenreStore()

const {
    sortBy, sortOrder,
    selectedArtist, selectedGenre,
    uniqueArtists,
    isLoading
} = storeToRefs(trackStore)

const { resetFilters, toggleSortOrder } = trackStore

const availableGenres = computed(() => genreStore.genres)
const isLoadingGenres = computed(() => genreStore.isLoading)

const emit = defineEmits(['create'])
</script>

<template>
    <el-aside width="200px">
        <el-button type="primary" plain @click="$emit('create')" icon="Plus" data-testid="create-track-button">Create Track</el-button>

        <el-divider />

        <span>Sort By <el-icon size="small">
                <Sort />
            </el-icon>
        </span>

        <div class="sort-input">
            <el-select v-model="sortBy" placeholder="Sort by" clearable data-testid="sort-select" :disabled="isLoading"
                :aria-disabled="isLoading">
                <el-option label="Title" value="title" />
                <el-option label="Artist" value="artist" />
                <el-option label="Album" value="album" />
                <el-option label="Created At" value="createdAt" />
            </el-select>
            <el-button @click="toggleSortOrder" circle class="sort-order-button"
                :title="sortOrder === 'asc' ? 'Ascending' : 'Descending'" :disabled="isLoading"
                :aria-disabled="isLoading">
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
            data-testid="filter-artist" :disabled="isLoading" :aria-disabled="isLoading">
            <el-option v-for="artist in uniqueArtists" :key="artist" :label="artist" :value="artist" />
        </el-select>

        <el-select v-model="selectedGenre" v-loading="isLoadingGenres" clearable placeholder="Choose genre"
            style="width: 100%" data-testid="filter-genre" :disabled="isLoadingGenres" :aria-disabled="isLoadingGenres">
            <el-option v-for="genre in availableGenres" :key="genre" :label="genre" :value="genre" />
        </el-select>
    </el-aside>
</template>