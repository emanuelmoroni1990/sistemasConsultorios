console.log("Consola de pruebas - Sistema de gestión de consultorios privados");

// ¿Qué es el atributo type="module" cuando agrago el script?
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

// ¿Cómo obtener esta información? https://firebase.google.com/docs/web/learn-more?authuser=0&hl=es#config-object

const firebaseConfig = {
  apiKey: "AIzaSyAjugINdVkKqoyXgrJPzIUqtCtonmXeCCg",
  authDomain: "sistemasconsultoriosmedicos.firebaseapp.com",
  databaseURL: "https://sistemasconsultoriosmedicos-default-rtdb.firebaseio.com/",
  projectId: "sistemasconsultoriosmedicos",
  storageBucket: "sistemasconsultoriosmedicos.appspot.com",
  messagingSenderId: "6564816613",
  appId: "1:6564816613:web:f8ec6d410733015f3bd60c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the database service; https://firebase.google.com/docs/database/web/start#initialize_the_javascript_sdk
const database = getDatabase(app);
console.log(database);

// IdProfesional

let profId = 0;

// Referencias al DOM

let nombreRef = document.getElementById("nombreProfesional");
//console.log(nombreRef);
let apellidoRef = document.getElementById("apellidoProfesional");
//console.log(apellidoRef);
let especialidadRef = document.getElementById("especialidadProfesional");
//console.log(domicioRef);
let documentoRef = document.getElementById("numeroDocumento");
//console.log(documentoRef);
let matriculaRef = document.getElementById("matriculaProfesional");
//console.log(domicioRef);

let lunesRef = document.getElementById("lunes");
//console.log(nombreRef);
let martesRef = document.getElementById("martes");
//console.log(apellidoRef);
let miercolesRef = document.getElementById("miercoles");
//console.log(documentoRef);
let juevesRef = document.getElementById("jueves");
//console.log(domicioRef);
let viernesRef = document.getElementById("viernes");
//console.log(domicioRef);

let botonUpdateRef = document.getElementById("botonUpdate");
botonUpdateRef.addEventListener("click", updateProfesional, false);

// Luxon: https://moment.github.io/luxon/api-docs/index.html

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

    horarioConsultorio(dia){
        this.dia = dia;
    }

}

let doc = new Profesional(0, "Nestor", "Kazanski", "Clinica", 35665600, 1234);

doc.horarioConsultorio(new Array ("martes", "jueves"), {hours: 3, minutes: 0, seconds:0});

function updateProfesional (){

    console.log("Información antes del update");

    let flagNombre, flagApellido, flagDocumento, flagMatricula, flagEspecialidad;

    let nombre = nombreRef.value;    
    let apellido = apellidoRef.value;
    let especialidad = especialidadRef.value;
    let documento = documentoRef.value;
    let matricula = matriculaRef.value;

    if((nombre != "")&&(isNaN(nombre))){flagNombre = 1;}
    if((apellido != "")&&(isNaN(apellido))){flagApellido = 1;}
    if((especialidad != "")&&(isNaN(especialidad))){flagEspecialidad = 1;}
    if((documento != "")&&(!isNaN(documento))){flagDocumento = 1;}
    if((matricula != "")&&(!isNaN(matricula))){flagMatricula = 1;}

    if(flagNombre && flagApellido && flagDocumento && flagMatricula && flagEspecialidad){
        let prof = new Profesional(profId, nombre, apellido, especialidad, documento, matricula);

        prof.horarioConsultorio(checkDias());

        // // Actualización de los datos del paciente.
        // pacientesDB[0].actualizarDatos(nombre, apellido, documento, domicilio, obraSocial);
        // //const db = getDatabase();
        push(ref(database, 'profesionales/'), {
             profesional: prof
        });

        // console.log("Información luego del update");
        // console.log(pacientesDB[0]);

        // localStorage.setItem("pacienteEnLinea", JSON.stringify(pacientesDB[0]));
        // actualizarDatosActuales();

        nombreRef.value = "";
        apellidoRef.value = "";
        especialidadRef.value = "";
        documentoRef.value = "";
        matriculaRef.value = "";

        lunesRef.checked = false;
        martesRef.checked = false;
        miercolesRef.checked = false;
        juevesRef.checked = false;
        viernesRef.checked = false;

        Swal.fire({
            title: '¡Bien!',
            text: 'Profesional cargado con éxito.',
            icon: 'success',
            confirmButtonText: 'Continuar'
        })

        console.log("Información actualizada.");
    }
    else{
        Swal.fire({
            title: 'Algo no salió bien...',
            text: 'Repasa todos los campos a completar',
            icon: 'error',
            confirmButtonText: 'Continuar'
        })

        console.log("Repasar los campos ingresados."); 
    }  
}

function checkDias (){
    let dias = new Array(5);
    if(lunesRef.checked){
        dias[0] = "lunes";
    }
    if(martesRef.checked){
        dias[1] = "martes";
    }
    if(miercolesRef.checked){
        dias[2] = "miercoles";
    }
    if(juevesRef.checked){
        dias[3]= "jueves";
    }
    if(viernesRef.checked){
        dias[4] = "viernes";
    }
    return dias;
}

// API Docs: https://moment.github.io/luxon/api-docs/index.html#info

const informacion = luxon.Info;

console.log(informacion.weekdays());

// API Docs: https://moment.github.io/luxon/api-docs/index.html#duration

const duracion = luxon.Duration;

console.log(duracion.fromObject({hours: 2, minutes: 15}));

const DateTime = luxon.DateTime;

console.log(DateTime.now());