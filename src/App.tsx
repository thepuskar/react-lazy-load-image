import { useFetch } from './hooks'

import { ImageComponent } from './ImageComponent'
import { ProgressiveImage } from './components'
import { IPexelsResponse, IImage } from './interface'

const API_KEY =
  import.meta.env.VITE_PIXABAY_API_KEY ?? '21514251-1e67eaf620a3a4ead3f537b34'
const url = `https://pixabay.com/api/?key=${API_KEY}&q=landscape&image_type=photo&pretty=true&per_page=10&page=1`

function App() {
  const { data, error, loading } = useFetch<IPexelsResponse>(url)

  return (
    <div className='container'>
      <div className='text'>
        <h1 className='heading'>Image Gallery</h1>
        <p className='info'>
          Created a simple image gallery using lazy-loading Intersection
          Observer API.
        </p>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Errro</p>
      ) : (
        <div className='gallery'>
          {data?.hits?.map((image: IImage) => (
            <div className='image-container gallery-item' key={image?.id}>
              <ProgressiveImage
                className='gallery-item-image'
                lowQualitySrc={image?.previewURL}
                highQualitySrc={image?.largeImageURL}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
