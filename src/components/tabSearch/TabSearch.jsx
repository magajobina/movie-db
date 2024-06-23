/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Row, Pagination, Input } from 'antd'
import { useState, useEffect, useRef } from 'react'
import { debounce } from 'lodash'
import FilmsList from '../filmsList'
import Spinner from '../spinner'
import ShowError from '../showError'
import SearchWarning from '../searchWarning'
import MovieService from '../../services/movie-service'

const mov = new MovieService()
// const OLD_SESSION_ID = '0b4ee637939fd57b4c0203baefe81348'

export default function TabSearch({ sessionID, searchMem, setSearchMem }) {
  const [[filmsObj, total], setFilmsData] = useState([[], null])
  const [spinner, setSpinner] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [input, setInput] = useState('')

  const debouncedSearch = useRef(
    debounce(async (criteria) => {
      try {
        setSpinner(true)
        const resultArr = await mov.searchFilms(criteria, 1)
        const [resultObj, dataTotal] = resultArr

        setFilmsData([resultObj, dataTotal])
      } catch (error) {
        setShowAlert(true)
      } finally {
        setSpinner(false)
      }
    }, 1000)
  ).current

  useEffect(() => {
    if (input.trim() !== '') {
      debouncedSearch(input)
      setSearchMem(input)
    } 
  }, [input])

  useEffect(() => {
    if (searchMem !== '') {
      setInput(searchMem)
    }
  }, [])

  const onPaginationChange = async (pageNumber) => {
    try {
      const pagiArr = await mov.searchFilms(input.value, pageNumber)
      const [resultObj, dataTotal] = pagiArr

      setFilmsData([resultObj, dataTotal])
    } catch (error) {
      setShowAlert(true)
    }
  }

  const onRatingClick = async (rating, movieID) => {
    try {
      await mov.addRating(movieID, rating, sessionID)
    } catch (error) {
      setShowAlert(true)
    }
  }

  const inputHandler = (e) => {
    setInput(e.target.value)
  }

  const renderContent = () => {
    if (showAlert) {
      return <ShowError />
    }

    if (spinner) {
      return <Spinner />
    }

    if (input === '' && filmsObj.length === 0) {
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
        value={input}
        onChange={inputHandler}
        size="large"
        placeholder="Type to search..."
      />
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
