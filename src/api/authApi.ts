import axios from 'axios'

const BASE_URL = 'http://localhost:8080/api/v1'
const AUTH_URL = BASE_URL + '/auth'

export const authApi = {
  async authenticate(username: string, password: string) {
    let response
    try {
      response = await axios.post(AUTH_URL + '/authenticate', {
        username,
        password
      })
    } catch (error) {
      console.log(error)
    }
    return response
  }
}
