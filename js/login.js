const form = document.getElementById('formLogin');

class Usuario {
    constructor (nombre, email, password){
        this.nombre = nombre;
        this.email = email;
        this.password = password;
    }
}

function cargarUsuarios (){
    //creamos la lista de usuarios obteniendo desde localStorage
    let lista = JSON.parse(localStorage.getItem('usuarios')) || [];

    //validamos si existe para no crear usuarios infinitamente
    if (lista && lista.length>0){
        return;
    }

    //creamos usuarios para cargarlos en localStorage
    const usuario1 = new Usuario ('Iris Guerrero', "irisalegro@gmail.com","Luneta");
    const usuario2 = new Usuario ('Nat Orozco', "nati@gmail.com","Nati456");
    const usuario3 = new Usuario ('Yael Magdaleno', "yael@gmail.com","Yael123");
    const usuario4 = new Usuario ('Marcos Muñiz', "marcos@gmail.com","Marcos678");

    //se cargan en la lista
    lista = [usuario1, usuario2, usuario3, usuario4];

    //se cargan en localStorage
    localStorage.setItem('usuarios', JSON.stringify(lista));
}

form.addEventListener('submit',function(e){
    e.preventDefault();

    //obtenemos valores de email y password
    let email = document.getElementById('email').value;
    let password = document.getElementById ('password').value;

    //obtenemos lista de usuarios desde localStorage
    let lista = JSON.parse(localStorage.getItem('usuarios')) || [];

    //buscamos si existe el usuario 
    let usuarioCargado = lista.find(u => u.email === email && u.password === password);

    if (usuarioCargado){
        //aqui guardamos al usuario que inicio sesión.
        //servirá para páginas exclusivas de usuariios logueados.
        localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioCargado));
        setTimeout(() => {
            window.location.href = "perfil.html";   // Pendiente de cambiar a donde redirecciona
        }, 1000);
        //para probar
        alert ('Inicio de sesión exitoso');
    } else {
        alert ('Usuarios no Encontrado. Vuelva a Intentar');
    }


});

document.addEventListener ("DOMContentLoaded",cargarUsuarios);
