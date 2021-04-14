import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import './Blogs.scss'
import '../login/Login.scss'
import Blog from './Blog'
import { useHistory } from "react-router-dom"
import axios from 'axios';
import getRole from '../../utils/getRole'
import swal from 'sweetalert'

const Blogs = () => {

    const history = useHistory();
    const [rolState, setrolState] = useState(null)
    const [blogs, setBlogs] = useState([])
    const [modalEditar, setmodalEditar] = useState(false)
    const [modalEliminar, setmodalEliminar] = useState(false)
    const [itemSelected, setitemSelected] = useState({
        tittle: '',
        description: '',
        text: '',
        category_id: '',
    })

    //Abrir y cerrar la ventana modal para editar
    const ocmodalEditar = () =>{
        setmodalEditar(!modalEditar)
    }

    //Abrir y cerrar la ventana modal para eliminar
    const ocmodalEliminar = () =>{
        setmodalEliminar(!modalEliminar)
    }

    //Obtención del rol y los blogs
    useEffect(() => {
        var role = getRole()
        setrolState(role)
        axios.get('http://localhost/php-react/blogs.php')
        .then(res => {
            if (res.status === 200){
                setBlogs(res.data)
            }
        })
    }, [])

    //Esta función se llama cuando estamos en la ventana Editar, con esta se llenan los parametros
    const handleChange = e => {
        const {name, value} = e.target

        setitemSelected((prevState)=>({
            ...prevState,
            [name]: value
        }))
    }

    //Función encargada de abrir/cerrar la ventana para editar o eliminar
    const selectItem=(item, caso)=>{
        setitemSelected(item);
    
        (caso==="Editar")?
        ocmodalEditar():
        ocmodalEliminar()
    }

    //La función es utilizada para actualizar un blog.
    const handleEdit = () => {

        //Se valida que ninguno de los campos se encuentre vacio
        if(itemSelected.tittle === "" || itemSelected.description === "" || itemSelected.text === "" || itemSelected.category_id === ""){
            swal({
                title: "Error",
                text: "No deben haber campos vacios",
                icon: "error",
                buttons: "Ok"
            })
        }
        //Se envian los parametros para la actualización de un blog
        else{
            var data = new FormData()
            data.append("token", localStorage.getItem('TOKEN'))
            data.append("tittle", itemSelected.tittle)
            data.append("description", itemSelected.description)
            data.append("text", itemSelected.text)
            data.append("category_id", itemSelected.category_id)
            data.append("METHOD", "PUT")
            axios.post('http://localhost/php-react/blogs.php', data, {params: {id: itemSelected.id}})
            .then(()=>{
                var new_blogs = blogs 
                new_blogs.map(item => {
                    if(item.id === itemSelected.id){
                        item.tittle = itemSelected.tittle
                        item.description = itemSelected.description
                        item.text = itemSelected.text
                        item.category_id = itemSelected.category_id
                    }
                    setBlogs(new_blogs)
                    ocmodalEditar()
                    history.push("/blogs")

                })
            }).catch(error=>{
              console.log(error)
            })
        }
    }

    //Al llamar esta función se envia una petición para eliminar el blog seleccionado
    const handleDelete = () => {
        var data = new FormData()
        data.append("token", localStorage.getItem('TOKEN')) 
        data.append("METHOD", "DELETE")
        axios.post('http://localhost/php-react/blogs.php', data, {params: {id: itemSelected.id}})
        .then(res=>{ 
            setBlogs(blogs.filter(item=>item.id!==itemSelected.id));
            ocmodalEliminar();
          }).catch(error=>{
            console.log(error);
          })
    }

    var button1 = ""
    var button2 = ""
    //Validación del rol, solo los administradores tienen permisos para ir al cRUD de usuarios o escribir un blog.
    if(rolState === "1"){
        button1 = <button onClick={() => history.push("/users")} type="submit" className="btn btn-primary">Users </button> 
        button2 = <button onClick={() => history.push("/write") } type="submit" className="btn btn-primary">Write blog </button> 
    }

    //Mensaje informativo que solo aparece si no hay blogs creados.
    var info = ""
    if (typeof(blogs[0]) === "undefined"){
        info = <label className="info">No posts.</label>
    }

    const logOut = () => {
        localStorage.removeItem('TOKEN')
        history.push("/")
    }

    return(
        
        <div className="login blogs">
            <div className="header">
                <h2>Konecta</h2>
                <div className="botones">
                    {button1}
                    {button2}
                    <button onClick={() => logOut()} type="submit" className="btn btn-primary">Log out </button>
                </div>
            </div>

            <div className="blogs-list">

            {info}
            {blogs.map(item => {

                return(
                    <Blog selectItem={selectItem} blog={item} key={item.id} />
                )
                })}

            </div>

            <Modal isOpen={modalEditar}>
                        <ModalHeader>Edit blog</ModalHeader>
                        <ModalBody>
                            <div className="form-group">
                                <input type="text" className="form-control" name="tittle" onChange={handleChange} value={itemSelected && itemSelected.tittle} placeholder="Title" required/>
                                <br />
                                <div className="form-group">
                                    <select defaultValue="None" name="category_id" onChange={handleChange} id="inputState" className="form-control select-control">
                                        <option>Choose</option>
                                        <option selected>Developing</option>
                                        <option>Security</option>
                                        <option>Operations</option>
                                    </select>
                                </div>
                                <textarea className="form-control" name="description" onChange={handleChange} value={itemSelected && itemSelected.description} placeholder="Description" required/>
                                <br />
                                <textarea className="form-control" name="text" onChange={handleChange} value={itemSelected && itemSelected.text} placeholder="Text" rows="6" required/>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <button className="btn btn-primary" onClick={()=>handleEdit()}>Edit</button>
                            <button className="btn btn-danger" onClick={()=>ocmodalEditar()}>Cancel</button>
                        </ModalFooter>
                        </Modal>

                        <Modal isOpen={modalEliminar}>
                            <ModalBody>
                            ¿Do you want to delete the blog "{itemSelected && itemSelected.tittle}"?
                            </ModalBody>
                            <ModalFooter>
                            <button className="btn btn-danger" onClick={()=>handleDelete()}>Yes </button>
                            <button className="btn btn-secondary" onClick={()=>ocmodalEliminar()}>No</button>
                            </ModalFooter>
                        </Modal>

        </div>
    )
}

export default Blogs;