import { useState, useEffect, useRef } from 'react'

import { v4 as uuidv4 } from 'uuid'

import { Note } from 'components/note/note'
import useWebSocket from "react-use-websocket"
import throttle from "lodash.throttle"
import { Cursor } from "components/cursor"

import type { NotesType } from 'types/notes'

import {
  generateRandomHexColor,
  generateCardRandomPosition,
  setStorageItem,
  getStorageItem,
} from 'utils'

import { Toolbar } from 'components/toolbar/toolbar'

const THROTTLE = 100, WS_URL = 'ws://localhost:8000/ws'
const socket = new WebSocket(WS_URL);
const userId = uuidv4()

function App() {
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL, {
    queryParams: { x: 0, y: 0, text: '', id: '', event: '' },
    share: false,
    shouldReconnect: () => true
  })

  const sendJsonMessageThrottled = useRef(throttle(sendJsonMessage, THROTTLE))

  const sendCardUpdatedThrottled = useRef(throttle(sendJsonMessage, THROTTLE))

  const [notes, setNotes] = useState<Array<NotesType>>([])

  useEffect(() => {
    const existingNotes = getStorageItem('notes')
    if (existingNotes) {
      setNotes(existingNotes)
    }
    socket.addEventListener("open", event => {
      console.log('websocket connection established')
    });

    window.addEventListener("mousemove", (e) => {
      const { x, y } = e;
      sendJsonMessageThrottled.current({ x: x, y: y, userId: userId })
    })
  }, [lastJsonMessage])

  const moveNotes = (update: any) => {
    if (update) {
      const { x, y, text, id } = update;
      const updatedNotes = notes.map(note => {
        if (note.id === id) {
          return {
            ...note,
            position: { x: x, y: y }
          };
        }
        return note;
      });
      setStorageItem('notes', updatedNotes)
    }
  }

  const updatedNotes = (update: any) => {
    if (update) {
      const { text, id } = update;
      const updatedNotes = notes.map(note => {
        if (note.id === id) {
          return {
            ...note,
            text: text
          };
        }
        return note;
      });
      console.log(JSON.stringify(updatedNotes))

      setStorageItem('notes', updatedNotes)
    }
  }

  const addNote = (): void => {
    let id = uuidv4()
    const pos = { x: generateCardRandomPosition(), y: generateCardRandomPosition() }
    setStorageItem('notes', [
      ...notes,
      {
        id: id,
        randomColor: generateRandomHexColor(),
        position: pos,
        text: '',
      },
    ])
    sendCardUpdatedThrottled.current({
      event: 'card-added',
      id: id,
      randomColor: generateRandomHexColor(),
      position: pos,
      text: '',
    });
  }

  const removeNote = (noteId: string): void => {
    console.log('card removed')
    const filteredNotes = notes.filter((item) => item.id !== noteId)
    setStorageItem('notes', filteredNotes)
  }

  const handleCardUpdated = (e: any) => {
    const { x, y, text, id } = e;
    sendJsonMessageThrottled.current({
      x: x,
      y: y,
      id: id,
      text: text,
      event: 'card-updated'
    })

  };

  const renderCursors = (mouse: any) => {
    let data = JSON.parse(mouse)
    if (data && data.userId !== userId) {
      return (
        <Cursor point={[data.x, data.y]} />
      )
    }
  }

  return (
    <div className="app">
      <Toolbar id='main-toolbar' addNote={addNote} />
      {notes.map((item) => (
        <Note
          key={item.id}
          id={item.id}
          randomColor={item.randomColor}
          position={item.position}
          onClose={() => removeNote(item.id)}
          text={item.text}
          onCardMoved={moveNotes}
          onCardTextChanged={updatedNotes}
        />
      ))}

      {renderCursors(lastJsonMessage)}
    </div>
  )
}

export default App