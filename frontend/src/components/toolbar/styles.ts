import styled from 'styled-components'

export const ToolbarWrapper = styled.div`
  display: flex;  
  align-items: center;
  flex-orientation: center;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 1.6rem;
  input {
    margin-right: 10px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    font-size: 1.6rem;   
  }
  input:hover {
    background-color: #f5f5f5;
    transform: scale(1.1);
  }  
`

export const TrashWrapper = styled.div`
    display: inline-flex;        
    padding: 10px;
    border: none;
    border-radius: 50%;
    background-color: blue;
    color: #fff;
    cursor: pointer;
    margin: 1rem;
    transition: background-color 0.3s ease;

  &:hover {
    background-color: #f5f5f5;
    transform: scale(1.1);
  }
`

export const CreateNoteWrapper = styled.button`
  padding: 1rem;
  background-color: blue;
  color: white;
  border-radius: 10px;
  font-size: 1.6rem;
  cursor: pointer;
  border: none;
  margin: 1rem;
  user-select: none;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: hsl(220, 100%, 30%);
  }
}
`