/* eslint-disable consistent-return */
/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable no-unused-vars */
import { Col, Row, Spin, Alert, Pagination, Input, Tabs } from 'antd'
import { useState, useEffect, useRef, createContext } from 'react'
import { Offline } from 'react-detect-offline'
import TabRated from '../tabRated'
import TabSearch from '../tabSearch'
import GenresContext from '../genresContext'
import MovieService from '../../services/movie-service'
import './app.css'

const mov = new MovieService()

export default function App() {
  const [genresList, setGenresList] = useState([]) // ЗАЧЕКАТЬ ПОДУМАТЬ
  const [sessionID, setSessionID] = useState('') // ЗАЧЕКАТЬ ПОДУМАТЬ

  useEffect(() => {
    // ПОДУМАТЬ ЗАЧЕКАТЬ
    mov
      .getGenres()
      .then((result) => {
        setGenresList(result)
      })
      .catch((error) => {
        console.error(error)
      })

    mov.createGuestSession().then((result) => {
      console.log(result)
      setSessionID(result)
    })
  }, [])

  const tabsItems = [
    {
      key: 'search',
      label: 'Search',
      children: <TabSearch sessionID={sessionID} />,
    },
    {
      key: 'rated',
      label: 'Rated',
      children: <TabRated sessionID={sessionID} />,
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
        <GenresContext.Provider value={genresList}>
          <Tabs
            defaultActiveKey="1"
            centered
            destroyInactiveTabPane
            items={tabsItems}
            onChange={(e) => {
              console.log(e)
            }}
          />
        </GenresContext.Provider>
      </div>
    </div>
  )
}
