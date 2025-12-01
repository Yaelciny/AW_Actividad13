//document.getElementById('btnCerrar').addEventListener("click",cerrarSesion);

function validarUsuario (){
    let usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));

    if (usuarioLogueado === null){
        alert ('Debes iniciar sesión para acceder a este apartado.');
        //lo manda de inmediato a login
            window.location.href = "login.html"; 
    } else {
        //para probar si funciona o no
         console.log("Usuario autenticado:", usuarioLogueado);
         document.getElementById('nombreUsuario').textContent = usuarioLogueado.nombre;
    }
}

//aqui falta asignarlo a un boton q aun no existe
function cerrarSesion (){
    localStorage.removeItem('usuarioLogueado');
    setTimeout(() => {
            window.location.href = "login.html"; 
        }, 1000);
}


document.addEventListener ("DOMContentLoaded",validarUsuario);

