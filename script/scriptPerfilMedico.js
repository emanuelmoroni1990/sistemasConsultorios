// Entrega final. Curso JS, Coder House 2022.
// Sistema de gestión en consultorios privados. Emanuel Moroni

console.log("Consola de pruebas - Sistema de gestión de consultorios privados");

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
//console.log(database);

// Variable globales
let profId = 0, i;
let lunesRef = new Array (16);
let martesRef = new Array (16);
let miercolesRef = new Array (16);
let juevesRef = new Array (16);
let viernesRef = new Array (16);

// Referencias al DOM
let nombreRef = document.getElementById("nombreProfesional"); 
let apellidoRef = document.getElementById("apellidoProfesional"); 
let especialidadRef = document.getElementById("especialidadProfesional");
let documentoRef = document.getElementById("numeroDocumento"); 
let matriculaRef = document.getElementById("matriculaProfesional"); 

let botonUpdateRef = document.getElementById("botonUpdate");
botonUpdateRef.addEventListener("click", updateProfesional, false);

for (i = 1; i < 17; i ++){
    lunesRef [i - 1] = document.getElementById("lunes" + i);
    martesRef [i - 1] = document.getElementById("martes" + i);
    miercolesRef [i - 1] = document.getElementById("miercoles" + i);
    juevesRef [i - 1] = document.getElementById("jueves" + i);
    viernesRef [i - 1] = document.getElementById("viernes" + i);
}

class Profesional{

    constructor(id, nombre, apellido, especialidad, dni, matricula){
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

// updateProfesional es una función que carga la información del profesional que trabaja en los consultorios junto con su disponibilidad horaria.

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

        for(i = 0; i < 16; i++){
            lunesRef[i].checked = false;
            martesRef[i].checked = false;
            miercolesRef[i].checked = false;
            juevesRef[i].checked = false;
            viernesRef[i].checked = false;
        }

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

/*
 * Matriz de días tomados por el profesional
 * Luxon API: Get the day of the week. 1 is Monday and 7 is Sunday
 * https://moment.github.io/luxon/api-docs/index.html#datetimeweekday
 */

function checkDias (){
    let dias = new Array(5);
    dias [0] = new Array(16);
    dias [1] = new Array(16);
    dias [2] = new Array(16);
    dias [3] = new Array(16);
    dias [4] = new Array(16);

    for(i = 0; i < 16; i++){
        if(lunesRef[i].checked){
            dias[0][i] = "D";
        }
        else{
            dias[0][i] = "ND";
        }

        if(martesRef[i].checked){
            dias[1][i] = "D";
        }
        else{
            dias[1][i] = "ND";
        }

        if(miercolesRef[i].checked){
            dias[2][i] = "D";
        }
        else{
            dias[2][i] = "ND";
        }

        if(juevesRef[i].checked){
            dias[3][i] = "D";
        }
        else{
            dias[3][i] = "ND";
        }

        if(viernesRef[i].checked){
            dias[4][i] = "D";
        }
        else{
            dias[4][i] = "ND";
        }
    }

    console.log(dias);
    return dias;
}

// API Docs: https://moment.github.io/luxon/api-docs/index.html#info
// const informacion = luxon.Info;
// console.log(informacion.weekdays());
// API Docs: https://moment.github.io/luxon/api-docs/index.html#duration
// const duracion = luxon.Duration;
// console.log(duracion.fromObject({hours: 2, minutes: 15}));
// const DateTime = luxon.DateTime;
// console.log(DateTime.now().weekday);