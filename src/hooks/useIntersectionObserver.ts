import { RefObject, useEffect, useState } from 'react'

interface Args extends IntersectionObserverInit {
  freezeOnceVisible?: boolean
}

/**
 * It returns an IntersectionObserverEntry object if the element is visible in the viewport, otherwise
 * it returns undefined.
 * @param elementRef - RefObject<Element>
 * @param {Args}  - elementRef - a ref to the element you want to observe
 * @returns The entry is being returned.
 */
export function useIntersectionObserver(
  elementRef: RefObject<Element>,
  {
    threshold = 0,
    root = null,
    rootMargin = '0%',
    freezeOnceVisible = false
  }: Args
): IntersectionObserverEntry | undefined {
  const [entry, setEntry] = useState<IntersectionObserverEntry>()
  const frozen = entry?.isIntersecting && freezeOnceVisible

  const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
    setEntry(entry)
  }

  useEffect(() => {
    const node = elementRef?.current
    const hasIOSupport = !!window.IntersectionObserver

    if (!hasIOSupport || frozen || !node) return

    const observerParams = { threshold, root, rootMargin }
    const observer = new IntersectionObserver(updateEntry, observerParams)
    observer.observe(node)

    return () => observer.disconnect()
  }, [elementRef?.current, JSON.stringify(threshold), root, rootMargin, frozen])
  return entry
}
