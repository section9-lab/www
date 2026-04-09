import { create } from 'zustand'

export interface Track {
  name: string
  artist: string
  album_art: string
  preview_url: string
  url: string
  colors: [string, string]
}

export type LiveActivityType = 'isLocked' | 'isPlaying' | null
export type NotificationType = 'didConnectAirPods' | null

const TRACKS: Track[] = [
  {
    name: 'Emagination (B - Side)',
    artist: 'Miami Horror',
    album_art:
      'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/ee/5e/9b/ee5e9b85-e222-e5a0-15e5-880f5b165932/067003168366.png/168x168bb.jpg',
    preview_url: '',
    url: 'https://music.apple.com/us/album/emagination-b-side/1615142779?i=1615143055',
    colors: ['#d39da0', '#6b596a'],
  },
  {
    name: 'Shiny Tune',
    artist: 'Patrick Holland',
    album_art:
      'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/d7/c5/60/d7c560ee-b05d-75e1-b4ae-039f8deb0f32/69499.jpg/168x168bb.jpg',
    preview_url: '',
    url: 'https://music.apple.com/us/album/shiny-tune/1693032577?i=1693032727',
    colors: ['#7273d6', '#1a203b'],
  },
  {
    name: 'Ocean City',
    artist: 'Pacific Coliseum',
    album_art:
      'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/3b/ff/18/3bff180a-3204-9657-9bd8-fdcb79a4b9eb/5054526057630_cover.jpg/168x168bb.jpg',
    preview_url: '',
    url: 'https://music.apple.com/us/album/ocean-city/1819148323?i=1819148325',
    colors: ['#e27f93', '#4b215c'],
  },
]

interface IslandState {
  index: number
  tracks: Track[]
  isFlipped: boolean
  isPlaying: boolean
  hasQuickPeek: boolean
  isUnlocked: boolean
  liveActivityType: LiveActivityType
  notificationType: NotificationType
  autoTimer: ReturnType<typeof setTimeout> | null
  quickPeekTimer: ReturnType<typeof setTimeout> | null
  liveActivityTimer: ReturnType<typeof setTimeout> | null
  notificationTimer: ReturnType<typeof setTimeout> | null
  initialize: () => void
  getTrack: () => Track | null
  preloadTrackArt: (idx?: number) => void
  toggleQuickPeek: (state: boolean, duration?: number) => void
  toggleNotification: (
    state: boolean,
    type: Exclude<NotificationType, null>,
    duration?: number
  ) => void
  toggleLiveActivity: (state: boolean, type: Exclude<LiveActivityType, null>) => void
  play: () => void
  next: () => void
  toggle: () => void
  dispose: () => void
}

function clearTimer(timer: ReturnType<typeof setTimeout> | null) {
  if (timer) clearTimeout(timer)
  return null
}

export const useIslandStore = create<IslandState>((set, get) => ({
  index: 0,
  tracks: TRACKS,
  isFlipped: false,
  isPlaying: false,
  hasQuickPeek: false,
  isUnlocked: false,
  liveActivityType: 'isLocked',
  notificationType: null,
  autoTimer: null,
  quickPeekTimer: null,
  liveActivityTimer: null,
  notificationTimer: null,

  initialize: () => {
    const state = get()
    clearTimer(state.autoTimer)
    clearTimer(state.quickPeekTimer)
    clearTimer(state.liveActivityTimer)
    clearTimer(state.notificationTimer)
    set({
      index: 0,
      isFlipped: false,
      isPlaying: false,
      hasQuickPeek: false,
      isUnlocked: false,
      liveActivityType: 'isLocked',
      notificationType: null,
      autoTimer: null,
      quickPeekTimer: null,
      liveActivityTimer: null,
      notificationTimer: null,
    })
  },

  getTrack: () => {
    const { tracks, index } = get()
    return tracks[index] ?? null
  },

  preloadTrackArt: (idx) => {
    const { tracks, index } = get()
    const track = tracks[idx ?? index]
    if (!track) return
    const img = new Image()
    img.src = track.album_art
  },

  toggleQuickPeek: (state, duration = 0) => {
    const current = get()
    clearTimer(current.quickPeekTimer)
    set({ hasQuickPeek: state, quickPeekTimer: null })

    if (state && duration > 0) {
      const timer = setTimeout(() => {
        get().toggleQuickPeek(false)
      }, duration)
      set({ quickPeekTimer: timer })
    }
  },

  toggleNotification: (state, type, duration = 0) => {
    const current = get()
    clearTimer(current.notificationTimer)
    set({
      notificationType: state ? type : null,
      notificationTimer: null,
    })

    if (state && duration > 0) {
      const timer = setTimeout(() => {
        set({ notificationType: null, notificationTimer: null })
      }, duration)
      set({ notificationTimer: timer })
    }
  },

  toggleLiveActivity: (state, type) => {
    const current = get()
    clearTimer(current.liveActivityTimer)
    set({ liveActivityTimer: null })

    if (state) {
      set({ liveActivityType: type })
      return
    }

    let delay = 0
    if (type === 'isLocked') {
      set({ isUnlocked: true })
      delay = 475
    }

    const timer = setTimeout(() => {
      set({ liveActivityType: null, liveActivityTimer: null })
    }, delay)
    set({ liveActivityTimer: timer })
  },

  play: () => {
    const state = get()
    clearTimer(state.autoTimer)
    set({ isPlaying: true, autoTimer: null })
    get().toggleLiveActivity(true, 'isPlaying')
    get().toggleQuickPeek(true, 2000)

    const timer = setTimeout(() => {
      get().next()
    }, 20000)
    set({ autoTimer: timer })
  },

  next: () => {
    const state = get()
    const nextIndex = state.index + 1 < state.tracks.length ? state.index + 1 : 0
    set({ index: nextIndex, isFlipped: !state.isFlipped })
    get().toggleQuickPeek(true, 2000)
    get().play()
  },

  toggle: () => {
    const state = get()
    clearTimer(state.autoTimer)

    if (state.isPlaying) {
      set({ isPlaying: false, autoTimer: null })
      return
    }

    set({ isPlaying: true, autoTimer: null })
    get().toggleQuickPeek(true, 2000)
    const timer = setTimeout(() => {
      get().next()
    }, 20000)
    set({ autoTimer: timer })
  },

  dispose: () => {
    const state = get()
    clearTimer(state.autoTimer)
    clearTimer(state.quickPeekTimer)
    clearTimer(state.liveActivityTimer)
    clearTimer(state.notificationTimer)
    set({
      autoTimer: null,
      quickPeekTimer: null,
      liveActivityTimer: null,
      notificationTimer: null,
    })
  },
}))
