import { useEffect, useState } from 'react';
import './App.css';
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import axios from 'axios'
import Formtable from './components/Formtable';

axios.defaults.baseURL = "http://localhost:8000/"

function App() {
  const[addSection, setAddSection] = useState(false)
  const[formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  })
  const[formDataEdite, setFormDataEdite] = useState({
    name: "",
    email: "",
    mobile: "",
    id: ""
  })
  const [page, setPage] = useState(1);
  const [todoPerPage] = useState(5);

  const indexOfLastTodo = page * todoPerPage;
  const indexOFFirstTodo = indexOfLastTodo - todoPerPage;
  const[dataList, setDataList] = useState([])
  const currentPageData = dataList.slice(indexOFFirstTodo, indexOfLastTodo);

  const paginate = (indexTodo) => setPage(indexTodo);

  const currentPage = Math.ceil(dataList.length / todoPerPage);
  
  const[editeSection, setEditeSection] = useState(false)
const handleOnChange = (e) => {
  const {value, name} = e.target
  setFormData((preve) => {
    return {
      ...preve,
      [name]: value
    }
    })
}
//create
  const handleSubmit = async(e) => {
    e.preventDefault()
    const data = await axios.post("/create", formData)
    console.log(data);

    if(data.data.success){
      setAddSection(false)
      alert(data.data.message)
      getFetchData()
    }
  }
  //get
  const getFetchData = async () =>  {
    const data = await axios.get("/")
    console.log(data);
    if(data.data.success){
      setDataList(data.data.date) 
    }
  }
  useEffect(() => {
  getFetchData()
  },[])
  //delete
  const handleDelete = async (id) => {
    const data = await axios.delete("/delete/" + id)
    if(data.data.success) {
      getFetchData()
    alert(data.data.message)
    }
  }
  //update
  const handleUpdate = async (e) => {
    e.preventDefault()
    const data = await axios.put("/update", formDataEdite)
    if(data.data.success) {
      getFetchData()
    alert(data.data.message)
    setEditeSection(false)
    }
  } 
  const handleEditeOnChange = async (e) => {
    const {value, name} = e.target
  setFormDataEdite((preve) => {
    return {
      ...preve,
      [name]: value
    }
    })
  }
  const handleEdite = (el) => {
    setFormDataEdite(el)
    setEditeSection(true)
  }
  return (
    <>
    <div className="container">
      <button className="btn add-btn" onClick={() => setAddSection(true)}>Add</button>

    
    {
      addSection && (
         <Formtable
         handleSubmit = {handleSubmit}
          handleOnChange = {handleOnChange}
           handleClose = {() => setAddSection(false)}
           rest = {formData}
         />
      )
    }
    {
      editeSection && (
        <Formtable
         handleSubmit = {handleUpdate}
          handleOnChange = {handleEditeOnChange}
           handleClose = {() => setEditeSection(false)}
           rest = {formDataEdite}
         />
      )
    }
     
    
    <div className='tableContainer'>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Edit  | Delete</th>
          </tr>
        </thead>  
        
          { dataList[0] ? (
            currentPageData.map((el, i) => {
              return (
              <tbody> 
                <tr key={i}>
                  <td>{el.name}</td>
                  <td>{el.email}</td>
                  <td>{el.mobile}</td>
                  <td className='btns'> 
                    <div className='edit-btn' onClick={() => handleEdite(el)}><CiEdit/></div>
                    <div className='delete-btn' onClick={() => handleDelete(el._id)}><MdDelete/></div>
                  </td>
                </tr>
                </tbody>
              )
            })) : 
            <p className='dataIsNot'>Data is not find</p>
          }
        
        
      </table>
    </div>
    </div>
    <div className='pangination'>
        <button className='prev' onClick={() => paginate((index) => index-1)} disabled={page === 1}>prev</button>
        {page} / {currentPage}
        <button className='next' onClick={() => paginate((index) => index+1)} disabled={page === currentPage}>next</button>
      </div>
    </>
  );
}

export default App;
