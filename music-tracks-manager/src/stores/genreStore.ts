import { defineStore } from 'pinia'
import { fetchGenres } from '@/services/requests'
import { useToast } from '@/composables/useToast'
import { useConfirmDialog } from '@/composables/useConfirmDialog'

const confirm = useConfirmDialog()
const ElMessage = useToast()

export const useGenreStore = defineStore('genre', {
    state: () => ({
        genres: [] as string[],
        isLoading: false,
        isLoaded: false
    }),

    actions: {
        async loadGenres() {
            if (this.isLoaded) return

            this.isLoading = true
            try {
                this.genres = await fetchGenres()
                this.isLoaded = true
            } catch (err) {
                const ok = await confirm(
                    'Failed to load genres. Try again',
                    'Loading fail',
                    {
                        confirmButtonText: 'Try again',
                        cancelButtonText: 'Cancel'
                    }
                )
                if (ok) {
                    await this.loadGenres()
                } else {
                    ElMessage.info('Genres loading canceled')
                }
            } finally {
                this.isLoading = false
            }
        },

        forceReload() {
            this.isLoaded = false
            return this.loadGenres()
        }
    }
})
