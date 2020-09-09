import axios from 'axios'

export function getPdf() {
  return axios
    .get('/api/getPdf')
    .then(res => res.data)
    .catch(error => Promise.reject(error))
}
