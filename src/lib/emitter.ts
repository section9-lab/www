import mitt from 'mitt'

export type Events = {
  'toggle-notification': { state: boolean; type: string; duration?: number }
  'toggle-live-activity': { state: boolean; type: string }
  'toggle-quick-peek': { state: boolean; duration?: number }
}

export const emitter = mitt<Events>()
