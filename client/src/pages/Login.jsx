import { useState } from "react"
import { login } from "../services/api"

function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      const res = await login({
        email,
        password
      })

      const token = res.data.token

      localStorage.setItem("token", token)

      alert("Login successful")

    } catch (err) {

      setError("Invalid credentials")

    }

  }

  return (

    <div style={{width:"300px",margin:"100px auto"}}>

      <h2>Login</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          style={{display:"block",marginBottom:"10px",width:"100%"}}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          style={{display:"block",marginBottom:"10px",width:"100%"}}
        />

        <button type="submit" style={{width:"100%"}}>
          Login
        </button>

        {error && <p style={{color:"red"}}>{error}</p>}

      </form>

    </div>

  )
}

export default Login