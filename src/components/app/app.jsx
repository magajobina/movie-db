/* eslint-disable no-unused-vars */
import { Row } from 'antd'
import { useState, useEffect } from 'react'
import FilmsList from '../filmsList'
import MovieService from '../../services/movie-service'
import './app.css'

export default function App() {
  const [filmsObj, setFilmsObj] = useState([{
    title: 'item.title',
    overview: 'item.overview',
    releaseDate: '12-06-2021',
    posterPath: 'item.poster_path',
    id: 'item.id'
  }])

  useEffect(() => {
    const mov = new MovieService()

    mov.searchFilms().then((list) => {
      console.log(list)
      const result = list.map((item) => ({
        title: item.title,
        overview: item.overview,
        releaseDate: item.release_date,
        posterPath: item.poster_path,
        id: item.id
      }))
      setFilmsObj(result)
    })
  }, [])

  return (
    <div className="app">
      <div className="container">
        <Row gutter={[32, 16]}>
          <FilmsList filmsObj={filmsObj} />
        </Row>
      </div>
    </div>
  )
}
