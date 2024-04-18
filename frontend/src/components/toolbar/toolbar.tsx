import * as S from './styles'

import { Trash } from 'phosphor-react'
import { Login } from './login'

type PropsType = {
  id: string  
  addNote: ()=> void
  setUsername: (username:string)=> void
}

const Toolbar = ({
  id,  
  addNote,
  setUsername
}: PropsType) => {
  
  return (
    <S.ToolbarWrapper id={id} className="toolbar">
      <Login onSubmit={(username:string)=> {          
        setUsername(username)
      }} />
      <S.CreateNoteWrapper type="button" onClick={addNote}>Create note</S.CreateNoteWrapper>      
      <S.TrashWrapper id="trash" title="Drag note here to delete it.">
        <Trash size={32} color="red" />
      </S.TrashWrapper>    
    </S.ToolbarWrapper>
  )
}

export { Toolbar }