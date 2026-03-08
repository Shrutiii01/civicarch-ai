import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:8000"
})

/* ------------------------
   AUTH APIs
------------------------- */

export const signup = (data) => {
  return api.post("/auth/signup", data)
}

export const login = (data) => {
  return api.post("/auth/login", data)
}

export const verifyOTP = (email, otp) => {
  return api.post("/auth/verify-otp", null, {
    params: {
      email: email,
      otp: otp
    }
  })
}

export const forgotPassword = (email) => {
  return api.post("/auth/forgot-password", null, {
    params: { email }
  })
}

export const resetPassword = (email, otp, newPassword) => {
  return api.post("/auth/reset-password", null, {
    params: {
      email: email,
      otp: otp,
      new_password: newPassword
    }
  })
}

export default api