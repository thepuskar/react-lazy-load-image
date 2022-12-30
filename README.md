## React Lazy Load Image

React Component and custom to lazy load images and other components/elements. using [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) natively present in the browser.


# useIntersectionObserver

The useIntersectionObserver is a custom hook in React that allows you to detect when an element is in the viewport of a user's browser. It takes in an object with a ref property and an optional options property. The ref property is a reference object to an element in the DOM, and the options property is an object with configuration options for the intersection observer instance.

The hook returns an IntersectionObserverEntry object if the element is in the viewport, otherwise it returns undefined. The entry object contains information about the intersection between the element and the viewport, such as the intersection ratio and whether the element is fully or partially in the viewport.

The hook uses the useIsomorphicEffect hook to set up an intersection observer instance on the element when the component mounts and clean it up when the component unmounts. The intersection observer instance is configured with the options passed in the options object.

The hook also includes a state variable entry and a state updater function updateEntry that stores the IntersectionObserverEntry object returned by the intersection observer instance and updates the component's state with it.

If the triggerOnce option is set to true, the hook will check for intersection only once and will disconnect the intersection observer instance after the intersection.

The default values for the rootMargin and threshold options are '0px' and [0], respectively. The root option defaults to null.

## The Hook

```ts filename="useIntersectionObserver.ts" {3} copy
import { RefObject, useState } from 'react'
import { useIsomorphicEffect } from './useIsomorphicEffect'

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

  useIsomorphicEffect(() => {
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

## Usage

```tsx filename="LazyImage.tsx"
import { useRef } from 'react'
import { useIntersectionObserver } from './hooks'

interface IImage {
  url: string
}

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
      ) : null}
    </div>
  )
}
```

# useProgressiveImage
`useProgressiveImage` is a custom React hook that allows for lazy loading of images by progressively rendering an image in low quality first, and then replacing it with a high quality version once it is in view.

The hook takes in two arguments:
- `lowQualitySrc`: a string representing the URL of the low quality version of the image.
- `highQualitySrc`: a string representing the URL of the high quality version of the image.

It returns an array with three elements:

- `src:string`: the current src of the image, either the lowQualitySrc or the highQualitySrc.
- `style:{ blur: boolean }`: an object with a boolean value indicating whether or not the image is currently in low quality (true if it is, false if it is not).
- `ref:RefObject<HTMLImageElement>`: a ref object that can be attached to an img element to observe its intersection with the viewport.

## The Hook 

```ts filename="useProgressiveImage.ts"
import { useState, useEffect, useRef, RefObject } from 'react'
import 'intersection-observer'
import { useIsomorphicEffect } from './useIsomorphicEffect'

export const useProgressiveImage = (
  lowQualitySrc: string,
  highQualitySrc: string
): [string, { blur: boolean }, RefObject<HTMLImageElement>] => {
  const [src, setSrc] = useState<string>(lowQualitySrc)
  const observerRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
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

```

## Usage

```tsx filename="ProgressiveImage.tsx"
import { useProgressiveImage } from '../../hooks/useProgressiveImage'

interface IImageAttributes {
  lowQualitySrc: string
  highQualitySrc: string
  [key: string]: string
}

export const ProgressiveImage = (props: IImageAttributes) => {
  const { lowQualitySrc, highQualitySrc, alt, height, width, ...rest } = props

  const [src, { blur }, observerRef] = useProgressiveImage(
    lowQualitySrc,
    highQualitySrc
  )

  return (
    <img
      ref={observerRef as React.RefObject<HTMLImageElement>}
      src={src}
      style={{
        width: width ?? '100%',
        height: height ?? '100%',
        filter: blur ? 'blur(20px)' : 'none',
        transition: blur ? 'none' : 'filter 0.3s ease-out'
      }}
      alt={alt ?? 'Progressive image'}
      {...rest}
    />
  )
}

```
