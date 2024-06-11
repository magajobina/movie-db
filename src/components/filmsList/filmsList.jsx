/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import Film from '../film'
import './filmsList.css'

export default function FilmsList({ filmsObj, onRatingClick }) {
  const films = filmsObj.map((filmData) => {
    const { title, overview, releaseDate, posterPath, voteAverage, genreIDs, rating, id } =
      filmData
    return (
      <Film
        onRatingClick={(clickedRating) => {onRatingClick(clickedRating, id)}}
        title={title}
        overview={overview}
        releaseDate={releaseDate}
        posterPath={posterPath}
        voteAverage={voteAverage}
        genreIDs={genreIDs}
        rating={rating}
        key={id}
      />
    )
  })

  return films
}
