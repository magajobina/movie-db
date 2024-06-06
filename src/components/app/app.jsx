/* eslint-disable consistent-return */
/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable no-unused-vars */
import { Col, Row, Spin, Alert, Pagination, Input, Tabs } from 'antd'
import { useState, useEffect, useRef } from 'react'
import { Offline, Online } from 'react-detect-offline'
import { debounce } from 'lodash'
import FilmsList from '../filmsList'
import Spinner from '../spinner'
import ShowError from '../showError'
import SearchWarning from '../searchWarning'
import MovieService from '../../services/movie-service'
import TabSearch from '../tabSearch'
import './app.css'

export default function App() {
  const [[filmsObj, total], setFilmsData] = useState([[], null])
  const [spinner, setSpinner] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const debouncedSearch = useRef(
    debounce((criteria) => {
      setSpinner(true)

      const mov = new MovieService()
      mov
        .searchFilms(criteria, 1)
        .then((resultArr) => {
          const [resultObj, dataTotal] = resultArr

          // console.log(resultObj)

          setFilmsData([resultObj, dataTotal])
          setSpinner(false)
        })
        .catch((error) => {
          setShowAlert(true)
          console.error(error)
        })
    }, 1000)
  ).current

  const onInputChange = (e) => {
    setInputValue(e.target.value)
    // console.log(e.target.value)
    debouncedSearch(e.target.value)
  }

  const onPaginationChange = (pageNumber) => {
    const mov = new MovieService()

    mov
      .searchFilms(inputValue, pageNumber)
      .then((resultArr) => {
        const [resultObj, dataTotal] = resultArr

        setFilmsData([resultObj, dataTotal])
      })
      .catch((error) => {
        setShowAlert(true)
        console.error(error)
      })
  }

  const renderContent = () => {
    if (showAlert) {
      return <ShowError />
    }

    if (spinner) {
      console.log('Спиннер')
      return <Spinner />
    }

    if (inputValue === '' && filmsObj.length === 0) {
      console.log('null на страницу')
      return null
    }

    if (total === 0) {
      return <SearchWarning message="Ничего не найдено" />
    }

    if (total === null) return null

    console.log('возвращаем filmsList', filmsObj)
    return <FilmsList filmsObj={filmsObj} />
  }

  const tabsItems = [
    {
      key: 'search',
      label: 'Search',
      children: (
        <>
          <Input
            className="search-self"
            onChange={onInputChange}
            value={inputValue}
            size="large"
            placeholder="Type to search..."
          />
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
      ),
    },
    {
      key: 'rated',
      label: 'Rated',
      children: (
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
      ),
    },
  ]
  return (
    <div className="app">
      <div className="container">
        <Offline>
          <Alert
            className="warning-alert"
            message="Warning"
            description="You are offline now"
            type="warning"
          />
        </Offline>
        <Tabs
          defaultActiveKey="1"
          centered
          items={tabsItems}
          onChange={(e) => {
            console.log(e)
          }}
        />
      </div>
    </div>
  )
}
