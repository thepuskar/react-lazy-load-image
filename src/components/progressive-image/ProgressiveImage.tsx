import { useProgressiveImage } from '../../hooks'

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
