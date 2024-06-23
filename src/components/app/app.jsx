/* eslint-disable no-unused-vars */
import { Alert, Tabs } from 'antd'
import { useState, useEffect } from 'react'
import { Offline } from 'react-detect-offline'
import TabRated from '../tabRated'
import TabSearch from '../tabSearch'
import GenresContext from '../genresContext'
import MovieService from '../../services/movie-service'
import './app.css'

const mov = new MovieService()

export default function App() {
  const [genresList, setGenresList] = useState([])
  const [sessionID, setSessionID] = useState('')
  const [searchMem, setSearchMem] = useState('')

  useEffect(() => {
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
      children: (
        <TabSearch
          sessionID={sessionID}
          searchMem={searchMem}
          setSearchMem={setSearchMem}
        />
      ),
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
          <Tabs defaultActiveKey="1" centered destroyInactiveTabPane items={tabsItems} />
        </GenresContext.Provider>
      </div>
    </div>
  )
}
