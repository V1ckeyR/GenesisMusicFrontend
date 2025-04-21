import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import { fetchGenres } from '@/services/requests';

export function useGenres() {
    const isLoading = ref<Boolean>(false);
    const availableGenres = ref<string[]>([]);

    async function loadGenres() {
        isLoading.value = true;
        try {
            availableGenres.value = await fetchGenres();
        } catch (err) {
            try {
                await ElMessageBox.confirm(
                    'Failed to load genres. Try again',
                    'Loading fail',
                    {
                        confirmButtonText: 'Try again',
                        cancelButtonText: 'Cancel',
                        type: 'error'
                    }
                )
                await loadGenres();
            } catch (err) {
                ElMessage.info('Genres loading canceled')
            }
        } finally {
            isLoading.value = false;
        }
    }

    return {
        // States
        isLoading,
        availableGenres,

        // Functions
        loadGenres
    }
}