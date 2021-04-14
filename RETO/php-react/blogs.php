<?php

include 'bd/BD.php';
require 'JwtHandler.php';

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');

//Obtención de blogs
if($_SERVER['REQUEST_METHOD']=='GET'){
    if(isset($_GET['id'])){
        $query="select * from blogs where id=".$_GET['id'];
        $resultado=metodoGet($query);
        echo json_encode($resultado->fetch(PDO::FETCH_ASSOC));
    }else{
        $query="select * from blogs";
        $resultado=metodoGet($query);
        echo json_encode($resultado->fetchAll()); 
    }
    header("HTTP/1.1 200 OK");
    exit();
}

//Incersión de un nuevo blog, valida que el titulo no exista
if($_POST['METHOD']=='POST'){
    unset($_POST['METHOD']);
    $flag=false;
    $token=$_POST['token'];
    $token = validarToken($token);
    $tittle=$_POST['tittle'];
    $category=$_POST['category'];
    $description=$_POST['description'];
    $text=$_POST['text'];
    $query="select * from blogs where tittle='$tittle'";
    $resultado=metodoGet($query);
    $tittle_sql = $resultado->fetch(PDO::FETCH_ASSOC)[tittle];

    if (!($tittle_sql == $tittle) and $token){
        $query="insert into blogs(tittle, category_id, description, text, likes) values ('$tittle', '$category', '$description','$text',0)";
        $queryAutoIncrement="select MAX(id) as id from users";
        $resultado=metodoPost($query, $queryAutoIncrement);
        $flag = true;
    }

    echo json_encode($flag);
    header("HTTP/1.1 200 OK");
    exit();
}

//Actualización de un blog
if($_POST['METHOD']=='PUT'){
    unset($_POST['METHOD']);
    $token=$_POST['token'];
    $token = validarToken($token);
    $id=$_GET['id'];
    $tittle=$_POST['tittle'];
    $description=$_POST['description'];
    $text=$_POST['text'];
    $category_id=$_POST['category_id'];
    if($token){
        $query="UPDATE blogs SET tittle='$tittle', description='$description', text='$text', category_id='$category_id' WHERE id='$id'";
        $resultado=metodoPut($query);
    }
    echo json_encode($resultado);
    header("HTTP/1.1 200 OK");
    exit();
}

//Eliminación de un
if($_POST['METHOD']=='DELETE'){
    unset($_POST['METHOD']);
    $token=$_POST['token'];
    $token = validarToken($token);
    $id=$_GET['id'];
    if($token){
        $query="DELETE FROM blogs WHERE id='$id'";
        $resultado=metodoDelete($query);
    }
    echo json_encode($resultado);
    header("HTTP/1.1 200 OK");
    exit();
}

//Actualización de un blog
if($_POST['METHOD']=='LIKE'){
    unset($_POST['METHOD']);
    $token=$_POST['token'];
    $token = validarToken($token);
    $id=$_GET['id'];    
    $likes=$_POST['likes'];
    if($token){
        if($likes == 0){
            $query="UPDATE blogs SET likes=likes-1 WHERE id='$id'";
        }else if($likes == 1){
            $query="UPDATE blogs SET likes=likes+1 WHERE id='$id'";
        }
        $resultado=metodoPut($query);
    }
    echo json_encode($likes);
    header("HTTP/1.1 200 OK");
    exit();
}

header("HTTP/1.1 400 Bad Request");

?>

