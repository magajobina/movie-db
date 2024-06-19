/* eslint-disable react/prop-types */

import { useContext } from 'react'
import { Col, Tag, Rate } from 'antd'
import './film.css'
import { format } from 'date-fns'
import { enGB } from 'date-fns/locale'
import GenresContext from '../genresContext'
import poster from './backfall-poster.png'

export default function Film(props) {
  const {
    onRatingClick,
    title,
    overview,
    posterPath,
    releaseDate,
    voteAverage,
    rating,
    genreIDs,
  } = props

  const globalFilmsGenres = useContext(GenresContext)

  const getGenres = () =>
    genreIDs.map((id) => globalFilmsGenres.find((genresObj) => id === genresObj.id).name)

  const filmGenresList = getGenres()

  const shortenOverview = () => {
    if (overview.length < 150) return overview
    let result = overview.substring(0, filmGenresList.length > 2 ? 120 : 160)
    result = result.substring(0, result.lastIndexOf(' '))

    return `${result} ...`
  }
  const shortenTitle = () => {
    if (title.length < 25) return title
    let result = title.substring(0, 25)
    result = result.substring(0, result.lastIndexOf(' '))

    return `${result}...`
  }

  const getCorrectDate = () => {
    if (releaseDate === '') return 'not available'

    return format(new Date(releaseDate), 'MMMM dd, yyyy', { locale: enGB })
  }

  const makePosterSrc = () => {
    if (!posterPath) return poster

    return `https://image.tmdb.org/t/p/w500${posterPath}`
  }

  const handledRating = voteAverage.toFixed(1)

  const getColorByRating = () => {
    switch (true) {
      case handledRating >= 0 && handledRating < 3:
        return '#E90000'
      case handledRating >= 3 && handledRating < 5:
        return '#E97E00'
      case handledRating >= 5 && handledRating < 7:
        return '#E9D100'
      case handledRating >= 7:
        return '#66E900'
      default:
        // Возвращаемый цвет по умолчанию или обработка неправильных значений
        return 'black'
    }
  }

  return (
    <Col lg={12} xs={24}>
      <div className="self__card">
        <div className="self__img-wrapper">
          <img className="self__img" src={makePosterSrc()} alt="film poster" />
        </div>
        <div className="self__content">
          <div
            className="self__rating"
            style={{ borderColor: getColorByRating(handledRating) }}
          >
            {handledRating}
          </div>
          <h2 className="self__title">{shortenTitle()}</h2>
          <div className="self__date">{getCorrectDate()}</div>
          <div className="self__genres">
            {filmGenresList.map((item) => (
              <Tag key={item}>{item}</Tag>
            ))}
          </div>
          <div className="self__desc">{shortenOverview()}</div>
          <Rate
            className="self__star-rating"
            disabled={!!rating}
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
