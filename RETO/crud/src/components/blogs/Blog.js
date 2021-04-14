import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import './Blogs.scss'
import axios from 'axios';
import { useHistory } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as faHeartSolid}  from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'
import getRole from '../../utils/getRole'
import getEmail from '../../utils/getEmail'

const Blog = props => {

    const history = useHistory();
    const {blog, selectItem} = props
    const [rolState, setrolState] = useState(null)
    const [user_id, setUser_id] = useState(null)
    const [hoverLike, sethoverLike] = useState(false)
    const [isLocalLiked, setisLocalLiked] = useState(false)

    const iconLiked = <label className="corazoncito"
        onMouseEnter={()=> sethoverLike(true)} 
        onMouseLeave={()=> sethoverLike(false)}
        onClick={()=> handleClickLike(blog.id)}
    ><FontAwesomeIcon icon={faHeartSolid} /></label>

    const iconUnLiked = <label className="corazoncito"
        onMouseEnter={()=> sethoverLike(true)} 
        onMouseLeave={()=> sethoverLike(false)}
        onClick={()=> handleClickLike()}
    ><FontAwesomeIcon icon={faHeartRegular} /></label>

    const handleClickLike = () => {

        if (isLocalLiked){
            var data = new FormData()
            data.append("token", localStorage.getItem('TOKEN')) 
            var blog_item = JSON.parse(localStorage.getItem('BLOG_LIKES'))
            var blog_item2 = blog_item.filter(item => item.blog_id == blog.id)[0]
            data.append("METHOD", "DELETE")
            axios.post('http://localhost/php-react/articles.php', data, {params: {id: blog_item2.id}})
            .then(res=>{ 
                history.push("/")
            })

            var data = new FormData()
            data.append("token", localStorage.getItem('TOKEN'))
            data.append("likes", 0)
            data.append("METHOD", "LIKE")
            axios.post('http://localhost/php-react/blogs.php', data, {params: {id: blog.id}})
            .then(res=>{ 
                history.push("/")
                console.log(res.data)
            })
        }else{
            var data = new FormData()
            data.append("token", localStorage.getItem('TOKEN'))
            console.log(user_id, blog.id)
            data.append("user_id", user_id)
            data.append("blog_id", blog.id)
            data.append("METHOD", "POST")
            axios.post('http://localhost/php-react/articles.php', data)
            .then(res=>{ 
                history.push("/")
            })

            var data = new FormData()
            data.append("token", localStorage.getItem('TOKEN'))
            data.append("likes", 1)
            data.append("METHOD", "LIKE")
            axios.post('http://localhost/php-react/blogs.php', data, {params: {id: blog.id}})
            .then(res=>{ 
                history.push("/")
                console.log(res.data)
            })
        }
    }

    //Obtencion del role, con este valor se realizan las validaciones
    useEffect(() => {
        var role = getRole()
        setrolState(role)
        var user_id = getEmail()
        setUser_id(user_id)
        axios.get('http://localhost/php-react/articles.php', {params: {id: user_id}})
        .then(res => {
            if (res.status === 200){
                localStorage.setItem('BLOG_LIKES', JSON.stringify(res.data))
                var blog_item = JSON.parse(localStorage.getItem('BLOG_LIKES'))
                if(typeof(blog_item.filter(item => item.blog_id == blog.id)[0]) === "undefined"){
                    setisLocalLiked(false)
                }else{
                    setisLocalLiked(true)
                }
                
            }
        })

    }, [])

    var button1 = ""
    var button2 = ""
    //Se agregan dos botones para que el admin pueda Editar y Eliminar los blogs
    if(rolState === "1"){
        button1 = <button onClick={()=>selectItem(blog, "Editar")} type="submit" className="btn btn-primary">Edit </button> 
        button2 = <button onClick={()=>selectItem(blog, "Eliminar")} type="submit" className="btn btn-primary">Delete </button> 
    }

    return(
        <div className="blog">
            <div className="blog-title"> <label className="label-title title">Title</label> <label>{blog.tittle}</label><label className="label-category">{blog.category_id}</label><label className="label-like">{isLocalLiked || hoverLike ? iconLiked : iconUnLiked} {blog.likes}</label></div>
            <div className="blog-description"><label className="label-title">Description</label><label>{blog.description}</label></div>
            <div className="blog-text"><label className="label-text">{blog.text}</label></div>
            <div className="blog-buttons">
                {button1}
                {button2}
            </div>
        </div>
    )

}


export default Blog;

