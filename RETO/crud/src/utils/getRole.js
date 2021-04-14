import jwt_decode from "jwt-decode";

//Obtención del rol, se decodifica el token y se obtiene el campo role
const getRole = () => {
    if (localStorage.getItem('TOKEN')){            
        var decoded = jwt_decode(localStorage.getItem('TOKEN'));
        return decoded.data.role
    }
}

export default getRole