import styled, { css } from 'styled-components'

type NoteProps = {
  position: { x: number, y: number }
}

export const Note = styled.div<NoteProps>`
  ${({ position }) => css`
    min-width: 300px;
    min-height: 200px;
    border: 3px solid #333;
    position: absolute;
    top: ${position.y}%;
    left: ${position.x}%;
  `}
`

type NoteHeaderProps = {
  randomColor: string
}

export const NoteHeader = styled.header<NoteHeaderProps>`
  ${({ randomColor }) => css`
    background-color: ${randomColor};
    color: white;
    padding: 1rem;
    cursor: move;

    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: 0.8rem;
  `}
`

export const NoteTitle = styled.h2`
  display: flex;
  align-items: center;
`

export const Textarea = styled.textarea`
  min-width: 300px;
  min-height: 200px;
  width: 100%;
  padding: 1rem;
  border: none;
  font-size: 1.6rem;
`

export const CloseAction = styled.button`
  width: 3.5rem;
  height: 3.5rem;
  background: red;
  border-radius: 50%;
  display: grid;
  place-content: center;
  cursor: pointer;
  border: none;

  &:hover {
    opacity: 0.8;
  }
`

export const BringToFrontAction = styled.button`
  width: 3.5rem;
  height: 3.5rem;
  background: #242424;
  border-radius: 50%;
  display: grid;
  place-content: center;
  cursor: pointer;
  border: none;

  &:hover {
    opacity: 0.8;
  }
`