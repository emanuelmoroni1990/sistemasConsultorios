console.log("Consola de pruebas - Sistema de gestión de consultorios privados");

// Luxon: https://moment.github.io/luxon/api-docs/index.html

class DisponibilidadHoraria{
    constructor(dia, franja)
    {
        this.dia = dia;
        this.franja = franja;
    }
}

class Profesional{

    constructor(id, nombre, apellido, especialidad, dni, matricula)
    {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.especialidad = especialidad;
        this.dni = dni;
        this.matricula = matricula;
    }

    horarioConsultorio(dia, franja){
        this.dia = dia;
        this.franja = franja;
        console.log(dia);
        console.log(franja);
    }
}

let doc = new Profesional(0, "Nestor", "Kazanski", "Clinica", 35665600, 1234);

doc.horarioConsultorio(new Array ("martes", "jueves"), {hours: 3, minutes: 0, seconds:0});

// API Docs: https://moment.github.io/luxon/api-docs/index.html#info

const informacion = luxon.Info;

console.log(informacion.weekdays());

// API Docs: https://moment.github.io/luxon/api-docs/index.html#duration

const duracion = luxon.Duration;

console.log(duracion.fromObject({hours: 2, minutes: 15}));

const DateTime = luxon.DateTime;

console.log(DateTime.now());