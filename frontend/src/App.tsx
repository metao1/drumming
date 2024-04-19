import { useState, useEffect,useRef } from 'react'

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
  const { sendJsonMessage, lastJsonMessage} = useWebSocket(WS_URL, {      
      queryParams: { x: 0, y: 0, card:''},
      share: false,
      shouldReconnect: () => true
  })
  
  const sendJsonMessageThrottled = useRef(throttle(sendJsonMessage, THROTTLE))

  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0, card:''});

  const sendCardPositionThrottled = useRef(throttle(sendJsonMessage, THROTTLE))    
  
  const [notes, setNotes] = useState<Array<NotesType>>([])

  const noteDB = new Map<string, NotesType>();

  const [dragging, setDragging] = useState({ id: "", x: 0, y: 0 })

  let hasLoaded = false

  const renderCursors = (mouse:any) => {        
    let data = JSON.parse(mouse)
    if(data && data.userId !== userId) {
      return (
        <Cursor point={[data.x, data.y]} />
      )
    }    
  }

  useEffect(() => {
    const existingNotes = getStorageItem('notes')    
    if (!hasLoaded && existingNotes) {
      setNotes(existingNotes)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      hasLoaded = true
    }
    socket.addEventListener("message", event=> {
      if(event.data) {
        //console.log(event)
      }
    })
    socket.addEventListener("open", event => {  
      console.log('websocket connection established')
    });
    window.addEventListener("mousemove", (e) => {   
      const { x, y } = e;
      sendJsonMessageThrottled.current({userId: userId, x: x, y:y})
    })
    // Clean up event listeners    
    
  }, [])

  const addNote = (): void => {
    let id = uuidv4()
    setNotes([
      ...notes,
      {
        id: id,
        randomColor: generateRandomHexColor(),
        position: generateCardRandomPosition(),
        text: '',
      },
    ])

    setStorageItem('notes', [
      ...notes,
      {
        id: id,
        randomColor: generateRandomHexColor(),
        position: generateCardRandomPosition(),
        text: '',
      },
    ])
    noteDB.set(id, {
        id: id,
        randomColor: generateRandomHexColor(),
        position: generateCardRandomPosition(),
        text: '',
    })
    sendJsonMessage({id:id, x:0, y: 0});
  }

  const removeNote = (noteId: string): void => {
    console.log('card removed')
    const filteredNotes = notes.filter((item) => item.id !== noteId)
    setNotes(filteredNotes)
    setStorageItem('notes', filteredNotes)
  }
  
 const handleCardMoved = (id: string, e: any) => {  
    const { x, y, card } = e;
    setCardPosition({ x: x, y: y , card:card});
    // Emit 'moveCard' event to the server
    sendCardPositionThrottled.current({
        x: e.clientX,
        y: e.clientY,
        card: card
    })
    setDragging({id: id, x:x, y:y})
  };

  return (
    <div className="app">
      <Toolbar id='main-toolbar' addNote={addNote}/>
      {notes.map((item) => (
        <Note
          key={item.id}
          id={item.id}
          randomColor={item.randomColor}
          position={item.position}
          onClose={() => removeNote(item.id)}
          existingNotes={notes}
          text={item.text}
          onCardMoved={(e:any) => {              
              handleCardMoved(item.id, e)
            }
          }
        />
      ))}
    
      {renderCursors(lastJsonMessage)}
    </div>
  )
}

export default App