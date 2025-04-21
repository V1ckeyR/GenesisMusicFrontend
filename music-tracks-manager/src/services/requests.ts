import axios, { AxiosError } from 'axios'

import type { Track, TrackFormPayload, TrackListResponse } from '@/types/Track'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
})

async function request<T>(cb: () => Promise<{ data: T }>): Promise<T> {
    try {
        const { data } = await cb();
        return data
    } catch (error) {
        const err = error as AxiosError;
        console.error('API error:', err.response?.data || err.message);
        throw err
    }
}

export async function fetchGenres() {
    // Get all genres
    return request(() => api.get<string[]>('/genres'))
}

export async function fetchTracks(params: {
    page: number
    limit: number
    sort?: string
    order?: string
    search?: string
    genre?: string
    artist?: string
}) {
    // Get all tracks with pagination, sorting, and filtering
    return request(() => api.get<TrackListResponse>('/tracks', { params }))
}

export async function fetchTrackBySlug(slug: string) {
    // Get a track by slug
    return request(() => api.get(`/tracks/${slug}`))
}

export async function createTrack(payload: TrackFormPayload) {
    // Create a new track
    return request(() => api.post<Track>('/tracks', payload))
}

export async function updateTrack(id: string, payload: TrackFormPayload) {
    // Update a track
    return request(() => api.put<Track>(`/tracks/${id}`, payload))
}

export async function deleteTrack(id: string) {
    // Delete a track
    return request(() => api.delete(`/tracks/${id}`))
}

export async function deleteTrackBulk(ids: string[]) {
    // Delete multiple tracks
    return request(() => api.post('/tracks/delete', { ids }))
}

export async function uploadTrackAudiofile(id: string, file: File) {
    // Upload an audio file for a track
    const formData = new FormData();
    formData.append('file', file);

    return request(() =>
        api.post(`/tracks/${id}/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    )
}

export async function deleteTrackAudiofile(id: string) {
    // Delete an audio file from a track
    return request(() => api.delete(`/tracks/${id}/file`));
}