import { useRef, CSSProperties } from 'react'

import { useIntersectionObserver, useImageOnLoad } from './hooks'
import { IImage } from './interface'

export const ImageComponent = (props: IImage) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const { handleImageOnLoad, thumbStyle, fullImageStyle } = useImageOnLoad()

  const entry = useIntersectionObserver({
    ref,
    options: {
      threshold: 0.1,
      triggerOnce: false
    }
  })

  const isVisible = !!entry?.isIntersecting

  return (
    <div className='image-container gallery-item' ref={ref}>
      {isVisible ? (
        <>
          <img
            style={{ ...thumbStyle }}
            className='gallery-item-image'
            src={props?.previewURL}
          />

          <img
            onLoad={handleImageOnLoad}
            style={{ ...fullImageStyle }}
            className='gallery-item-image'
            src={props?.largeImageURL}
          />
        </>
      ) : null}
    </div>
  )
}
