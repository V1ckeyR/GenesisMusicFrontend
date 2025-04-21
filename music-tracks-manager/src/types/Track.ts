export interface Track {
  id: string
  title: string
  artist: string
  album?: string
  genres: string[]
  slug: string
  coverImage?: string
  audioFile?: string
  createdAt: string
  updatedAt: string
}


export type TrackFormPayload = Omit<Track, 'id' | 'audioFile' | 'createdAt' | 'updatedAt'>

export type TrackListResponse = {
  data: Track[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
