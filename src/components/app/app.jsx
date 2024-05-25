/* eslint-disable no-unused-vars */
import { Col, Row, Spin, Alert } from 'antd'
import { useState, useEffect } from 'react'
import { Offline, Online } from 'react-detect-offline'
import FilmsList from '../filmsList'
import Spinner from '../spinner'
import MovieService from '../../services/movie-service'
import './app.css'

export default function App() {
  const [filmsObj, setFilmsObj] = useState([{}])
  const [spinner, setSpinner] = useState(true)
  const [showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    const mov = new MovieService()

    mov
      .searchFilms('return')
      .then((result) => {
        console.log(result)

        setFilmsObj(result)
        setSpinner(false)
      })
      .catch((error) => {
        setShowAlert(true)
        console.error(error)
      })
  }, [])

  const showContent = () => {
    if (showAlert) {
      return (
        <Alert message="Error" description="Произошла ошибка" type="error" showIcon />
      )
    }

    if (spinner) return <Spinner />

    return <FilmsList filmsObj={filmsObj} />
  }

  return (
    <div className="app">
      <div className="container">
        <Offline>
          <Alert
            message="Warning"
            description="You are offline now"
            type="warning"
            className="warning-alert"
          />
        </Offline>
        <Row gutter={[32, 16]}>{showContent()}</Row>
      </div>
    </div>
  )
}
