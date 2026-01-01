const $ = id => document.getElementById(id);

let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
let usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));
let addons = JSON.parse(localStorage.getItem("addons")) || [];

function mostrarPantalla(id) {
  ["pantallaLogin", "pantallaPrincipal", "pantallaPublicar", "pantallaPerfil"]
    .forEach(p => $(p).style.display = "none");
  $(id).style.display = "block";
}

function actualizarPerfil() {
  if (!usuarioActual) return;
  $("avatarPerfil").src = usuarioActual.foto;
  $("nombreUsuario").textContent = usuarioActual.nombre;
}

$("registroBtn").onclick = () => {
  const nombre = $("regNombre").value;
  const pass = $("regPassword").value;
  const foto = $("regFoto").files[0];
  if (!nombre || !pass || !foto) return alert("Completa todo");

  const reader = new FileReader();
  reader.onload = () => {
    usuarioActual = { nombre, password: pass, foto: reader.result };
    usuarios.push(usuarioActual);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    localStorage.setItem("usuarioActual", JSON.stringify(usuarioActual));
    actualizarPerfil();
    mostrarPantalla("pantallaPrincipal");
    cargarAddons();
  };
  reader.readAsDataURL(foto);
};

$("loginBtn").onclick = () => {
  const u = usuarios.find(x =>
    x.nombre === $("logNombre").value &&
    x.password === $("logPassword").value
  );
  if (!u) return alert("Datos incorrectos");
  usuarioActual = u;
  localStorage.setItem("usuarioActual", JSON.stringify(u));
  actualizarPerfil();
  mostrarPantalla("pantallaPrincipal");
  cargarAddons();
};

$("btnPublicar").onclick = () => {
  const img = $("imagen").files[0];
  const file = $("archivoAddon").files[0];
  if (!img || !file) return alert("Faltan archivos");

  const r1 = new FileReader();
  const r2 = new FileReader();

  r1.onload = () => {
    r2.onload = () => {
      addons.push({
        id: Date.now(),
        titulo: $("titulo").value,
        categoria: $("categoria").value,
        descripcion: $("descripcion").value,
        imagen: r1.result,
        archivo: r2.result,
        autor: usuarioActual.nombre
      });
      localStorage.setItem("addons", JSON.stringify(addons));
      mostrarPantalla("pantallaPrincipal");
      cargarAddons();
    };
    r2.readAsDataURL(file);
  };
  r1.readAsDataURL(img);
};

function cargarAddons() {
  $("cards").innerHTML = "";
  addons.forEach(a => {
    $("cards").innerHTML += `
      <div class="card">
        <img src="${a.imagen}">
        <h3>${a.titulo}</h3>
        <p>${a.descripcion || ""}</p>
        <p>Autor: ${a.autor}</p>
        <a href="${a.archivo}" download>Descargar</a>
      </div>`;
  });
}

function cerrarSesion() {
  localStorage.removeItem("usuarioActual");
  usuarioActual = null;
  mostrarPantalla("pantallaLogin");
}

if (usuarioActual) {
  mostrarPantalla("pantallaPrincipal");
  actualizarPerfil();
  cargarAddons();
}