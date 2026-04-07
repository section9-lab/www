import { create } from 'zustand'
import { emitter } from '../lib/emitter'

interface Track {
  name: string
  artist: string
  album_art: string
  preview_url: string
  url: string
  colors: [string, string]
}

interface PlaylistState {
  index: number
  tracks: Track[] | null
  isFlipped: boolean
  isPlaying: boolean
  _autoTimer: ReturnType<typeof setTimeout> | null
  track: () => Track | null
  getTracks: () => void
  preloadTrackArt: (idx?: number) => void
  play: () => void
  next: () => void
  toggle: () => void
  dispose: () => void
}

export const usePlaylistStore = create<PlaylistState>((set, get) => ({
  index: 0,
  tracks: null,
  isFlipped: false,
  isPlaying: false,
  _autoTimer: null,

  track: () => {
    const { tracks, index } = get()
    return tracks?.[index] ?? null
  },

  getTracks: () => {
    set({
      tracks: [
        {
          name: 'Emagination (B - Side)',
          artist: 'Miami Horror',
          album_art: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/ee/5e/9b/ee5e9b85-e222-e5a0-15e5-880f5b165932/067003168366.png/168x168bb.jpg',
          preview_url: '',
          url: 'https://music.apple.com/us/album/emagination-b-side/1615142779?i=1615143055',
          colors: ['#d39da0', '#6b596a'],
        },
        {
          name: 'Shiny Tune',
          artist: 'Patrick Holland',
          album_art: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/d7/c5/60/d7c560ee-b05d-75e1-b4ae-039f8deb0f32/69499.jpg/168x168bb.jpg',
          preview_url: '',
          url: 'https://music.apple.com/us/album/shiny-tune/1693032577?i=1693032727',
          colors: ['#7273d6', '#1a203b'],
        },
        {
          name: 'Ocean City',
          artist: 'Pacific Coliseum',
          album_art: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/3b/ff/18/3bff180a-3204-9657-9bd8-fdcb79a4b9eb/5054526057630_cover.jpg/168x168bb.jpg',
          preview_url: '',
          url: 'https://music.apple.com/us/album/ocean-city/1819148323?i=1819148325',
          colors: ['#e27f93', '#4b215c'],
        },
      ],
    })
  },

  preloadTrackArt: (idx?: number) => {
    const state = get()
    const i = idx ?? state.index
    const t = state.tracks?.[i]
    if (!t) return
    const img = new Image()
    img.src = t.album_art
  },

  play: () => {
    const state = get()
    if (!state.tracks) return
    if (state._autoTimer) clearTimeout(state._autoTimer)
    set({ isPlaying: true })
    emitter.emit('toggle-live-activity', { state: true, type: 'isPlaying' })
    emitter.emit('toggle-quick-peek', { state: true, duration: 2000 })
    const timer = setTimeout(() => get().next(), 20000)
    set({ _autoTimer: timer })
  },

  next: () => {
    const state = get()
    if (!state.tracks) return
    const nextIndex = state.tracks.length > state.index + 1 ? state.index + 1 : 0
    set({ index: nextIndex, isFlipped: !state.isFlipped })
    emitter.emit('toggle-quick-peek', { state: true, duration: 2000 })
    get().play()
  },

  toggle: () => {
    const state = get()
    if (state._autoTimer) clearTimeout(state._autoTimer)
    if (state.isPlaying) {
      set({ isPlaying: false, _autoTimer: null })
    } else {
      set({ isPlaying: true })
      emitter.emit('toggle-quick-peek', { state: true, duration: 2000 })
      const timer = setTimeout(() => get().next(), 20000)
      set({ _autoTimer: timer })
    }
  },

  dispose: () => {
    const state = get()
    if (state._autoTimer) clearTimeout(state._autoTimer)
    set({ _autoTimer: null })
  },
}))
