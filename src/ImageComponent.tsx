import { useRef, useState } from 'react'
import classnames from 'classnames'
import { useIntersectionObserver } from './hooks'

import { IImage } from './App'

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
