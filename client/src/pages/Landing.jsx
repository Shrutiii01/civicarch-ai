import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"

function Landing() {

  const [message, setMessage] = useState("Connecting to server...")

  useEffect(() => {

    api.get("/")
      .then((res) => {
        setMessage(res.data.message)
      })
      .catch((err) => {
        console.error("Failed to fetch message:", err)
        setMessage("Server connection failed")
      })

  }, [])

  return (

    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">

      <div className="text-center space-y-8">

        <div>

          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
            CivicArch AI
          </h1>

          <p className="mt-4 text-lg text-gray-600">
            {message}
          </p>

        </div>

        <div className="pt-4">

          <Link
            to="/login"
            className="inline-block px-8 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
          >
            Go to Login
          </Link>

        </div>

      </div>

    </div>

  )

}

export default Landing