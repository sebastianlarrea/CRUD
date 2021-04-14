import React from 'react'
import { Route, Redirect } from "react-router-dom"

const NotFoundRedirect = () => <Redirect to="/"/>

const PrivateRoute = props => {

    const {path, component} = props

    if (localStorage.getItem('TOKEN') !== null) {
        return(
            <Route path={path} component={component} />
        )
    }else{
        return(<Route path="**" component={NotFoundRedirect} />)
    }

}

export default PrivateRoute