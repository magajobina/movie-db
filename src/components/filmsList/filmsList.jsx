/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import Film from '../film'
import './filmsList.css'

export default function FilmsList({ filmsObj }) {
  const films = filmsObj.map((filmData) => (
    <Film title={filmData.title} overview={filmData.overview} releaseDate={filmData.releaseDate} posterPath={filmData.posterPath} key={filmData.id} />
  ))

  return films
}
