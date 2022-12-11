## React Lazy Load

Lazy Load React component using [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) natively present in the browser.

It can be useful to lazy-loading images, implementing infinite scrolling

### Hook

#### **`useIntersectionObserver.ts`**

```ts
import { RefObject, useEffect, useState } from 'react'

const DEFAULT_ROOT_MARGIN = '0px'
const DEFAULT_THRESHOLD = [0]

interface IIntersectionObserverProperties {
  ref?: RefObject<Element> | null
  options?: IntersectionObserverOptions
}

interface IntersectionObserverOptions {
  triggerOnce?: boolean
  threshold?: number | number[]
  root?: Element | null | undefined
  rootMargin?: string
}

export function useIntersectionObserver({
  ref,
  options = {
    threshold: DEFAULT_THRESHOLD,
    root: null,
    rootMargin: DEFAULT_ROOT_MARGIN,
    triggerOnce: false
  }
}: IIntersectionObserverProperties): IntersectionObserverEntry | undefined {
  const { threshold, root, rootMargin, triggerOnce } = options

  const [entry, setEntry] = useState<IntersectionObserverEntry>()
  const frozen = entry?.isIntersecting && triggerOnce

  const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
    setEntry(entry)
  }

  useEffect(() => {
    const node = ref?.current
    const hasIOSupport = !!window.IntersectionObserver

    if (!hasIOSupport || frozen || !node) return

    const observerParams = { threshold, root, rootMargin }
    const observer = new IntersectionObserver(updateEntry, observerParams)
    observer.observe(node)

    return () => observer.disconnect()
  }, [ref?.current, JSON.stringify(threshold), root, rootMargin, frozen])
  return entry
}
```

#### Usage

#### **`ImageComponent.tsx`**

```tsx
import { useRef } from 'react'

import { useIntersectionObserver } from './hooks'
import { IImage } from './App'

export const ImageComponent = (props: IImage) => {
  const ref = useRef<HTMLDivElement | null>(null)

  const entry = useIntersectionObserver({
    ref,
    options: {
      threshold: 0.25,
      triggerOnce: true
    }
  })

  const isVisible = !!entry?.isIntersecting

  return (
    <div
      className='image-container'
      ref={ref}
      style={{
        paddingBottom: `${(3024 / 4032) * 100}%`,
        width: '100%'
      }}
    >
      {isVisible ? (
        <>
          <img className='image isLoaded' src={props?.url} />
        </>
      ) : (
        <img className='image thumb' src={props?.url} />
      )}
    </div>
  )
}
```
