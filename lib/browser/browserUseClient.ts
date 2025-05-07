// lib/services/browserUseClient.ts
import axios from 'axios'

const browserUseClient = axios.create({
  baseURL: process.env.BROWSER_USE_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.BROWSER_USE_API_KEY}`
  }
})

export default browserUseClient
