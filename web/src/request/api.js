import { get, post } from './http'

export async function getPdf() {
  return await get('/getPdf')
}