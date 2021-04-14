import React, {useState} from 'react';
import { useHistory } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css'
import './Login.scss'
import axios from 'axios'
import swal from 'sweetalert'

const Login= () => {

    const [userName, setuserName] = useState(null)
    const [userPassword, setuserPassword] = useState(null)
    const history = useHistory();
    
    //Envio de los parametros para loguearse, en caso de que sean correctos el Backend nos retorna el token
    const handleLogin = e => {
        // Eliminación recarga automatica del sitio
        e.preventDefault()
        var data = new FormData()
        data.append("email", userName)
        data.append("password", userPassword)
        data.append("METHOD", "LOGIN")
        axios.post('http://localhost/php-react/users.php', data)
        .then(res=>{
            if(res.data !== null){
                localStorage.setItem('TOKEN', res.data)
                history.push('/')
            }else{
                swal({
                    title: "Error",
                    text: "El usuario y contraseña no coinciden.",
                    icon: "error",
                    buttons: "Ok"
                })
            }
        }).catch(error=>{
          console.log(error)
        })
    }

    return(
        <div className="login">

            <h2>Konecta</h2>

            <form onSubmit={handleLogin}>
                    
                <center><label>Iniciar sesión en nuestro sitio</label></center>

                <div className="form-group mb-2">               
                    <input onChange={(e) => setuserName(e.target.value)} type="email" className="form-control"  placeholder="Username" />
                </div>

                <div className="form-group mb-2">
                    <input onChange={(e) => setuserPassword(e.target.value)} type="password" className="form-control" placeholder="Password" />
                </div>

                <button type="submit" className="btn btn-primary">Ingresar </button>
                <button type="submit" onClick={() => history.push('/register')} className="btn btn-primary">Registrarse </button>

            </form>
        </div>
    )
}

export default Login;