///////////////// ARRAYS Y CARGA JSON MEDIANTE FETCH /////////////////////////
let visualizadorHabArray = [];
let visualizadorAgrArray = [];
let carritoArray = [];
let carritoAgregados = [];

fetch("../js/items.json")
    .then(response => response.json())
    .then(data => {
        visualizadorHabArray = data;
        cargaVisualizador(visualizadorHabArray);
    })

fetch("../js/agregados.json")
    .then(response => response.json(visualizadorAgrArray))
    .then(data => {
        visualizadorAgrArray = data;
    })

//////////////////////// DOM - CARGA DE ITEMS //////////////////////////
window.addEventListener("DOMContentLoaded", () => {
    carritoArray = carritoArray = JSON.parse(localStorage.getItem("carritoArray")) || [];
    chequeosTextos();
})

//////////////////////// SELECTORES QUERYS //////////////////////////
const visualizadorHabitaciones = document.querySelector(".visualizadorHab");
const seleccionHabitacion = document.querySelectorAll(".botonHab");
const tituloParaHabitaciones = document.querySelector("#tituloHab");
let botonSeleccionado = document.querySelectorAll(".claseBotonSeleccionado");
const visualizadorCarrito = document.querySelector(".visualizadorCarrito");
const visualizadorCarritoAgr = document.querySelector("#visualizadorCarritoAgr");
const textoReserva = document.querySelector(".textoReserva");
const reservas = document.querySelector(".reservas");
const checkout = document.querySelector(".checkout");
const vaciarHab = document.querySelector("#vaciar");
const vaciarAgr = document.querySelector("#vaciarAgr");
const checkOutFinal = document.querySelector("#checkOutFinal");

/////////////// CARGAR HABITACIONES AL DIV EN RESERVAS.HTML //////////////
function cargaVisualizador(tipoHabSeleccionada) {
    visualizadorHabitaciones.innerHTML = '';
    tipoHabSeleccionada.forEach(elementos => {
        const div = document.createElement("div");
        div.classList.add("col-lg-6", "col-md-6", "col-sm-12", "text-center");
        div.innerHTML = `
        <div id="tarjetasHab" class="card">
            <img src="${elementos.foto}" alt=""/>
                <div class="card-body">
                    <h2>${elementos.nombre}</h2>
                    <p>Cama: ${elementos.cama}</p>
                    <p>Capacidad (personas): ${elementos.capacidad}</p>
                    <p>Size: ${elementos.metraje} m²</p>
                    <p>Precio: U$S ${elementos.precio}</p>
                    <button name="tarjetas" id= "${elementos.id}" class="col-12 mx-auto buttonForm botonHab claseBotonSeleccionado">Seleccionar</button>
                </div>
        </div>
        `;
        visualizadorHabitaciones.append(div);
    })
    funcionHabSeleccionar();
    botonesAgregados();
}

////////////// MOSTRAR TIPO HABITACIONES SEGUN CATEGORIA //////////////
seleccionHabitacion.forEach(botonTipoHab => {
    botonTipoHab.addEventListener("click", (e) => {
        // RELLENA BACKGROUND DE COLOR EL BTN ACTIVADO
        seleccionHabitacion.forEach(botonTipoHab => botonTipoHab.classList.remove("btnHabActivo"));
        e.currentTarget.classList.add("btnHabActivo");
        // FILTRO TIPO DE HABITACION MEDIANTE IF
        if (e.currentTarget.id != "Total") {
            if (e.currentTarget.id === "Lago") {
                tituloParaHabitaciones.innerText = "Habitaciones del Lago";
                const filtroTipoHab = visualizadorHabArray.filter(habitacion => habitacion.tipoHabitacion === e.currentTarget.id)
                cargaVisualizador(filtroTipoHab);
            } else if (e.currentTarget.id === "Jardin") {
                tituloParaHabitaciones.innerText = "Habitaciones del Jardin";
                const filtroTipoHab = visualizadorHabArray.filter(habitacion => habitacion.tipoHabitacion === e.currentTarget.id)
                cargaVisualizador(filtroTipoHab);
            }
        } else {
            tituloParaHabitaciones.innerText = "Todas las Habitaciones";
            cargaVisualizador(visualizadorHabArray);
        }
    })
});

