/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Col, Tag } from 'antd'
import './film.css'
import { format } from 'date-fns'
import { enGB } from 'date-fns/locale'

export default function Film({ title, overview, posterPath, releaseDate }) {
  const shortenOverview = () => {
    if (overview.length < 182) return overview
    let result = overview.substring(0, 182)
    result = result.substring(0, result.lastIndexOf(' '))

    return `${result} ...`
  }

  const getCorrectDate = () => {
    if (releaseDate === '') return 'not available'

    return format(new Date(releaseDate), 'MMMM dd, yyyy', { locale: enGB })
  }

  const makePosterSrc = () => {
    if (!posterPath) return '/backfall-poster.png'

    return `https://image.tmdb.org/t/p/w500${posterPath}`
  }
  // console.log(releaseDate, format(new Date(releaseDate), 'MMMM dd, yyyy', { locale: enGB }))

  return (
    <Col lg={12} xs={24}>
      <div className="self__card">
        <div className="self__img-wrapper">
          <img className="self__img" src={makePosterSrc()} alt="film poster" />
        </div>
        <div className="self__content">
          <h2 className="self__title">{title}</h2>
          {/* <div className="self__date">March 5, 2020</div> */}
          <div className="self__date">{getCorrectDate()}</div>
          <div className="self__genres">
            <Tag>Action</Tag>
            <Tag>Drama</Tag>
          </div>
          <div className="self__desc">{shortenOverview()}</div>
        </div>
      </div>
    </Col>
  )
}
