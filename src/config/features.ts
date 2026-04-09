export const featureItems = [
  {
    id: 'fluid-transitions',
    titleTop: 'Fluid',
    titleBottom: 'transitions',
  },
  {
    id: 'instant-notifications',
    titleTop: 'Instant',
    titleBottom: 'Notifications',
  },
  {
    id: 'live-activities',
    titleTop: 'Live',
    titleBottom: 'Activities',
  },
  {
    id: 'swipe-gestures',
    titleTop: 'Swipe',
    titleBottom: 'gestures',
  },
  {
    id: 'packed-with-surprises',
    titleTop: 'Packed with',
    titleBottom: 'surprises',
  },
  {
    id: 'customizable-huds',
    titleTop: 'Customizable',
    titleBottom: 'HUDs',
  },
  {
    id: 'lock-screen-widgets',
    titleTop: 'Lock Screen',
    titleBottom: 'Widgets',
  },
  {
    id: 'blazing-fast-native-app',
    titleTop: 'Blazing fast',
    titleBottom: 'native app',
  },
] as const

export type FeatureItemId = (typeof featureItems)[number]['id']
