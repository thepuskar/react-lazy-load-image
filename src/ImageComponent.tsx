import { useRef, useState } from 'react'

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