///////////////// FUNCION DE BOTON HABITACION SELECCIONADA (sumar al carrito) //////////////
function funcionHabSeleccionar() {
    botonSeleccionado = document.querySelectorAll(".claseBotonSeleccionado");
    botonSeleccionado.forEach(boton => {
        boton.addEventListener("click", sumarAlCarrito);
    })
}

///////////////// FUNCION PARA SUMAR ITEMS AL CARRITO //////////////////
function sumarAlCarrito(e) {
    const idHab = e.currentTarget.id;
    const habSeleccionada = visualizadorHabArray.find(habitacion => habitacion.id == idHab)
    if (carritoArray != 0) {
        avisoHabYaSeleccionada();
    } else {
        Toastify({
            text: "Agregado al carrito",
            duration: 2500,
            destination: "../pages/checkout.html",
            newWindow: true,
            close: false,
            gravity: "down",
            position: "right",
            stopOnFocus: true,
            style: {
                borderRadius: "0.8rem",
                background: "linear-gradient(to top, #91e8c1, #69e1ab)",
            },
            onClick: function () { }
        }).showToast();
        carritoArray.push(habSeleccionada);
        localStorage.setItem("carritoArray", JSON.stringify(carritoArray));
    }
}

///////////////// CARGAR ITEMS AL CARRITO //////////////////
function crearCheckout() {
    visualizadorCarrito.innerHTML = '';
    carritoArray.forEach(elementos => {
        let div = document.createElement('div');
        div.classList.add("rowItemIndividual");
        div.innerHTML = `
                            <div class="cadaItem">
                                <img src="${elementos.foto}" alt=""/>                        
                            </div>
                            <div class="cadaItem">
                                <small>Habitación</small>
                                <strong>${elementos.nombre}</strong>
                            </div>
                            <div class="cadaItem">
                                <small>Cama</small>
                                <p>${elementos.cama}</p>
                            </div>
                            <div class="cadaItem">
                                <small>Personas</small>
                                <p>${elementos.capacidad}</p>
                            </div>
                            <div class="cadaItem">
                                <small>Tamaño</small>
                                <p>${elementos.metraje} m²</p>
                            </div>
                            <div class="cadaItem">
                                <small>Precio</small>
                                <p>U$S ${elementos.precio}</p>
                            </div>
                            <div class="cadaItem eliminarItemCarritoContenedor">
                                <button id="${elementos.id}" class="col-12 mx-auto buttonForm botonHab eliminarItemCarrito">Eliminar</button>
                            </div>
                        `;
        visualizadorCarrito.append(div);
        const quitarItem = document.querySelectorAll(".eliminarItemCarrito");
        quitarItem.forEach((button) => {
            button.addEventListener("click", eliminar);
        });
    });
};

function crearAgregados() {
    carritoAgregados = JSON.parse(localStorage.getItem("carritoAgregados"))
    visualizadorCarritoAgr.innerHTML = '';
    carritoAgregados.forEach(agregado => {
        let div = document.createElement('div');
        div.classList.add("rowItemIndividual");
        div.innerHTML = `                            
                            <div class="col-2 cadaItem">
                                <small>Código</small>
                                <strong>${agregado.id}</strong>
                            </div>
                            <div class="col-4 cadaItem">
                                <small>Tipo</small>
                                <strong>${agregado.nombre}</strong>
                            </div>
                            <div class="col-5 cadaItem">
                                <small>Precio</small>
                                <p>U$S ${agregado.precio}</p>
                            </div>
                            <div class="col-1 cadaItem eliminarItemCarritoContenedor">
                                <button id="${agregado.id}" class="col-12 mx-auto buttonForm botonHab eliminarItemCarritoAgr"><img src="../images/trash.png"></button>
                            </div>                        
                        `
        visualizadorCarritoAgr.append(div);
        const quitarItemAgr = document.querySelectorAll(".eliminarItemCarritoAgr");
        quitarItemAgr.forEach((button) => {
            button.addEventListener("click", eliminarAgr);
        });
    })
}

