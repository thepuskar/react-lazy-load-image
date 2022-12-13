import { useFetch } from './hooks'

import { ImageComponent } from './ImageComponent'
import { IPexelsResponse, IImage } from './interface'

const url = `https://pixabay.com/api/?key=${
  import.meta.env.VITE_PIXABAY_API_KEY
}&q=yellow+flowers&image_type=photo&pretty=true`

function App() {
  const { data, error, loading } = useFetch<IPexelsResponse>(url)

  return (
    <div className='container'>
      <h1 className='heading'>
        Image Gallery with CSS Grid <span>& Flexbox Fallback</span>
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Errro</p>
      ) : (
        <div className='gallery'>
          {data?.hits?.map((image: IImage) => (
            <ImageComponent key={image?.id} {...image} />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
