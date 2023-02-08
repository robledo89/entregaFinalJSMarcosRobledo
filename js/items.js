class itemDeReserva {
    constructor(id, tipoHabitacion, nombre, cama, capacidad, metraje, precio, foto, adicionales){
        this.id = id
        this.tipoHabitacion = tipoHabitacion
        this.nombre = nombre
        this.cama = cama
        this.capacidad = capacidad
        this.metraje = metraje
        this.precio = precio
        this.foto = foto
        this.adicionales = adicionales
    }
}

const tipoReserva1 = new itemDeReserva(1, "Lago", "Suite vista al Lago", "Queen Size", 2, 85, 100, "../images/hab-01.png", "etc")
const tipoReserva2 = new itemDeReserva(2, "Lago", "Superior vista al Lago", "King Size", 4, 95, 150, "../images/hab-02.png", "etc")
const tipoReserva3 = new itemDeReserva(3, "Jardin", "Suite vista al Parque", "Queen Size", 2, 85, 180, "../images/hab-03.png", "etc")
const tipoReserva4 = new itemDeReserva(4, "Jardin", "Superior vista al Jardin", "King Size", 4, 120, 250, "../images/hab-04.png", "etc")

///////////////// ARRAY DE CARGA DE HABITACIONES /////////////////
//const visualizadorHabArray = [];

// visualizadorHabArray.push(tipoReserva1);
// visualizadorHabArray.push(tipoReserva2);
// visualizadorHabArray.push(tipoReserva3);
// visualizadorHabArray.push(tipoReserva4);