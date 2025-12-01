// Objeto de los titulos para traducirlo al español
//Se usa el nombre en ingles de la API
const titulos_es = {
    "Spirited Away": "El viaje de Chihiro",
    "My Neighbor Totoro": "Mi vecino Totoro",
    "Princess Mononoke": "La princesa Mononoke",
    "Kiki's Delivery Service": "Kiki: Entregas a Domicilio",
    "Howl's Moving Castle": "El castillo ambulante",
    "Ponyo": "Ponyo en el acantilado",
    "Castle in the Sky": "El castillo en el cielo",
    "The Tale of Princess Kaguya": "La princesa Kaguya",
    "Grave of the Fireflies": "La tumba de las luciérnagas",
    "The Wind Rises": "Se levanta el viento",
    "Whisper of the Heart": "Susurros del corazón",
    "Only Yesterday": "Recuerdos del ayer",
    "When Marnie Was There": "Cuando Marnie estuvo allí",
    "The Cat Returns": "El regreso del gato",
    "Arrietty": "Arrietty y el mundo de los diminutos",
    "Tales from Earthsea": "Cuentos de Terramar",
    "From Up on Poppy Hill": "La colina de las amapolas"
};

//Funcion para evitar interpretacion de html, solo texto, para evitar errores
function escapar(texto = '') {
    return String(texto)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

async function obtenerPeliculas() {
    const respuesta = await fetch('https://ghibliapi.vercel.app/films');
    const datos = await respuesta.json();
    return datos;
}

//Obtiene imagen mediante el link de la API
function obtenerUrlImagenDesdeApi(pelicula) {
    return pelicula.image; 
}

//Carga peliculas en peliculas.html
function renderizarListadoPeliculas(peliculas) {
    const contenedor = document.getElementById('listaPeliculas');
    if (!contenedor) return;

    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));
    let html = '';
    peliculas.forEach(p => {
        const titulo_romaji = p.original_title_romanised || p.original_title || p.title;
        const titulo_traducido = titulos_es[p.title] || p.title;
        const posterUrl = obtenerUrlImagenDesdeApi(p);
        //Validacion de pelicula favorita - pendiente logica de favoritos
        const esFav = (window.FavoritosGhibli && window.FavoritosGhibli.esFavorita(usuarioLogueado?.email,p.id)) || false;
        const claseEstrella = esFav ? 'bi-star-fill' : 'bi-star';

        html += `
      <div class="card col-md-3 p-0 m-2" style="width: 18rem;">
        <small class="m-2 mx-5 text-end">${escapar(p.rt_score)}</small>
        <img src="${posterUrl}" loading="lazy" class="card-img-top" style="height:300px; object-fit:cover;" alt="${escapar(titulo_romaji)} poster">
        <div class="card-body">
          <h3>${escapar(titulo_romaji)}</h3>
          <h4>${escapar(titulo_traducido)}</h4>
          <p>${escapar(p.description).slice(0, 150)}${p.description.length > 150 ? '…' : ''}</p>
          <div class="d-flex align-items-center justify-content-between">
            <small>${escapar(p.release_date)}</small>
            <i class="btn btn-warning bi ${claseEstrella} p-1 fav-toggle" data-id="${p.id}" title="Marcar favorito"></i>
          </div>
        </div>
      </div>
    `;
    });
    contenedor.innerHTML = html;
    botonFavorito();
}

//Carga de las peliculas destacadas en index.html
function renderizarCarrusel(peliculas) {
    const inner = document.querySelector('#carouselExampleCaptions .carousel-inner');
    if (!inner) return;
    const slides = peliculas.slice(0, 3);
    let html = '';
    slides.forEach((p, idx) => {
        const activo = idx === 0 ? 'active' : '';
        const titulo_romaji = p.original_title_romanised || p.original_title || p.title;
        const titulo_traducido = titulos_es[p.title] || p.title;
        const posterUrl = obtenerUrlImagenDesdeApi(p);

        html += `
      <div class="carousel-item ${activo}">
        <img src="${posterUrl}" loading="lazy" class="d-block w-100" alt="${escapar(titulo_romaji)}">
        <div class="carousel-caption d-none d-md-block">
          <h5>${escapar(titulo_romaji)}</h5>
          <p>${escapar(titulo_traducido)}</p>
        </div>
      </div>
    `;
    });
    inner.innerHTML = html;
}

