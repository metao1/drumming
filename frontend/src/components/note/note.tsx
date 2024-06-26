import { useRef, useState } from 'react'

import { SelectionBackground, X } from 'phosphor-react'

import * as S from './styles'

type PropsType = {
  id: string
  onClose?: () => void
  randomColor: string
  position: { x: number, y: number }
  text: string
  onCardMoved?: (e: any) => any
  onCardTextChanged?: (e: any) => any
}

const Note = ({
  id,
  onClose,
  onCardMoved: onMouseMove,
  onCardTextChanged: onCardTextChanged,
  randomColor,
  position,
  text,
}: PropsType) => {
  const [shouldAllowMove, setShouldAllowMove] = useState(false)
  const [inputValue, setInputValue] = useState<string>(text || '')
  const [dx, setDx] = useState<number>(0)
  const [dy, setDy] = useState<number>(0)
  const noteRef = useRef<HTMLDivElement | null>(null)

  const handleMouseDown = (
    event: React.MouseEvent<HTMLHeadElement, MouseEvent>
  ): void => {
    if (!noteRef.current) return

    setShouldAllowMove(true)
    const dimensions = noteRef.current.getBoundingClientRect()

    setDx(event.clientX - dimensions.x)
    setDy(event.clientY - dimensions.y)
  }

  const handleMouseMove = (
    event: React.MouseEvent<HTMLHeadElement, MouseEvent>
  ): void => {

    if (!shouldAllowMove || !noteRef.current) return
    const x = event.clientX - dx
    const y = event.clientY - dy
    noteRef.current.style.left = x + 'px'
    noteRef.current.style.top = y + 'px'
    if (x <= 80 && y <= 80) {
      noteRef.current.style.backgroundColor = 'red'
    } else {
      noteRef.current.style.backgroundColor = 'white'
    }
    if (onMouseMove) {
      onMouseMove({ x: x, y: y, id: id })
    }
  }

  const handleMouseUp = (): void => {
    setShouldAllowMove(false)
  }

  const handleInputChange = (value: string): void => {
    setInputValue(value)
    if (onCardTextChanged) {
      onCardTextChanged({ id: id, text: value })
    }
  }

  const bringToFront = (): void => {
    if (!noteRef.current) return

    const notes = document.querySelectorAll<HTMLElement>('.note')
    notes.forEach((note) => {
      note.style.zIndex = '0'
    })

    const zIndex = Number(noteRef.current.style.zIndex)
    noteRef.current.style.zIndex = `${zIndex + 1}`
  }

  return (
    <S.Note
      ref={noteRef}
      position={position}
      className="note"
    >
      <S.NoteHeader
        onDragStart={(e: any) => {
          console.log(e.clientX - position.x)
        }}
        randomColor={randomColor}
        onMouseDown={(event: any) => handleMouseDown(event)}
        onMouseMove={(event: any) => handleMouseMove(event)}
        onMouseUp={handleMouseUp}
      >
        <S.NoteTitle>Note</S.NoteTitle>

        <S.BringToFrontAction
          onClick={bringToFront}
          aria-label="Bring to front"
        >
          <SelectionBackground size={16} />
        </S.BringToFrontAction>

        <S.CloseAction onClick={onClose} aria-label="Close note">
          <X size={16} />
        </S.CloseAction>
      </S.NoteHeader>

      <S.Textarea
        name={`text-area-${id}`}
        id={`text-area-${id}`}
        placeholder="Add a note"
        cols={30}
        rows={10}
        value={inputValue}
        onChange={(e: any) => handleInputChange(e.target.value)}
      />
    </S.Note>
  )
}

export { Note }