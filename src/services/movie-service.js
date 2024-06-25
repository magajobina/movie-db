/* eslint-disable prefer-destructuring */
/* eslint-disable default-param-last */

export default class MovieService {
  #apiBase = 'https://api.themoviedb.org/3'

  #apiKey = '&api_key=a4476d262653cb85f05a5e09f346dc29'

  #apiBearer =
    'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNDQ3NmQyNjI2NTNjYjg1ZjA1YTVlMDlmMzQ2ZGMyOSIsInN1YiI6IjY2NGNjMTk5YTg3YjJlYTBhMzY2OTM5OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.zQA5U6nfIAwsRQyU1i3gvtVtI0SG77jkihyN0dUNcCQ'

  async getResource(argUrl, options, useAPIKey = true) {
    const url = this.#apiBase + argUrl + (useAPIKey ? this.#apiKey : '')

    const res = await fetch(url, options)

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`)
    }

    return res.json()
  }

  async getResourceRated(argUrl, options) {
    const url = this.#apiBase + argUrl
    let res
    try {
      res = await fetch(url, options)
    } catch (error) {
      console.log(error)
      // Либо вернуть значение, либо выбросить свою ошибку для управления дальше
      return { error: 'Failed to fetch resource due to network error or CORS issue' }
    }

    if (!res.ok && res.status === 404) {
      const err = new Error('Movies were not found due to the lack of movies you rated.')
      err.code = 404
      throw err
    }

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`)
    }

    return res.json()
  }

  async createGuestSession() {
    const url = '/authentication/guest_session/new'
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: this.#apiBearer,
      },
    }
    const res = await this.getResource(url, options, false)
    return res.guest_session_id
  }

  // eslint-disable-next-line class-methods-use-this
  transformFilmsData(filmsList) {
    const result = filmsList.map((item) => ({
      title: item.title,
      overview: item.overview,
      releaseDate: item.release_date,
      posterPath: item.poster_path,
      voteAverage: item.vote_average,
      genreIDs: item.genre_ids,
      rating: item.rating,
      id: item.id,
    }))
    return result
  }

  async searchFilms(keyWords, pageNumper = 1, sessionID) {
    const res = await this.getResource(
      `/search/movie?query=${keyWords}&page=${pageNumper}`
    )
    let foundUserRatedFilms = []
    const filmsWithoutRating = res.results

    try {
      foundUserRatedFilms = await this.getRatedMovies(sessionID, pageNumper)
      foundUserRatedFilms = foundUserRatedFilms[0]
    } catch (error) {
      // eslint-disable-next-line no-unused-vars
      const qweqwe = error
    }

    const resultFUCK = []
    if (foundUserRatedFilms) {
      filmsWithoutRating.forEach((filmNoRating) => {
        foundUserRatedFilms.forEach((filmRating) => {
          if (filmNoRating.id === filmRating.id) {
            const filmNoRatingCurrent = filmNoRating
            filmNoRatingCurrent.rating = filmRating.rating
            resultFUCK.push(filmNoRatingCurrent)
          } else {
            resultFUCK.push(filmNoRating)
          }
        })
      })
    }

    // console.log('resultFUCK', resultFUCK)
    // console.log('res.results', res.results)

    return [this.transformFilmsData(res.results), res.total_results]
  }

  async getGenres() {
    const res = await this.getResource('/genre/movie/list?language=en')

    return res.genres
  }

  async addRating(movieId, rating, sessionId) {
    const url = `/movie/${movieId}/rating?guest_session_id=${sessionId}`
    const options = {
      method: 'POST',
      headers: {
        Authorization: this.#apiBearer,
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ value: `${rating}` }),
    }

    const res = await this.getResource(url, options, false)

    // console.log('Add Rating message:', res.status_message, sessionId)

    return res.status_message
  }

  async getRatedMovies(sessionId, pageNumber = 1) {
    const url = `/guest_session/${sessionId}/rated/movies?language=en-US&page=${pageNumber}&sort_by=created_at.asc`
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: this.#apiBearer,
      },
    }

    const res = await this.getResourceRated(url, options, false)

    // console.log('getRatedMovies:', res)

    return [this.transformFilmsData(res.results), res.total_results]
  }
}
