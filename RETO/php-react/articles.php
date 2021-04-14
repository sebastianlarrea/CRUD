<?php

include 'bd/BD.php';
require 'JwtHandler.php';

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');

//Consulta de usuarios, se envian los usuarios al front vía http
if($_SERVER['REQUEST_METHOD']=='GET'){
    if(isset($_GET['id'])){
        $id = $_GET['id'];
        $query="select * from likes where user_id='$id' ";
        $resultado=metodoGet($query);
        echo json_encode($resultado->fetchAll());
    }else{
        $query="select * from users";
        $resultado=metodoGet($query);
        echo json_encode($resultado->fetchAll()); 
    }
    header("HTTP/1.1 200 OK");
    exit();
}

//Incersión de usuarios a la base de datos, esta función es llamada en la vista /register
if($_POST['METHOD']=='POST'){
    unset($_POST['METHOD']);
    $user_id=$_POST['user_id'];
    $blog_id=$_POST['blog_id'];
    $token=$_POST['token'];
    $token = validarToken($token);
    if ($token){
        $query="insert into likes(user_id, blog_id) values ('$user_id', '$blog_id')";
        $queryAutoIncrement="select MAX(id) as id from likes";
        $resultado=metodoPost($query, $queryAutoIncrement);
    }

    echo json_encode($resultado);
    header("HTTP/1.1 200 OK");
    exit();
}

//Eliminación de un usuario, se pasa como parametro el id
if($_POST['METHOD']=='DELETE'){
    unset($_POST['METHOD']);
    $token=$_POST['token'];
    $token = validarToken($token);
    $id=$_GET['id'];
    if($token){
        $query="DELETE FROM likes WHERE id='$id'";
        $resultado=metodoDelete($query);
        echo json_encode($resultado);
    }
    header("HTTP/1.1 200 OK");
    exit();
}