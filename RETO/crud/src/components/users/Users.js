import React, {useState, useEffect} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import '../blogs/Blogs.scss'
import { useHistory } from "react-router-dom"
import axios from 'axios'
import swal from 'sweetalert'
import getRole from '../../utils/getRole'

const Users = () => {


    const history = useHistory();
    const [rolState, setrolState] = useState(null)
    const [users, setUsers] = useState([])
    const [modalEditar, setmodalEditar] = useState(false)
    const [modalEliminar, setmodalEliminar] = useState(false)
    const [itemSelected, setitemSelected] = useState({
        nombre: '',
        email: '',
        phone: '',
        pass: '',
        confirmpassword: '',
        rol: ''
    })

    const ocmodalEditar = () =>{
        setmodalEditar(!modalEditar)
    }

    const ocmodalEliminar = () =>{
        setmodalEliminar(!modalEliminar)
    }
    
    const logOut = () => {
        localStorage.removeItem('TOKEN')
        history.push("/")
    }

    //Edición de un usuario
    const handleEdit = () => {

        //Se valida que ninguno de los campos se encuentre vacio
        if(itemSelected.nombre === "" || itemSelected.email === "" || itemSelected.pass === "" || itemSelected.confirmpassword === "" || itemSelected.rol === "" | itemSelected.phone === ""){
            swal({
                title: "Error",
                text: "No deben haber campos vacios",
                icon: "error",
                buttons: "Ok"
            })
        }
        //Si las dos contraseñas ingresadas coinciden y ninguno de los campos se encuentra vacio 
        //se preocede a la actualización del usuario
        else if(itemSelected.pass === itemSelected.confirmpassword){
            var data = new FormData()
            data.append("token", localStorage.getItem('TOKEN'))
            data.append("name", itemSelected.nombre)
            data.append("email", itemSelected.email)
            data.append("password", itemSelected.pass)
            data.append("role", itemSelected.rol)
            data.append("phone", itemSelected.phone)
            data.append("METHOD", "PUT")
            axios.post('http://localhost/php-react/users.php', data, {params: {id: itemSelected.id}})
            .then(()=>{
                var new_users = users 
                new_users.map(item => {
                    if(item.id === itemSelected.id){
                        item.nombre = itemSelected.nombre
                        item.email = itemSelected.email
                        item.pass = itemSelected.pass
                        item.rol = itemSelected.rol
                        item.phone = itemSelected.phone
                    }
                    setUsers(new_users)
                    ocmodalEditar()
                    history.push("/users")

                })
            }).catch(error=>{
              console.log(error)
            })
        }else{
            swal({
                title: "Error",
                text: "Las contraseñas no coinciden",
                icon: "error",
                buttons: "Ok"
            })
        }
    }

    //Eliminación de un usuario, se le envia la id de este como parametro
    const handleDelete = () => {
        var data = new FormData()
        data.append("token", localStorage.getItem('TOKEN'))
        data.append("METHOD", "DELETE")
        axios.post('http://localhost/php-react/users.php', data, {params: {id: itemSelected.id}})
        .then(()=>{
            setUsers(users.filter(item=>item.id!==itemSelected.id));
            ocmodalEliminar();
          }).catch(error=>{
            console.log(error);
          })
    }

    //Obtención del rol para validacicones y extracción de los usuarios para mostrar en pantalla
    useEffect(() => {
        var role = getRole()
        setrolState(role)
        axios.get('http://localhost/php-react/users.php')
        .then(res => {
          if (res.status === 200){
            setUsers(res.data)
          }
        })
    }, [])

    const handleChange = e => {
        const {name, value} = e.target

        setitemSelected((prevState)=>({
            ...prevState,
            [name]: value
        }))
    }

    const selectItem=(item, caso)=>{
        setitemSelected(item);
    
        (caso==="Editar")?
        ocmodalEditar():
        ocmodalEliminar()
    }

    return(

        <>
            {rolState === "1" ?
                <div className="login">

                    <div className="header">
                        <h2>Konecta</h2>
                        <div className="botones">
                            <button onClick={() => history.push("/blogs") } type="submit" className="btn btn-primary">Blogs </button>
                            <button onClick={() => history.push("/write") } type="submit" className="btn btn-primary">Write blog </button>
                            <button onClick={() => logOut()} type="submit" className="btn btn-primary">Log out </button>
                        </div>
                    </div>

                    <div className="user-list">
                    <table className="table">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Phone</th>
                            <th scope="col">Role</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(item => {

                            if(item.rol === "1"){
                                item.rol = "Administrador"
                            }else if(item.rol === "0"){
                                item.rol = "Usuario"
                            }
                            return(
                                <tr key={item.id}>
                                    <td>{item.nombre}</td>
                                    <td>{item.email}</td>
                                    <td>{item.phone}</td>
                                    <td>{item.rol}</td>
                                    <td>  
                                        <button className="btn btn-primary" onClick={()=>selectItem(item, "Editar")}>Edit</button>
                                        <button className="btn btn-danger" onClick={()=>selectItem(item, "Eliminar")}>Delete</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                    </table>

                    <Modal isOpen={modalEditar}>
                        <ModalHeader>Editar usuario</ModalHeader>
                        <ModalBody>
                            <div className="form-group">
                                <input type="text" className="form-control" name="nombre" onChange={handleChange} value={itemSelected && itemSelected.nombre} placeholder="Name" required/>
                                <br />
                                <input type="text" className="form-control" name="email" onChange={handleChange} value={itemSelected && itemSelected.email} placeholder="Email" required/>
                                <br />
                                <input type="password" className="form-control" name="pass" onChange={handleChange} placeholder="Password" required/>
                                <br />
                                <input type="password" className="form-control" name="confirmpassword" onChange={handleChange} placeholder="Confirm password" required/>
                                <br />
                                <input type="text" className="form-control" name="phone" onChange={handleChange} value={itemSelected && itemSelected.phone} placeholder="Phone" required/>
                                <br />
                                <center className="checkboxes">
                                    <div className="form-check form-check-inline">
                                        <input onChange={handleChange} className="form-check-input" type="radio" name="rol" id="inlineRadio1" value="1"/>
                                        <label className="form-check-label">Administrador</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input onChange={handleChange} className="form-check-input" type="radio" name="rol" id="inlineRadio2" value="0"/>
                                        <label className="form-check-label" >Usuario</label>
                                    </div>
                                </center>
                                <br />
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <button className="btn btn-primary" onClick={()=>handleEdit()}>Edit</button>
                            <button className="btn btn-danger" onClick={()=>ocmodalEditar()}>Cancel</button>
                        </ModalFooter>
                        </Modal>

                        <Modal isOpen={modalEliminar}>
                            <ModalBody>
                            ¿Do you want to delete the username {itemSelected && itemSelected.email}?
                            </ModalBody>
                            <ModalFooter>
                            <button className="btn btn-danger" onClick={()=>handleDelete()}>Yes </button>
                            <button className="btn btn-secondary" onClick={()=>ocmodalEliminar()}>No</button>
                            </ModalFooter>
                        </Modal>

                    </div>

                </div>
                :
                rolState === "0" ?
                    history.push("/blogs")
                    :
                    <div></div>
            }
        </>

    )
}

export default Users;