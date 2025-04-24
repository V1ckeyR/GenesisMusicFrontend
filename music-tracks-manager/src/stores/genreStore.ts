import { defineStore } from 'pinia'
import { fetchGenres } from '@/services/requests'
import { useToast } from '@/composables/useToast'
import { ElMessageBox } from 'element-plus'

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
                try {
                    await ElMessageBox.confirm(
                        'Failed to load genres. Try again',
                        'Loading fail',
                        {
                            confirmButtonText: 'Try again',
                            cancelButtonText: 'Cancel',
                            type: 'error',
                        }
                    )
                    await this.loadGenres()
                } catch {
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
