import { useState } from "react"
import * as S from './styles'

export function Login({onSubmit}:any) {
  const [username, setUsername] = useState<string>("")

  return (
    <S.ToolbarWrapper className="toolbar">
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
          placeholder="name"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input type="submit" />
      </form>
    </S.ToolbarWrapper>
  )
}
