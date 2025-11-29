//document.getElementById('btnCerrar').addEventListener("click",cerrarSesion);

function validarUsuario (){
    let usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));

    if (usuarioLogueado === null){
        alert ('Debes iniciar sesión para acceder a este apartado.');
         setTimeout(() => {
            window.location.href = "login.html"; 
        }, 1000);
    } else {
        //para probar si funciona o no
         console.log("Usuario autenticado:", usuarioLogueado);
    }
}

function cerrarSesion (){
    localStorage.removeItem('usuarioLogueado');
    setTimeout(() => {
            window.location.href = "login.html"; 
        }, 1000);
}

document.addEventListener ("DOMContentLoaded",validarUsuario);