//para obtener favoritos con validacion
window.FavoritosGhibli = {
    obtenerFavoritosUsuario(email) {
        const favs = JSON.parse(localStorage.getItem('favoritosGhibli')) || {};
        return favs[email] || [];
    },

    //esto valida si ya esta en favoritos
    esFavorita(email, idPeli) {
        const lista = this.obtenerFavoritosUsuario(email);
        return lista.includes(idPeli);
    }
};

//Se cargan las peliculas favoritas en perfil
async function renderizarFavoritosEnPerfil() {
  const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
  const contenedor = document.getElementById('listaFavoritos');
  if (!contenedor) return;

  //Mensaje por si no hay sesion iniciada
  if (!usuario) {
    contenedor.innerHTML = '<p>Debes iniciar sesión para ver tus favoritos.</p>';
    return;
  }

  //Obtener favoritos con validacion
  const favIds = (window.FavoritosGhibli && window.FavoritosGhibli.obtenerFavoritosUsuario(usuario.email)) || [];
  if (!favIds || favIds.length === 0) {
    contenedor.innerHTML = '<p>No tienes películas favoritas aún.</p>';
    return;
  }
  
  const todas = await obtenerPeliculas();
  const favoritas = todas.filter(p => favIds.includes(p.id));

  let html = "";
  favoritas.forEach(p => {
    const titulo_romaji = p.original_title_romanised || p.original_title || p.title;
    const titulo_traducido = titulos_es[p.title] || p.title;
    const posterUrl = obtenerUrlImagenDesdeApi(p);

    html += `
      <div class="col-md-3 mb-4">
        <div class="card h-100">
          <div class="card-imagen-wrapper">
            <img src="${posterUrl}" loading="lazy" class="card-img-top" style="height:300px; object-fit:cover;" alt="${escapar(titulo_romaji)} poster">
            <div class="puntuacion-badge">${escapar(p.rt_score)}</div>
          </div>
          <div class="card-body">
            <h3>${escapar(titulo_romaji)}</h3>
            <h4>${escapar(titulo_traducido)}</h4>
            <p>${escapar(p.description).slice(0,150)}${p.description.length>150?'…':''}</p>
          </div>
          <div class="card-footer bg-transparent border-0 d-flex justify-content-between align-items-center">
            <small class="text-muted">${escapar(p.release_date)}</small>
            <i class="btn btn-warning bi bi-star-fill p-1 fav-toggle" data-id="${p.id}" title="Quitar de favoritos"></i>
          </div>
        </div>
      </div>
    `;
  });

  contenedor.innerHTML = html;
}

//funcion de agregar faoritos
function guardarFavoritos (id){
  const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));

   if (!usuarioLogueado){
    alert ('Debes iniciar sesión para agregar favoritos.');
    return;
   }

    let favoritos = JSON.parse(localStorage.getItem('favoritosGhibli')) || {};
    let favUsuario = favoritos[usuarioLogueado.email] || [];

    if (favUsuario.includes(id)){
      alert('Ya está en favoritos.');
      return;
    }

    favUsuario.push(id);

    //guardamos el favorito
    favoritos[usuarioLogueado.email] = favUsuario
    localStorage.setItem('favoritosGhibli',JSON.stringify(favoritos));
    alert ("Favorito agregado con éxito!");
}

//se lo asignamos al boton
function botonFavorito(){
  const btnFav = document.querySelectorAll(".fav-toggle");

  btnFav.forEach (btn=>{
    btn.addEventListener('click', () => {
    btn.classList.remove('bi-star');
    btn.classList.add('bi-star-fill');
    const id = btn.dataset.id;
    guardarFavoritos(id);
  });
  });
}

document.addEventListener('DOMContentLoaded', async () => {
    const peliculas = await obtenerPeliculas();

    if (document.getElementById('listaPeliculas')) {
        renderizarListadoPeliculas(peliculas);
    }

    if (document.getElementById('carouselExampleCaptions')) {
        renderizarCarrusel(peliculas);
    }

    if (document.getElementById('listaFavoritos')) {
        await renderizarFavoritosEnPerfil();
        // se recarga la vista de favoritos si cambia en otra pagina - pendiente logica de favoritos
        window.addEventListener('favoritos:cambiaron', () => renderizarFavoritosEnPerfil());
    }
});