///////////////// FUNCION DE BOTONES AGREGADOS //////////////
function botonesAgregados() {
    boton = document.querySelectorAll(".botonAg");
    boton.forEach(boton => {
        boton.addEventListener("click", sumarAgregado);
    })
}

///////////////// FUNCION AGREGAR AGREGADOS //////////////
function sumarAgregado(e) {
    if (carritoArray.length == 0) {
        avisoPrimeroHab();
    } else {
        carritoAgregados = JSON.parse(localStorage.getItem("carritoAgregados"));
        const idBotonAgr = e.currentTarget.id;
        const agregadoSeleccionado = visualizadorAgrArray.find(agregado => agregado.id == idBotonAgr)
        if (carritoAgregados.some(agregado => agregado.id == idBotonAgr)) {
            avisoAgYaSeleccionado();
        } else {
            agregadoAviso();
            carritoAgregados.push(agregadoSeleccionado)
            localStorage.setItem("carritoAgregados", JSON.stringify(carritoAgregados));
        }
    }
}

///////////// ELIMINAR HAB DE CARRITO ////////////
function eliminar(e) {
    const itemEliminar = e.target.closest(".eliminarItemCarrito").getAttribute("id");
    carritoArray = carritoArray.filter((impresion) => impresion.id != itemEliminar);
    const carro = JSON.stringify(carritoArray);
    localStorage.setItem("carritoArray", carro);
    Toastify({
        text: "Eliminado",
        duration: 2500,
        newWindow: true,
        close: false,
        gravity: "down",
        position: "right",
        stopOnFocus: true,
        style: {
            borderRadius: "0.8rem",
            background: "linear-gradient(to top, #91e8c1, #69e1ab)",
        },
        onClick: function () { }
    }).showToast();
    chequeosTextos();
}

///////////// ELIMINAR AGREGADO DE CARRITO ////////////
function eliminarAgr(e) {
    const itemEliminarAgr = e.target.closest(".eliminarItemCarritoAgr").getAttribute("id");
    carritoAgregados = carritoAgregados.filter((agregado) => agregado.id != itemEliminarAgr);
    const carroAgr = JSON.stringify(carritoAgregados);
    localStorage.setItem("carritoAgregados", carroAgr);
    Toastify({
        text: "Eliminado",
        duration: 2500,
        newWindow: true,
        close: false,
        gravity: "down",
        position: "right",
        stopOnFocus: true,
        style: {
            borderRadius: "0.8rem",
            background: "linear-gradient(to top, #91e8c1, #69e1ab)",
        },
        onClick: function () { }
    }).showToast();
    chequeosTextos();
}

///////////// VACIADO TOTAL HABITACION ////////////
vaciarHab.addEventListener("click", avisoVaciado)
function vaciarCarrito() {
    carritoArray.length = 0;
    localStorage.setItem("carritoArray", JSON.stringify(carritoArray));
    carritoAgregados.length = 0;
    localStorage.setItem("carritoAgregados", JSON.stringify(carritoAgregados));
    chequeosTextos()
}

///////////// SWEET ALERTS ////////////

// AVISO VACIADO
function avisoVaciado() {
    if (carritoArray.length !== 0) {
        Swal.fire({
            title: '¿Desea eliminar su reserva?',
            text: 'ATENCIÓN: El vaciado de su carrito es permanente',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#06563b',
            cancelButtonColor: '#01301b',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Eliminado',
                    text: 'Su carrito ha sido vaciado por completo',
                    icon: 'success',
                    confirmButtonColor: '#06563b',
                    confirmButtonText: 'Aceptar'
                })
                vaciarCarrito();
            }
        })
    } else {
        avisoVaciadoError();
    }
}

