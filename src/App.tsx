import { useFetch } from './hooks'

interface IImage {
  albumId: number
  id: number
  title: string
  url: string
  thumbnailUrl: string
}
const url = 'https://jsonplaceholder.typicode.com/photos?_start=0&_limit=10'

function App() {
  const { data, error, loading } = useFetch<IImage[]>(url)

  return (
    <div className='App'>
      <h1 className='heading'>Image Lazy Loading</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Errro</p>
      ) : (
        <>
          {data?.map((image: IImage, i) => (
            <div
              className='image-container'
              // ref={imgRef}
              key={image.albumId + i}
              style={{
                paddingBottom: `${(3024 / 4032) * 100}%`,
                width: '100%'
              }}
            >
              <img className='image thumb' src={image?.url} />
            </div>
          ))}
        </>
      )}
    </div>
  )
}

export default App
