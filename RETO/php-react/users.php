<?php

include 'bd/BD.php';
require 'JwtHandler.php';

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');

//Consulta de usuarios, se envian los usuarios al front vía http
if($_SERVER['REQUEST_METHOD']=='GET'){
    if(isset($_GET['id'])){
        $query="select * from users where id=".$_GET['id'];
        $resultado=metodoGet($query);
        echo json_encode($resultado->fetch(PDO::FETCH_ASSOC));
    }else{
        $query="select * from users";
        $resultado=metodoGet($query);
        echo json_encode($resultado->fetchAll()); 
    }
    header("HTTP/1.1 200 OK");
    exit();
}

//Validación de inicio de sesión, se crea el Token y se envia al Front
if($_POST['METHOD']=='LOGIN'){

    unset($_POST['METHOD']);
    $email = $_POST['email'];
    $query="select * from users where email='$email'";
    $resultado=metodoGet($query);
    $resultado = $resultado->fetch(PDO::FETCH_ASSOC);
    $password = md5($_POST['password']);
    $pass_sql = $resultado[pass];
    $role = $resultado[rol];
    $id = $resultado[id];
    if($pass_sql == $password){

        $jwt = new JwtHandler();

        $token = $jwt->_jwt_encode_data(
            'http://localhost/php-react/users.php',
            array("email"=>$email,"id"=>$id, "role"=>$role)
        );
    }

    echo json_encode($token);
    header("HTTP/1.1 200 OK");
    exit();
}

//Incersión de usuarios a la base de datos, esta función es llamada en la vista /register
if($_POST['METHOD']=='POST'){
    unset($_POST['METHOD']);
    $flag=false;
    $name=$_POST['name'];
    $email=$_POST['email'];
    $pass=md5($_POST['password']);
    $role=$_POST['role'];
    $phone=$_POST['phone'];
    $query="select email from users where email='$email'";
    $resultado=metodoGet($query);
    $email_sql = $resultado->fetch(PDO::FETCH_ASSOC)[email];

    if (!($email_sql == $email)){
        $query="insert into users(nombre, email, pass, rol, phone) values ('$name', '$email', '$pass','$role','$phone')";
        $queryAutoIncrement="select MAX(id) as id from users";
        $resultado=metodoPost($query, $queryAutoIncrement);
        $flag = true;
    }

    echo json_encode($flag);
    header("HTTP/1.1 200 OK");
    exit();
}

//Modificación de un usuario
if($_POST['METHOD']=='PUT'){
    unset($_POST['METHOD']);
    $token=$_POST['token'];
    $token = validarToken($token);
    $id=$_GET['id'];
    $name=$_POST['name'];
    $email=$_POST['email'];
    $pass=md5($_POST['password']);
    $phone=$_POST['phone'];
    $role=$_POST['role'];
    if ($token){
        $query="UPDATE users SET nombre='$name', email='$email', pass='$pass', phone='$phone', rol='$role' WHERE id='$id'";
        $resultado=metodoPut($query);
        echo json_encode($resultado);
    }
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
        $query="DELETE FROM users WHERE id='$id'";
        $resultado=metodoDelete($query);
        echo json_encode($resultado);
    }
    header("HTTP/1.1 200 OK");
    exit();
}

header("HTTP/1.1 400 Bad Request");

?>

