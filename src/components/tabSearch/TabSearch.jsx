/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-unused-vars */
import { Col, Row, Spin, Alert, Pagination, Input, Tabs, Button } from 'antd'
import { useState, useEffect, useRef } from 'react'
import { debounce } from 'lodash'
import FilmsList from '../filmsList'
import Spinner from '../spinner'
import ShowError from '../showError'
import SearchWarning from '../searchWarning'
import MovieService from '../../services/movie-service'
import useInput from '../../hooks/useInput'

const mov = new MovieService()
const OLD_SESSION_ID = 'd04dee17c91f6900e24f25ea3ce65703'

export default function TabSearch({ sessionID }) {
  const [[filmsObj, total], setFilmsData] = useState([[], null])
  const [spinner, setSpinner] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const input = useInput('')

  const debouncedSearch = useRef(
    debounce(async (criteria) => {
      try {
        setSpinner(true)
        const resultArr = await mov.searchFilms(criteria, 1)
        const [resultObj, dataTotal] = resultArr

        setFilmsData([resultObj, dataTotal])
      } catch (error) {
        setShowAlert(true)
        console.error(error)
      } finally {
        setSpinner(false)
      }
    }, 1000)
  ).current

  useEffect(() => {
    if (input.value.trim() !== '') {
      debouncedSearch(input.value)
    }
  }, [input.value])

  const onPaginationChange = async (pageNumber) => {
    try {
      const pagiArr = await mov.searchFilms(input.value, pageNumber)
      const [resultObj, dataTotal] = pagiArr

      setFilmsData([resultObj, dataTotal])
    } catch (error) {
      setShowAlert(true)
      console.error(error)
    }
  }

  const onRatingClick = async (rating, movieID) => {
    try {
      await mov.addRating(movieID, rating, sessionID)
    } catch (error) {
      setShowAlert(true)
      console.error(error)
    }
  }

  const btnClickHandler = async (e) => {
    const result = await mov.getRatedMovies(sessionID)
    console.log(result);
  }

  const renderContent = () => {
    if (showAlert) {
      return <ShowError />
    }

    if (spinner) {
      console.log('Спиннер')
      return <Spinner />
    }

    if (input.value === '' && filmsObj.length === 0) {
      // console.log('null на страницу')
      return null
    }

    if (total === 0) {
      return <SearchWarning message="Ничего не найдено" />
    }

    if (total === null) return null

    console.log('возвращаем filmsList', filmsObj)
    return <FilmsList filmsObj={filmsObj} onRatingClick={onRatingClick} />
  }

  return (
    <>
      <Input
        className="search-self"
        value={input.value}
        onChange={input.onChange}
        size="large"
        placeholder="Type to search..."
      />
      <Button onClick={btnClickHandler}>Получить оценённые фильмы</Button>
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
