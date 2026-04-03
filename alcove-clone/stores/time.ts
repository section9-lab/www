import { defineStore } from 'pinia'
import { ref, onMounted, onUnmounted } from 'vue'

export const useTimeStore = defineStore('time', () => {
  const now = ref(new Date())
  let interval: ReturnType<typeof setInterval> | null = null

  function start() {
    if (interval) return
    interval = setInterval(() => {
      now.value = new Date()
    }, 1000)
  }

  function stop() {
    if (interval) {
      clearInterval(interval)
      interval = null
    }
  }

  const timeString = computed(() => {
    return now.value.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).replace(' ', '').toLowerCase()
  })

  const dateString = computed(() => {
    return now.value.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    })
  })

  const hours = computed(() => now.value.getHours() % 12 || 12)
  const minutes = computed(() => String(now.value.getMinutes()).padStart(2, '0'))
  const ampm = computed(() => now.value.getHours() >= 12 ? 'pm' : 'am')

  return {
    now,
    timeString,
    dateString,
    hours,
    minutes,
    ampm,
    start,
    stop
  }
})
