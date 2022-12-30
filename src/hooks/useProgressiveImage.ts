import { useState, useRef, RefObject } from 'react'
import 'intersection-observer'
import { useIsomorphicEffect } from './useIsomorphicEffect'

export const useProgressiveImage = (
  lowQualitySrc: string,
  highQualitySrc: string
): [string, { blur: boolean }, RefObject<HTMLImageElement>] => {
  const [src, setSrc] = useState<string>(lowQualitySrc)
  const observerRef = useRef<HTMLImageElement>(null)

  useIsomorphicEffect(() => {
    setSrc(lowQualitySrc)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setSrc(highQualitySrc)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.01 }
    )
    if (observerRef.current) {
      observer.observe(observerRef.current)
    }
  }, [lowQualitySrc, highQualitySrc, observerRef])

  return [src, { blur: src === lowQualitySrc }, observerRef]
}
