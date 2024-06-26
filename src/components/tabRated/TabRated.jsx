/* eslint-disable react/prop-types */
import { Row, Pagination } from 'antd'
import { useState, useEffect } from 'react'
import MovieService from '../../services/movie-service'
import FilmsList from '../filmsList'
import Spinner from '../spinner'
import ShowError from '../showError'
import SearchWarning from '../searchWarning'

const mov = new MovieService()
// const OLD_SESSION_ID = 'c0ef1ac683c6b86fc872f681ddf4299b'

export default function TabRated({ sessionID }) {
  const [[filmsObj, total], setFilmsData] = useState([[], null])
  const [spinner, setSpinner] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [showNotFound, setShowNotFound] = useState(false)

  useEffect(() => {
    const initFilms = async () => {
      try {
        setSpinner(true)
        const resultArr = await mov.getRatedMovies(sessionID)

        setFilmsData(resultArr)
      } catch (error) {
        if (error.code === 404) {
          setShowNotFound(true)
        } else {
          setShowAlert(true)
        }
      } finally {
        setSpinner(false)
      }
    }

    initFilms()
  }, [sessionID])

  const onPaginationChange = async (pageNumber) => {
    try {
      const pagiArr = await mov.getRatedMovies(sessionID, pageNumber)
      const [resultObj, dataTotal] = pagiArr

      setFilmsData([resultObj, dataTotal])
    } catch (error) {
      setShowAlert(true)
    }
  }

  const renderContent = () => {
    if (showAlert) {
      return <ShowError />
    }

    if (showNotFound) {
      return (
        <ShowError description="Оцените любой фильм из другой вкладки чтоб тут что-то появилось" />
      )
    }

    if (spinner) {
      return <Spinner />
    }

    if (total === 0) {
      return <SearchWarning message="Ничего не найдено" />
    }

    if (total === null) return null

    // console.log('возвращаем filmsList', filmsObj)
    return <FilmsList filmsObj={filmsObj} tab="rated" />
  }

  return (
    <>
      <Row gutter={[32, 16]} className="row-center-mobile">
        {renderContent()}
      </Row>
      <Pagination
        className="text-center pagination-self"
        onChange={onPaginationChange}
        defaultCurrent={1}
        total={total}
        pageSize={20}
        showSizeChanger={false}
      />
    </>
  )
}
