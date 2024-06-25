/* eslint-disable default-param-last */
/* eslint-disable no-unused-vars */

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

    const res = await fetch(url, options)

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
    console.log('searchFilms RES!!!', res)
    let foundUserRatedFilms
    const foundFilmsButWithoutUserRating = res.results

    // try {
    //   foundUserRatedFilms = await this.getRatedMovies(sessionID, pageNumper)
    // } catch (error) {
    //   const qweqwe = error
    // }

    console.log('object', foundUserRatedFilms)

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

    console.log('Add Rating message:', res.status_message)

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
