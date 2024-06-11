/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-curly-brace-presence */
import { Col, Row, Spin, Alert, Pagination, Input, Tabs, Button } from 'antd'
import { useState, useEffect, useRef } from 'react'
import MovieService from '../../services/movie-service'
import FilmsList from '../filmsList'
import Spinner from '../spinner'
import ShowError from '../showError'
import SearchWarning from '../searchWarning'

const mov = new MovieService()
const OLD_SESSION_ID = 'd04dee17c91f6900e24f25ea3ce65703'

export default function TabRated({ sessionID }) {
  const [[filmsObj, total], setFilmsData] = useState([[], null])
  const [spinner, setSpinner] = useState(false)
  const [showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    const initFilms = async () => {
      try {
        setSpinner(true)
        const resultArr = await mov.getRatedMovies(OLD_SESSION_ID)
        const [resultObj, dataTotal] = resultArr

        setFilmsData([resultObj, dataTotal])
      } catch (error) {
        setShowAlert(true)
        console.error(error)
      } finally {
        setSpinner(false)
      }
    }

    initFilms()
  }, [])

  const onPaginationChange = async (pageNumber) => {
    try {
      const pagiArr = await mov.getRatedMovies(sessionID, pageNumber)
      const [resultObj, dataTotal] = pagiArr

      setFilmsData([resultObj, dataTotal])
    } catch (error) {
      setShowAlert(true)
      console.error(error)
    }
  }

  const renderContent = () => {
    if (showAlert) {
      return <ShowError />
    }

    if (spinner) {
      console.log('Спиннер')
      return <Spinner />
    }

    if (total === 0) {
      return <SearchWarning message="Ничего не найдено" />
    }

    if (total === null) return null

    console.log('возвращаем filmsList', filmsObj)
    return <FilmsList filmsObj={filmsObj} />
  }

  return (
    <>
      <Row gutter={[32, 16]}>{renderContent()}</Row>
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
