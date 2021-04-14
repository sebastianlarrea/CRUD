import React, {useState} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './Login.scss'
import '../blogs/Blogs.scss'
import { useHistory } from "react-router-dom"
import axios from 'axios'
import swal from 'sweetalert'

const Register= () => {

    const [fullName, setfullName] = useState(null)
    const [userName, setuserName] = useState(null)
    const [userPassword, setuserPassword] = useState(null)
    const [confirmPassword, setconfirmPassword] = useState(null)
    const [phone, setPhone] = useState(0)
    const history = useHistory()

    //Envio de parametros para insertar un nuevo usuario en la base de datos
    const handleRegister = e => {
        // Eliminación recarga automatica del sitio
        e.preventDefault()

        if(userPassword.length < 8){
            swal({
                title: "Error",
                text: "La contraseña debe contar con 8 o más caracteres.",
                icon: "error",
                buttons: "Ok"
            })
        }else if(phone.length !== 10){
            swal({
                title: "Error",
                text: "Los números de celular son de 10 digitos.",
                icon: "error",
                buttons: "Ok"
            })
        }else if(userPassword === confirmPassword){
            var data = new FormData()
            data.append("token", localStorage.getItem('TOKEN'))
            data.append("name", fullName)
            data.append("email", userName)
            data.append("password", userPassword)
            data.append("role", "0")
            data.append("phone", phone)
            data.append("METHOD", "POST")
            axios.post('http://localhost/php-react/users.php', data)
            .then(res=>{
                if(res.data){
                    swal({
                        title: "Exitoso",
                        text: "El usuario ha sido registrado correctamente.",
                        icon: "success",
                        buttons: "Ok"
                    }).then(() => {
                        history.push("/blogs")
                })
              }else{
                swal({
                    title: "Error",
                    text: "El usuario ya se encuentra registrado en nuestro sistema.",
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
                text: "Las contraseñas no coinciden",
                icon: "error",
                buttons: "Ok"
            })
        }
    }
    return(

        <div className="login">

            <h2>Konecta</h2>

            <form onSubmit={handleRegister}>
                    
                <center><label>Creat a new user</label></center>

                <div className="form-group mb-2">               
                    <input onChange={(e) => setfullName(e.target.value)} type="text" className="form-control"  placeholder="Full name" required/>
                </div>

                <div className="form-group mb-2">               
                    <input onChange={(e) => setuserName(e.target.value)} type="email" className="form-control"  placeholder="Email" required/>
                </div>

                <div className="form-group mb-2">
                    <input onChange={(e) => setuserPassword(e.target.value)} type="password" className="form-control" placeholder="Password" required/>
                </div>

                <div className="form-group mb-2">
                    <input onChange={(e) => setconfirmPassword(e.target.value)} type="password" className="form-control" placeholder="Confirm password" required/>
                </div>

                <div className="form-group mb-2">               
                    <input onChange={(e) => setPhone(e.target.value)} type="number" className="form-control"  placeholder="Phone" required/>
                </div>

                <button type="submit" className="btn btn-primary">Registrarse </button>
                <button type="submit" onClick={() => history.push('/')} className="btn btn-primary">Ingresar</button>

            </form>
        </div>


    )
}

export default Register;