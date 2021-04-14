import { Switch, Route, Redirect } from "react-router-dom"
import PublicRoute from '../routes/PublicRoute'
import PrivateRoute from '../routes/PrivateRoute'
import Login from '../login/Login'
import Register from '../login/Register'
import Users from '../users/Users'
import Blogs from '../blogs/Blogs'
import WriteBlog from '../blogs/WriteBlog'

const NotFoundRedirect = () => <Redirect to="/"/>

const Routes = () => {

    //Definición de las rutas, se creó un componente para las rutas sin inicio de sesión(Publicas) y otro para las privadas.
    return(
        <Switch>
            <PublicRoute exact path="/" component={Login}/>
            <PublicRoute exact path="/register" component={Register}/>
            <PrivateRoute exact path="/write" component={WriteBlog}/>
            <PrivateRoute exact path="/users" component={Users}/>
            <PrivateRoute exact path="/blogs" component={Blogs}/>
            <Route path="**" component={NotFoundRedirect} />
        </Switch>
    )
}

export default Routes