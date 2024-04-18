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

socket.addEventListener("open", event => {  
  console.log('websocket connection established')
});

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

  const [username, setUsername] = useState<string>("")

  let hasLoaded = false

  const renderCursors = (mouse:any) => {    
    if(mouse && JSON.parse(mouse).card && JSON.parse(mouse).card !== username) {      
      return (
        <Cursor point={[JSON.parse(mouse).x, JSON.parse(mouse).y]} />
      )
    }    
  }

  const renderOtherNotes = (mouse:any) => {
    if(mouse && mouse.card && mouse.card !== username) {
      console.log('new card added')
      return (
      <Note
            key={mouse.card}
            id={mouse.card}
            randomColor={generateRandomHexColor()}
            position={generateCardRandomPosition()}          
            text={mouse.card}         
        />
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
    sendJsonMessage({
      x: 0,
      y: 0,
      card: username
    })
    
    window.addEventListener("mousemove", (e) => {   
      //sendJsonMessageThrottled.current({x: e.clientX,y: e.clientY, card: username})            
      sendJsonMessage({
        x: e.clientX,
        y: e.clientY,
        card: username
      })
    })
    // Clean up event listeners    
    return() => socket.close()
  }, [])

  const addNote = (): void => {
    setNotes([
      ...notes,
      {
        id: uuidv4(),
        randomColor: generateRandomHexColor(),
        position: generateCardRandomPosition(),
        text: '',
      },
    ])

    setStorageItem('notes', [
      ...notes,
      {
        id: uuidv4(),
        randomColor: generateRandomHexColor(),
        position: generateCardRandomPosition(),
        text: '',
      },
    ])
    console.log(username + ' added note')
    sendJsonMessage({x:0, y: 0,card: username});
  }

  const removeNote = (noteId: string): void => {
    console.log('card removed')
    const filteredNotes = notes.filter((item) => item.id !== noteId)
    setNotes(filteredNotes)
    setStorageItem('notes', filteredNotes)
  }
  
 const handleMouseMove = (e: any) => {  
    const { x, y } = e;      
    setCardPosition({ x: x, y: y , card:username});
    // Emit 'moveCard' event to the server
    sendCardPositionThrottled.current({
        x: e.clientX,
        y: e.clientY,
        card: username
    })
  };

  return (
    <div className="app">
      <Toolbar id='main-toolbar' addNote={addNote} setUsername={setUsername}/>
      {notes.map((item) => (
        <Note
          key={item.id}
          id={item.id}
          randomColor={item.randomColor}
          position={item.position}
          onClose={() => removeNote(item.id)}
          existingNotes={notes}
          text={item.text}
          owner={username}
          onMouseMove={(e:any) => {              
              handleMouseMove(e)
            }
          }
        />
      ))}
    
      {renderCursors(lastJsonMessage)}
      {renderOtherNotes(lastJsonMessage)}
    </div>
  )
}

export default App