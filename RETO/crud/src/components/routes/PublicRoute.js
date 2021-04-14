import React from 'react'
import { Route, Redirect } from "react-router-dom"

const NotFoundRedirect = () => <Redirect to="/blogs"/>

const PublicRoute = props => {

    const {path, component} = props

    if (localStorage.getItem('TOKEN') === null) {
        return(
            <Route path={path} component={component} />
        )
    }else{
        return(<Route path="/" component={NotFoundRedirect} />)
    }
}

export default PublicRoute