import React, {useContext} from 'react';
import NoteContext from '../context/notes/NoteContext';

const Noteitems = (props) => {
    const context = useContext(NoteContext);
    const { deleteNote } = context;
    const { note, updateNote } = props;
    return (
        <div className='col-md-3'>

            <div className="card my-3">
                <div className="card-body">
                    <div className="d-flex align-items-center">
                        <h5 className="card-title">{note.title}</h5>
                        <i className="fas fa-edit mx-2" onClick={()=>{updateNote(note)}}></i>
                        <i className="fas fa-trash mx-2" onClick={()=>{deleteNote(note._id);  props.showAlert("Deleted Successfully", "success");}}></i>
                </div>
                
                <p className="card-text">{note.description} </p>
            </div>
        </div>
        </div >
    )
}

export default Noteitems
