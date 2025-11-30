function validarUsuario (){
    let usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));
    const btnLogin = document.getElementById('btnLogin');

    if (usuarioLogueado === null){
        btnLogin.style.display = "inline-block";
        document.getElementById('nombreUsuario').textContent = '';
    } else {
        btnLogin.style.display ='none';
        document.getElementById('nombreUsuario').textContent = usuarioLogueado.nombre;
    }
}

document.addEventListener ("DOMContentLoaded",validarUsuario);