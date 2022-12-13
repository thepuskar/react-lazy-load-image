export interface ImageSrc {
  original: string
  large2x: string
  large: string
  medium: string
  small: string
  portrait: string
  landscape: string
  tiny: string
}

export interface IPexelsImage {
  id: number
  width: number
  height: number
  url: string
  photographer: string
  photographer_url: string
  photographer_id: number
  src: ImageSrc
  liked: boolean
}

export interface IPexelsResponse {
  totoalHits: number
  total: number
  hits: IImage[]
}

export interface IImage {
  id: number
  pageURL: string
  type: string
  tags: string
  previewURL: string
  previewWidth: number
  previewHeight: number
  webformatURL: string
  webformatWidth: number
  webformatHeight: number
  largeImageURL: string
  imageWidth: number
  imageHeight: number
  imageSize: number
  views: number
  downloads: number
  collections: number
  likes: number
  comments: number
  user_id: number
  user: number
  userImageURL: string
}
