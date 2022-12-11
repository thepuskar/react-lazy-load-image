import { useRef } from 'react'
import classnames from 'classnames'
import { useIntersectionObserver } from './hooks'

import { IImage } from './App'

export const ImageComponent = (props: IImage) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const entry = useIntersectionObserver(ref, {})
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
      <img
        className={classnames('image', 'thumb', {
          ['isLoaded']: !!isVisible
        })}
        src={props?.url}
      />
      <img
        className={classnames('image', {
          ['isLoaded']: !!isVisible
        })}
        src={props?.url}
      />
    </div>
  )
}
