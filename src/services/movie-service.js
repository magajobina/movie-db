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

  async searchFilms() {
    const res = await this.getResource(`?query=return`)
    return res.results
  }

}
