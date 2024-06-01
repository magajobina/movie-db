/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable array-callback-return */
export default class MovieService {
  #apiBase = 'https://api.themoviedb.org/3/search/movie'

  async getResource(argUrl) {
    const apiKey = '&api_key=a4476d262653cb85f05a5e09f346dc29'
    const url = this.#apiBase + argUrl + apiKey
    const res = await fetch(url)

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`)
    }

    return res.json()
  }

  async getPopularFilms() {
    const res = await this.getResource(`/popular?language=en-US&page=1`)
    return res.results
  }

  transformSearchFilms(filmsList) {
    const result = filmsList.map((item) => ({
      title: item.title,
      overview: item.overview,
      releaseDate: item.release_date,
      posterPath: item.poster_path,
      id: item.id,
    }))
    return result
  }
  
  async searchFilms(keyWords, pageNumper = 1) {
    const res = await this.getResource(`?query=${keyWords}&page=${pageNumper}`)
    console.log(res);

    return [this.transformSearchFilms(res.results), res.total_results]
    // return new Error('qweqwe')
  }

}
