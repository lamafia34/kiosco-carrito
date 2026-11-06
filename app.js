// Lista fija de productos del kiosco.
var productos = [
  { nombre: "Alfajor", precio: 500 },
  { nombre: "Agua", precio: 800 },
  { nombre: "Gaseosa", precio: 1200 },
  { nombre: "Café", precio: 900 },
  { nombre: "Chipá", precio: 700 },
  { nombre: "Chocolate", precio: 1500 }
];

// Cada fila del carrito guarda el producto, su precio y la cantidad.
var carrito = [];

function formatearPeso(numero) {
  return "$ " + numero.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function mostrarAviso(texto, esOk) {
  var aviso = document.getElementById("aviso");
  aviso.textContent = texto;
  aviso.className = esOk ? "aviso ok" : "aviso";
}

function cargarProductos() {
  var select = document.getElementById("producto");

  for (var i = 0; i < productos.length; i++) {
    var opcion = document.createElement("option");
    opcion.value = i;
    opcion.textContent = productos[i].nombre + " — " + formatearPeso(productos[i].precio);
    select.appendChild(opcion);
  }
}

function dibujarCarrito() {
  var filas = document.getElementById("filas");
  filas.innerHTML = "";

  if (carrito.length === 0) {
    var filaVacia = document.createElement("tr");
    filaVacia.className = "fila-vacia";
    var celdaVacia = document.createElement("td");
    celdaVacia.colSpan = 4;
    celdaVacia.textContent = "Todavía no agregaste productos.";
    filaVacia.appendChild(celdaVacia);
    filas.appendChild(filaVacia);
    document.getElementById("total").textContent = formatearPeso(0);
    return;
  }

  var total = 0;

  for (var i = 0; i < carrito.length; i++) {
    var item = carrito[i];
    var subtotal = item.precio * item.cantidad;
    total = total + subtotal;

    var fila = document.createElement("tr");

    var celdaNombre = document.createElement("td");
    celdaNombre.textContent = item.nombre;

    var celdaCantidad = document.createElement("td");
    celdaCantidad.className = "num";
    celdaCantidad.textContent = item.cantidad;

    var celdaPrecio = document.createElement("td");
    celdaPrecio.className = "num";
    celdaPrecio.textContent = formatearPeso(item.precio);

    var celdaSubtotal = document.createElement("td");
    celdaSubtotal.className = "num";
    celdaSubtotal.textContent = formatearPeso(subtotal);

    fila.appendChild(celdaNombre);
    fila.appendChild(celdaCantidad);
    fila.appendChild(celdaPrecio);
    fila.appendChild(celdaSubtotal);
    filas.appendChild(fila);
  }

  document.getElementById("total").textContent = formatearPeso(total);
}

function agregarAlCarrito() {
  var select = document.getElementById("producto");
  var inputCantidad = document.getElementById("cantidad");
  var producto = productos[Number(select.value)];
  var cantidad = Number(inputCantidad.value);

  if (inputCantidad.value.trim() === "" || !Number.isInteger(cantidad) || cantidad <= 0) {
    mostrarAviso("Escribí una cantidad mayor a 0 para agregar el producto.", false);
    inputCantidad.focus();
    return;
  }

  var enCarrito = null;

  for (var i = 0; i < carrito.length; i++) {
    if (carrito[i].nombre === producto.nombre) {
      enCarrito = carrito[i];
    }
  }

  if (enCarrito === null) {
    carrito.push({ nombre: producto.nombre, precio: producto.precio, cantidad: cantidad });
  } else {
    enCarrito.cantidad = enCarrito.cantidad + cantidad;
  }

  mostrarAviso("Agregaste " + cantidad + " × " + producto.nombre + ".", true);
  inputCantidad.value = "1";
  dibujarCarrito();
}

function construirLinea(detalle, importe, esTotal) {
  var linea = document.createElement("div");
  linea.className = esTotal ? "linea total-linea" : "linea";

  var texto = document.createElement("span");
  texto.className = "detalle";
  texto.textContent = detalle;

  var monto = document.createElement("span");
  monto.textContent = importe;

  linea.appendChild(texto);
  linea.appendChild(monto);
  return linea;
}

function imprimirTicket() {
  if (carrito.length === 0) {
    mostrarAviso("Agregá al menos un producto para imprimir el ticket.", false);
    return;
  }

  var ticket = document.getElementById("ticket");
  ticket.innerHTML = "";

  var titulo = document.createElement("h2");
  titulo.textContent = "Kiosco";
  ticket.appendChild(titulo);

  var fecha = document.createElement("p");
  fecha.className = "fecha";
  fecha.textContent = new Date().toLocaleString("es-AR");
  ticket.appendChild(fecha);

  ticket.appendChild(document.createElement("hr"));

  var total = 0;

  for (var i = 0; i < carrito.length; i++) {
    var item = carrito[i];
    var subtotal = item.precio * item.cantidad;
    total = total + subtotal;
    ticket.appendChild(
      construirLinea(item.cantidad + " × " + item.nombre, formatearPeso(subtotal), false)
    );
  }

  ticket.appendChild(document.createElement("hr"));
  ticket.appendChild(construirLinea("TOTAL", formatearPeso(total), true));

  var gracias = document.createElement("p");
  gracias.className = "gracias";
  gracias.textContent = "¡Gracias por su compra!";
  ticket.appendChild(gracias);

  window.print();
}

function vaciarCarrito() {
  carrito = [];
  document.getElementById("cantidad").value = "1";
  mostrarAviso("El carrito quedó vacío.", true);
  dibujarCarrito();
}

cargarProductos();
dibujarCarrito();

document.getElementById("agregar").addEventListener("click", agregarAlCarrito);
document.getElementById("vaciar").addEventListener("click", vaciarCarrito);
document.getElementById("imprimir").addEventListener("click", imprimirTicket);

document.getElementById("cantidad").addEventListener("keydown", function (evento) {
  if (evento.key === "Enter") {
    agregarAlCarrito();
  }
});
