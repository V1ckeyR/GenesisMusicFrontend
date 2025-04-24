import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getTrackAudioUrl } from '@/services/requests'

let audio = new Audio()

export const useAudioStore = defineStore('audio', () => {
    const currentFile = ref<string | null>(null)
    const isPlaying = ref(false)
    const currentTime = ref(0)
    const duration = ref(0)
    const volume = ref(1)

    function progressFor(file: string) {
        if (file !== currentFile.value || !duration.value) return 0
        return (currentTime.value / duration.value) * 100
    }


    function setVolume(val: number) {
        volume.value = val
        audio.volume = val
    }

    function play(file: string) {
        if (currentFile.value !== file) {
            audio.src = getTrackAudioUrl(file)
            currentFile.value = file
        }

        audio.play()
        isPlaying.value = true

        audio.ontimeupdate = () => {
            currentTime.value = audio.currentTime
            duration.value = audio.duration || 0
        }

        audio.onended = () => {
            isPlaying.value = false
            currentTime.value = 0
        }
    }

    function pause() {
        audio.pause()
        isPlaying.value = false
    }

    function seek(ratio: number) {
        if (audio.duration) {
            audio.currentTime = audio.duration * ratio
            currentTime.value = audio.currentTime
        }
    }

    return {
        currentFile,
        isPlaying,
        currentTime,
        duration,
        volume,
        progressFor,
        setVolume,
        play,
        pause,
        seek
    }
})
