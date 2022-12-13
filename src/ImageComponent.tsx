import { useRef } from 'react'

import { useIntersectionObserver } from './hooks'
import { IImage } from './interface'

export const ImageComponent = (props: IImage) => {
  const ref = useRef<HTMLDivElement | null>(null)

  const entry = useIntersectionObserver({
    ref,
    options: {
      threshold: 0,
      triggerOnce: true
    }
  })

  const isVisible = !!entry?.isIntersecting

  return (
    <div className='image-container gallery-item' ref={ref}>
      {isVisible ? (
        <>
          <img
            className='gallery-item-image gallery-item-image-isLoaded'
            src={props?.largeImageURL}
          />
        </>
      ) : null}
    </div>
  )
}