// AVISO VACIADO ERROR
function avisoVaciadoError() {
    Swal.fire({
        title: 'Error',
        text: 'ATENCIÓN: Su carrito se encuentra vacío',
        icon: 'warning',
        confirmButtonColor: '#06563b',
        confirmButtonText: 'Aceptar'
    })
}

// AVISO HABITACION YA SELECCIONADA
function avisoHabYaSeleccionada() {
    Swal.fire({
        title: 'Error',
        text: 'ATENCIÓN: Ya eligió Habitación',
        icon: 'warning',
        confirmButtonColor: '#06563b',
        confirmButtonText: 'Aceptar'
    })
}

// AVISO AGREGADO YA SELECCIONADO
function avisoAgYaSeleccionado() {
    Swal.fire({
        title: 'Error',
        text: 'ATENCIÓN: Agregado ya seleccionado',
        icon: 'warning',
        confirmButtonColor: '#06563b',
        confirmButtonText: 'Aceptar'
    })
}

// AVISO PRIMERO ELEGIR HABITACION
function avisoPrimeroHab() {
    Swal.fire({
        title: 'Error',
        text: 'ATENCIÓN: Primero elija su Habitación',
        icon: 'warning',
        confirmButtonColor: '#06563b',
        confirmButtonText: 'Aceptar'
    })
}

// AVISO AGREGADO SUMADO
function agregadoAviso() {
    Toastify({
        text: "Agregado al carrito",
        duration: 2500,
        destination: "../pages/checkout.html",
        newWindow: true,
        close: false,
        gravity: "down",
        position: "right",
        stopOnFocus: true,
        style: {
            borderRadius: "0.8rem",
            background: "linear-gradient(to top, #91e8c1, #69e1ab)",
        },
        onClick: function () { }
    }).showToast();
}

///////////// CONSULTA PARA APLICAR TEXTOS ////////////
function chequeosTextos() {
    ///////// PARA HTML CHECK-OUT
    if (checkout) {
        let contenidoCarrito = JSON.parse(localStorage.getItem("carritoArray"))
        if (contenidoCarrito != 0) {
            textoReserva.innerHTML = "Detalles de su reserva";
        } else {
            textoReserva.innerHTML = "Su carrito está vacío";
        }
        crearCheckout();
        crearAgregados();
    }
    ///////// PARA HTML RESERVAS
    if (reservas) {
        cargaVisualizador(visualizadorHabArray);
    }
}

///////////////// FUNCION EMITIR FACTURA FINAL EN SWAL //////////////
checkOutFinal.addEventListener("click", facturaFinal);

function facturaFinal() {
    if (carritoArray.length !== 0) {
        let contenidoCarritoAg = JSON.parse(localStorage.getItem("carritoAgregados"))
        const facturaHab = carritoArray.reduce((acumulador, precioItem) => acumulador + (precioItem.precio), 0);
        const facturaAgr = contenidoCarritoAg.reduce((acumuladorAgr, precioAgr) => acumuladorAgr + (precioAgr.precio), 0);
        const facturaTotal = ((facturaHab + facturaAgr) * 1.22).toFixed(2)
        Swal.fire({
            title: 'Factura emitida :)',
            html: 'Habitación: U$S ' + facturaHab + '<br><br>Agregados: U$S ' + facturaAgr + '<br><br>Total: U$S ' + facturaTotal + ' IVA INC.<br><br><br>: : :  Hotel Relax - Punta del Este  : : :',
            imageUrl: '../images/logo hotel.png',
            imageAlt: 'Logo Hotel - Factura',
            icon: 'success',
            confirmButtonColor: '#06563b',
            confirmButtonText: 'Aceptar'
        })
        vaciarCarrito();
    } else {
        avisoVaciadoError();
    }
}






