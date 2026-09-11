import axios from "axios"

export const http = axios.create({
  baseURL: "/",
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
  withCredentials: true,
})
