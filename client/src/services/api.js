import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:8000"
})

export const signup = (data) => {
  return api.post("/auth/signup", data)
}

export const login = (data) => {
  return api.post("/auth/login", data)
}

export default api