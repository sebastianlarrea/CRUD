import jwt_decode from "jwt-decode";

//Obtención del Email, se decodifica el token y se obtiene el campo role
const getEmail = () => {
    if (localStorage.getItem('TOKEN')){            
        var decoded = jwt_decode(localStorage.getItem('TOKEN'));
        return decoded.data.email
    }
}


export default getEmail