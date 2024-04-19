import * as S from './styles'

import { Trash } from 'phosphor-react'
import { Login } from './login'

type PropsType = {
  id: string  
  addNote: ()=> void  
}

const Toolbar = ({
  id,  
  addNote,  
}: PropsType) => {
  
  return (
    <S.ToolbarWrapper id={id} className="toolbar">      
      <S.CreateNoteWrapper type="button" onClick={addNote}>Create note</S.CreateNoteWrapper>      
      <S.TrashWrapper id="trash" title="Drag note here to delete it.">
        <Trash size={32} color="red" />
      </S.TrashWrapper>    
    </S.ToolbarWrapper>
  )
}

export { Toolbar }