import { useState } from "react"

export function Login({onSubmit}:any) {
  const [username, setUsername] = useState("")
  return (
    <div>
      <p>What should people call you?</p>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit(username)
        }}
      >
        <input
          type="text"
          value={username}
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input type="submit" />
      </form>
    </div>
  )
}
