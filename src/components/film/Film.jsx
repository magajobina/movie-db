/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useContext } from 'react'
import { Col, Tag, Rate } from 'antd'
import classNames from 'classnames'
import './film.css'
import { format } from 'date-fns'
import { enGB } from 'date-fns/locale'
import GenresContext from '../genresContext'
import poster from './backfall-poster.png'

const getCorrectDate = (releaseDate) => {
  if (releaseDate === '') return 'not available'

  return format(new Date(releaseDate), 'MMMM dd, yyyy', { locale: enGB })
}
const shortenTitle = (title) => {
  if (title.length < 25) return title
  let result = title.substring(0, 25)
  result = result.substring(0, result.lastIndexOf(' '))

  return `${result}...`
}

const makePosterSrc = (posterPath) => {
  if (!posterPath) return poster

  return `https://image.tmdb.org/t/p/w500${posterPath}`
}

const shortenOverview = (overview, filmGenresList) => {
  if (overview.length < 150) return overview
  let result = overview.substring(0, filmGenresList.length > 2 ? 120 : 160)
  result = result.substring(0, result.lastIndexOf(' '))

  return `${result} ...`
}

const getColorByRating = (handledRating) => {
  switch (true) {
    case handledRating >= 0 && handledRating < 3:
      return 'self__rating--bad'
    case handledRating >= 3 && handledRating < 5:
      return 'self__rating--medium'
    case handledRating >= 5 && handledRating < 7:
      return 'self__rating--good'
    case handledRating >= 7:
      return 'self__rating--perfect'
    default:
      return 'self__rating--default'
  }
}

export default function Film({
  onRatingClick,
  title,
  overview,
  posterPath,
  releaseDate,
  voteAverage,
  rating,
  genreIDs,
  tab,
}) {
  let isDisableRating = false
  const globalFilmsGenres = useContext(GenresContext)

  const getGenres = () =>
    genreIDs.map((id) => globalFilmsGenres.find((genresObj) => id === genresObj.id).name)

  const filmGenresList = getGenres()

  const handledRating = voteAverage.toFixed(1)

  switch (tab) {
    case 'search':
      isDisableRating = false
      break

    case 'rated':
      isDisableRating = true
      break

    default:
      break
  }

  if (tab === 'search') {
    isDisableRating = false
  } else if (tab === 'rated') {
    isDisableRating = true
  }

  return (
    <Col lg={12} xs={24}>
      <div className="self__card">
        <div className="self__img-wrapper">
          <img
            className="self__img"
            src={makePosterSrc(posterPath)}
            alt={`${title} poster`}
          />
        </div>
        <div className="self__content">
          <div className={classNames('self__rating', getColorByRating(handledRating))}>
            {handledRating}
          </div>
          <h2 className="self__title">{shortenTitle(title)}</h2>
          <div className="self__date">{getCorrectDate(releaseDate)}</div>
          <div className="self__genres">
            {filmGenresList.map((item) => (
              <Tag key={item}>{item}</Tag>
            ))}
          </div>
          <div className="self__desc">{shortenOverview(overview, filmGenresList)}</div>
          <Rate
            className="self__star-rating"
            disabled={isDisableRating}
            defaultValue={rating}
            onChange={(clickedRating) => {
              onRatingClick(clickedRating)
            }}
            count={10}
          />
        </div>
      </div>
    </Col>
  )
}
