import { defineStore } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetchTracks, createTrack, updateTrack, deleteTrack, deleteTrackAudiofile, uploadTrackAudiofile } from '@/services/requests'
import type { Track, TrackFormPayload } from '@/types/Track'

export const useTrackStore = defineStore('track', {
    state: () => ({
        tracks: [] as Track[],
        total: 0,
        page: 1,
        limit: 10,
        sortBy: null as 'title' | 'artist' | 'album' | 'createdAt' | null,
        sortOrder: 'asc' as 'asc' | 'desc',
        searchByRaw: '',
        searchBy: '',
        selectedArtist: null as string | null,
        selectedGenre: null as string | null,
        isLoading: false,
        isLoaded: false
    }),

    getters: {
        uniqueArtists(state): string[] {
            return Array.from(new Set(state.tracks.map(t => t.artist))).filter(Boolean)
        }
    },

    actions: {
        async loadTracks() {
            if (this.isLoaded) return

            this.isLoading = true
            try {
                const response = await fetchTracks({
                    page: this.page,
                    limit: this.limit,
                    sort: this.sortBy ?? undefined,
                    order: this.sortOrder,
                    search: this.searchBy || undefined,
                    artist: this.selectedArtist || undefined,
                    genre: this.selectedGenre || undefined
                })
                this.tracks = [ ...response.data ]
                this.total = response.meta.total
                this.isLoaded = true
            } finally {
                this.isLoading = false
            }
        },

        forceReload() {
            this.isLoaded = false
            return this.loadTracks()
        },

        async saveTrack(payload: TrackFormPayload, id?: string) {
            this.isLoading = true
            try {
                if (id) {
                    await updateTrack(id, payload)
                } else {
                    await createTrack(payload)
                }
                await this.forceReload()
                ElMessage.success(`Track successfully ${id ? 'updated' : 'created'}`)
            } catch (err) {
                ElMessage.error(`Failed to ${id ? 'update' : 'create'} track`)
            } finally {
                this.isLoading = false
            }
        },

        async removeTrack(track: Track) {
            this.isLoading = true
            try {
                await deleteTrack(track.id)
                await this.forceReload()
                ElMessage.success('Track deleted')
            } catch (err) {
                ElMessage.error('Failed to delete track')
            } finally {
                this.isLoading = false
            }
        },

        resetFilters() {
            this.selectedArtist = null
            this.selectedGenre = null
            this.searchByRaw = ''
            this.sortBy = null
            this.sortOrder = 'asc'
            this.page = 1
            this.isLoaded = false
            this.loadTracks()
        },

        toggleSortOrder() {
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
            this.isLoaded = false
            this.loadTracks()
        },

        updateSearch() {
            const trimmed = this.searchByRaw.trim().toLowerCase()
            if (this.searchBy !== trimmed) {
                this.searchBy = trimmed
                this.page = 1
                this.isLoaded = false
                this.loadTracks()
            }
        },

        async confirmAndDeleteAudio(track: Track) {
            try {
                await ElMessageBox.confirm(
                    'Are you sure you want to delete this audio file?',
                    'Delete Audio',
                    {
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'Cancel',
                        type: 'warning',
                    }
                )

                await deleteTrackAudiofile(track.id)
                ElMessage.success('Audio file deleted')
                this.forceReload()
            } catch {
                ElMessage.info('Deletion canceled')
            }
        },

        async uploadAudioFile(track: Track, file: File): Promise<string | null> {
            this.isLoading = true
            try {
                const updated = await uploadTrackAudiofile(track.id, file)
                ElMessage.success('Audio uploaded')
                this.forceReload()
                return updated.audioFile || null
            } catch {
                ElMessage.error('Upload failed')
                return null
            } finally {
                this.isLoading = false
            }
        }

    }
})