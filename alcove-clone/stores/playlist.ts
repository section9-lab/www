import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePlaylistStore = defineStore('playlist', () => {
  const sound = ref<string | null>(null)
  const index = ref(0)
  const isFlipped = ref(false)

  function flip() {
    isFlipped.value = !isFlipped.value
  }

  return {
    sound,
    index,
    isFlipped,
    flip
  }
})
