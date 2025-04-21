import { ref, watch, computed, onMounted } from 'vue'
import { fetchTracks, createTrack, updateTrack } from '@/services/requests'
import type { Track, TrackFormPayload } from '@/types/Track'
import type { SortField, SortOrder } from '@/types/Sort'
import { ElMessage } from 'element-plus'

export function useTracks() {
    const isLoading = ref(false)

    const tracks = ref<Track[]>([])

    const total = ref(0);  // Total number of tracks
    const page = ref(1);  // Number of page
    const limit = ref(10);  // Limit of tracks per page
    const totalPages = ref(0);  // Total amount of pages

    const sortBy = ref<SortField>(null);
    const sortOrder = ref<SortOrder>('asc');
    const searchByRaw = ref('');
    const searchBy = ref('');

    // Load on page/limit change
    async function loadTracks() {
        isLoading.value = true
        // TODO: loading skelet
        try {
            const response = await fetchTracks({
                page: page.value,
                limit: limit.value,
                sort: sortBy.value || undefined,
                order: sortOrder.value || undefined,
                search: searchBy.value || undefined
            })
            tracks.value = response.data;
            total.value = response.meta.total;
            totalPages.value = response.meta.totalPages;
        } catch (error) {
            ElMessage.error('Failed to load tracks')
        } finally {
            isLoading.value = false
        }
    }

    watch([page, limit], loadTracks, { immediate: true });


    // Reset page if sort/search changes
    watch([sortBy, sortOrder, searchBy], () => {
        page.value = 1;
        loadTracks();
    })

    // Debounce
    let debounceTimer: number | null = null;

    watch(searchByRaw, (value) => {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = window.setTimeout(() => {
            searchBy.value = value.trim().toLowerCase();
        }, 200);
    })

    // CRUD
    async function saveTrack(payload: TrackFormPayload, id?: string) {
        isLoading.value = true
        const action = id ? 'updated' : 'added'
        try {
            const response = id ? await updateTrack(id, payload) : await createTrack(payload)
            ElMessage.success(`Track "${response.title}" was ${action}`)
            await loadTracks()
        } catch (err) {
            ElMessage.error(`Failed to ${action} track`)
        } finally {
            isLoading.value = false
        }
    }


    return {
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
    }
}
