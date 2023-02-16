///////////////// ARRAYS Y CARGA JSON MEDIANTE FETCH /////////////////////////
let visualizadorHabArray = [];
let carritoArray = [];
let agregadosArray = [];

fetch("../js/items.json")
    .then(response => response.json())
    .then(data => {
        visualizadorHabArray = data;
        cargaVisualizador(visualizadorHabArray);
    })

fetch("../js/agregados.json")
    .then(response => response.json())
    .then(data => {
        agregadosArray = data;
        //cargaVisualizador(agregadosArray);
    })

console.log("Agregados: ", agregadosArray)

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
const textoReserva = document.querySelector(".textoReserva");
const reservas = document.querySelector(".reservas");
const checkout = document.querySelector(".checkout");
const vaciar = document.querySelector("#vaciar");
const factura = document.querySelector("#checkOutFinal");

/////////////// CARGAR HABITACIONES AL DIV EN RESERVAS //////////////
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
                    <p>Precio: $ ${elementos.precio}</p>
                    <button name="tarjetas" id= "${elementos.id}" class="col-12 mx-auto buttonForm botonHab claseBotonSeleccionado">Seleccionar</button>
                </div>
        </div>
        `;
        visualizadorHabitaciones.append(div);
    })
    funcionHabSeleccionar();
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
    //facturaFinal();
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

///////////// ELIMINAR ITEM INDIVIDUAL DE CARRITO ////////////
function eliminar(e) {
    const itemEliminar = e.target.closest(".eliminarItemCarrito").getAttribute("id");
    carritoArray = carritoArray.filter((impresion) => impresion.id != itemEliminar);
    const carro = JSON.stringify(carritoArray);
    localStorage.setItem("carritoArray", carro);
    Toastify({
        text: "Eliminado",
        duration: 2500,
        destination: "https://github.com/apvarun/toastify-js",
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

///////////// VACIADO TOTAL CARRITO ////////////
vaciar.addEventListener("click", avisoVaciado)
function vaciarCarrito() {
    carritoArray.length = 0;
    localStorage.setItem("carritoArray", JSON.stringify(carritoArray));
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
        text: 'ATENCIÓN: Su carrito ya se encuentra vacío',
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
    }
    ///////// PARA HTML RESERVAS
    if (reservas) {
        cargaVisualizador(visualizadorHabArray);
    }
}

///////////////// FUNCION EMITIR FACTURA EN ALERT //////////////
function guardarFactura(){

const facturaEnAlert = document.querySelector("#checkOutFinal");
facturaEnAlert.forEach((input) => {
    input.addEventListener("click", facturaFinal);
    });
}

guardarFactura();

function facturaFinal() {
    let factura3 = carritoArray.find(carritoArray => carritoArray.precio === '100');
    //let factura2 = JSON.parse(localStorage.getItem("carritoArray"))
    console.log("factura precio:", factura3);
}





///////////////// FUNCION DE BOTONES AGREGADOS //////////////
function botonesAgregados() {
    let inputWifi = document.querySelectorAll(".botonWifi");
    inputWifi.forEach(input => {
        input.addEventListener("click", sumarAgregado);
    })
}

function sumarAgregado(e){
    const agregarWifi = e.target.closest(".eliminarItemCarrito").getAttribute("id");
    agregadosArray = agregadosArray.filter((impresion) => impresion.id != agregarWifi);
    const agregado = JSON.stringify(agregadosArray);
    localStorage.setItem("agregadosArray", agregado);
}




