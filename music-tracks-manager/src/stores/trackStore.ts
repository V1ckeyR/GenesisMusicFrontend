// trackStore.ts
import { defineStore } from 'pinia'
import { ref, computed, } from 'vue'
import { fetchTracks, createTrack, updateTrack, deleteTrack, deleteTrackAudiofile, uploadTrackAudiofile } from '@/services/requests'
import type { Track, TrackFormPayload } from '@/types/Track'
import { useToast } from '@/composables/useToast'
import { useConfirmDialog } from '@/composables/useConfirmDialog'

const confirm = useConfirmDialog()
const ElMessage = useToast()

export const useTrackStore = defineStore('track', () => {
    const tracks = ref<Track[]>([])
    const total = ref(0)
    const page = ref(1)
    const limit = ref(10)
    const sortBy = ref<'title' | 'artist' | 'album' | 'createdAt' | null>(null)
    const sortOrder = ref<'asc' | 'desc'>('asc')
    const searchByRaw = ref('')
    const searchBy = ref('')
    const selectedArtist = ref<string | null>(null)
    const selectedGenre = ref<string | null>(null)
    const isLoading = ref(false)
    const isLoaded = ref(false)

    const uniqueArtists = computed(() => {
        return Array.from(new Set(tracks.value.map(t => t.artist))).filter(Boolean)
    })

    async function loadTracks() {
        if (isLoaded.value) return
        isLoading.value = true
        try {
            const response = await fetchTracks({
                page: page.value,
                limit: limit.value,
                sort: sortBy.value || undefined,
                order: sortOrder.value,
                search: searchBy.value || undefined,
                artist: selectedArtist.value || undefined,
                genre: selectedGenre.value || undefined
            })
            tracks.value = response.data
            total.value = response.meta.total
            isLoaded.value = true
        } finally {
            isLoading.value = false
        }
    }

    function forceReload() {
        isLoaded.value = false
        return loadTracks()
    }

    async function saveTrack(payload: TrackFormPayload, id?: string) {
        isLoading.value = true
        try {
            id ? await updateTrack(id, payload) : await createTrack(payload)
            await forceReload()
            ElMessage.success(`Track successfully ${id ? 'updated' : 'created'}`)
        } catch {
            ElMessage.error(`Failed to ${id ? 'update' : 'create'} track`)
        } finally {
            isLoading.value = false
        }
    }

    async function removeTrack(track: Track) {
        const ok = await confirm('Are you sure you want to delete this track?', 'Delete Track', {
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
        })

        if (!ok) return

        isLoading.value = true
        try {
            await deleteTrack(track.id)
            await forceReload()
            ElMessage.success('Track deleted')
        } catch {
            ElMessage.error('Failed to delete track')
        } finally {
            isLoading.value = false
        }
    }

    function resetFilters() {
        selectedArtist.value = null
        selectedGenre.value = null
        searchByRaw.value = ''
        sortBy.value = null
        sortOrder.value = 'asc'
        page.value = 1
        isLoaded.value = false
        loadTracks()
    }

    function toggleSortOrder() {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
        isLoaded.value = false
        loadTracks()
    }

    function updateSearch() {
        const trimmed = searchByRaw.value.trim().toLowerCase()
        if (searchBy.value !== trimmed) {
            searchBy.value = trimmed
            page.value = 1
            isLoaded.value = false
            loadTracks()
        }
    }

    async function confirmAndDeleteAudio(track: Track) {
        const ok = await confirm('Are you sure you want to delete this audio file?', 'Delete Audio', {
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
        })
        if (ok) {
            await deleteTrackAudiofile(track.id)
            ElMessage.success('Audio file deleted')
            forceReload()
        } else {
            ElMessage.info('Deletion canceled')
        }
    }

    async function uploadAudioFile(track: Track, file: File): Promise<string | null> {
        isLoading.value = true
        try {
            const updated = await uploadTrackAudiofile(track.id, file)
            ElMessage.success('Audio uploaded')
            forceReload()
            return updated.audioFile || null
        } catch {
            ElMessage.error('Upload failed')
            return null
        } finally {
            isLoading.value = false
        }
    }

    return {
        tracks,
        total,
        page,
        limit,
        sortBy,
        sortOrder,
        searchByRaw,
        searchBy,
        selectedArtist,
        selectedGenre,
        isLoading,
        isLoaded,
        uniqueArtists,
        loadTracks,
        forceReload,
        saveTrack,
        removeTrack,
        resetFilters,
        toggleSortOrder,
        updateSearch,
        confirmAndDeleteAudio,
        uploadAudioFile
    }
})