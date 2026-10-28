import { useCallback, useEffect, useRef, useState } from 'react'
import { useMotionValueEvent, useScroll } from 'motion/react'
import { walkthroughIndex } from '../config/walkthrough'

export function useDemoWalkthrough() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const [startOffset, setStartOffset] = useState(0)
  const [step, setStep] = useState(0)
  const [isExploring, setIsExploring] = useState(false)
  const exploringRef = useRef(false)
  const exploredStepRef = useRef(0)
  const { scrollYProgress } = useScroll({ target: sceneRef, offset: [`start ${startOffset}px`, 'end end'] })

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const next = walkthroughIndex(progress)
    if (exploringRef.current && next === exploredStepRef.current) return
    exploringRef.current = false
    setIsExploring(false)
    setStep(next)
  })

  useEffect(() => {
    const scene = sceneRef.current
    const header = document.getElementById('app-header')
    const pin = scene?.querySelector<HTMLElement>('.demo-pin')
    const screen = scene?.querySelector<HTMLElement>('.macbook-screen')
    if (!scene || !pin || !screen) return
    const update = () => {
      if (header) scene.style.setProperty('--demo-header-height', `${header.getBoundingClientRect().height}px`)
      const screenBottom = screen.getBoundingClientRect().bottom - pin.getBoundingClientRect().top
      const top = Math.max(0, window.innerHeight - screenBottom)
      scene.style.setProperty('--demo-sticky-top', `${top}px`)
      setStartOffset(top)
    }
    const observer = new ResizeObserver(update)
    if (header) observer.observe(header)
    observer.observe(screen)
    update()
    window.addEventListener('resize', update)
    return () => { observer.disconnect(); window.removeEventListener('resize', update) }
  }, [])

  const explore = useCallback(() => {
    exploredStepRef.current = walkthroughIndex(scrollYProgress.get())
    exploringRef.current = true
    setIsExploring(true)
  }, [scrollYProgress])

  return { sceneRef, step, isExploring, explore }
}
