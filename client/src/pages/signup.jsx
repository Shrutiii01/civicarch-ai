import { useState } from "react"
import { signup } from "../services/api"

function Signup() {

  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {

      const res = await signup({
        name,
        email,
        password
      })

      console.log(res.data)

    } catch(err) {
      console.log(err)
    }
  }

  return (

    <form onSubmit={handleSubmit}>

      <input
        type="text"
        placeholder="Name"
        onChange={(e)=>setName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        onChange={(e)=>setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e)=>setPassword(e.target.value)}
      />

      <button type="submit">Signup</button>

    </form>

  )
}

export default Signup