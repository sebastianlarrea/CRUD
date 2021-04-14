import React, {useState, useEffect} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../blogs/Blogs.scss'
import '../login/Login.scss'
import { useHistory } from "react-router-dom"
import axios from 'axios'
import swal from 'sweetalert'
import getRole from '../../utils/getRole'

const WriteBlog= () => {

    const [tittle, setTittle] = useState(null)
    const [category, setCategory] = useState(null)
    const [description, setDescription] = useState(null)
    const [text, setText] = useState(null)
    const history = useHistory()

    const [rolState, setrolState] = useState(null)

    const logOut = () => {
        localStorage.removeItem('TOKEN')
        history.push("/")
    }

    //Obtencion del rol, solo el administrador tiene acceso a este sitio
    useEffect(() => {
        var role = getRole()
        setrolState(role)
    }, [])

    //Envio de parametros para escribir un nuevo blog
    const handleRegister = e => {
        // Eliminación recarga automatica del sitio
        e.preventDefault()

        if(category !== "Choose"){
            var data = new FormData()
            data.append("token", localStorage.getItem('TOKEN'))
            data.append("tittle", tittle)
            data.append("category", category)
            data.append("description", description)
            data.append("text", text)
            data.append("METHOD", "POST")
            axios.post('http://localhost/php-react/blogs.php', data)
            .then(res=>{
                console.log(res.data)
                if(res.data){
                    swal({
                        title: "Exitoso",
                        text: "El blog ha sido creado correctamente.",
                        icon: "success",
                        buttons: "Ok"
                    })
                    history.push("/blogs")
                }else{
                    swal({
                        title: "Error",
                        text: "El titulo del blog ya existe.",
                        icon: "error",
                        buttons: "Ok"
                    })
                }
            }).catch(error=>{
              console.log(error)
            })
        }else{
            swal({
                title: "Error",
                text: "Ingrese una categoria valida.",
                icon: "error",
                buttons: "Ok"
            })
        }
    }

    return(
        //Validación del rol
        <>
            
            {rolState === "1" ?
                <div className="login">

                    <div className="header">
                        <h2>Konecta</h2>
                        <div className="botones">
                            <button onClick={() => history.push("/users") } type="submit" className="btn btn-primary">Users</button> 
                            <button onClick={() => history.push("/blog") } type="submit" className="btn btn-primary">Blogs </button>
                            <button onClick={() => logOut()} type="submit" className="btn btn-primary">Log out </button>
                        </div>
                    </div>
        
                    <form onSubmit={handleRegister} className="form-register">
                            
                        <center><label>Write a new blog</label></center>
        
                        <div className="form-group mb-2">               
                            <input onChange={(e) => setTittle(e.target.value)} type="text" className="form-control"  placeholder="Title" required/>
                        </div>
        
                        <div className="form-group">
                            <select defaultValue="None" onChange={(e) => setCategory(e.target.value)} id="inputState" className="form-control select-control">
                                <option>Choose</option>
                                <option selected>Developing</option>
                                <option>Security</option>
                                <option>Operations</option>
                            </select>
                        </div>
        
                        <div className="form-group mb-2">
                        <textarea onChange={(e) => setDescription(e.target.value)} className="form-control" placeholder="Description" rows="2"></textarea>
                        </div>
        
                        <div className="form-group">
                            <textarea onChange={(e) => setText(e.target.value)} className="form-control" id="exampleFormControlTextarea1" rows="5"></textarea>
                        </div>
        
                        <button type="submit" className="btn btn-primary">Save</button>
        
                    </form>
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

export default WriteBlog


