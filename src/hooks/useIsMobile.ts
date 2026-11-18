import { useEffect, useState } from 'react'
import { isTouchPrimary } from '../utils/performance'

export function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(() => {
    if (typeof window === 'undefined') return true
    return window.innerWidth < 768 || isTouchPrimary()
  })

  useEffect(() => {
    const update = () => {
      setMobile(window.innerWidth < 768 || isTouchPrimary())
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return mobile
}
