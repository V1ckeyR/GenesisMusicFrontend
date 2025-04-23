import { ref } from 'vue'
import type { Track } from '@/types/Track'

const currentTrack = ref<Track | null>(null)
const audioElement = ref<HTMLAudioElement | null>(null)

export function useAudioPlayer() {
    function play(track: Track) {
        if (currentTrack.value?.id === track.id) {
            stop()
            return
        }

        stop()

        if (track.audioFile) {
            currentTrack.value = track
            console.log(track.audioFile)
            audioElement.value = new Audio(track.audioFile)
            audioElement.value.play()
        }
    }

    function stop() {
        if (audioElement.value) {
            audioElement.value.pause()
            audioElement.value.currentTime = 0
            audioElement.value = null
        }
        currentTrack.value = null
    }

    return {
        currentTrack,
        play,
        stop,
    }
}
