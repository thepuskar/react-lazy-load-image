## React Lazy Load

Lazy Load React component using [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) natively present in the browser.

It can be useful to lazy-loading images, implementing infinite scrolling



### Hook

#### **`useIntersectionObserver.ts`**

``` ts
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
```

#### Usage

```
import { useRef, useState } from 'react'
import classnames from 'classnames'

import { useIntersectionObserver } from './hooks'

interface IImage {
  albumId: number
  id: number
  title: string
  url: string
  thumbnailUrl: string
}

export const ImageComponent = (props: IImage) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  const entry = useIntersectionObserver(ref, {})

  const isVisible = !!entry?.isIntersecting

  const handleOnLoad = () => {
    setIsLoaded(true)
  }

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
          <img
            className={classnames('image', 'thumb', {
              ['isLoaded']: !!isLoaded
            })}
            src={props?.url}
          />
          <img
            className={classnames('image', {
              ['isLoaded']: !!isLoaded
            })}
            src={props?.url}
            onLoad={handleOnLoad}
          />
        </>
      ) : null}
    </div>
  )
}
```
