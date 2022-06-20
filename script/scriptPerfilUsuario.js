console.log("Consola de pruebas - Sistema de gestión de consultorios privados");

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getDatabase, ref, set, push, child, get, query, orderByChild, onValue, equalTo, remove } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

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

// API Docs: https://firebase.google.com/docs/reference/js/auth?hl=es&authuser=0#getauth
const auth = getAuth();

// Get a reference to the database service; https://firebase.google.com/docs/database/web/start#initialize_the_javascript_sdk
const database = getDatabase(app);
//console.log(database);

// Referencias al DOM

// Referencias a los campos de la tarjeta
let nombrePacienteRef = document.getElementById("nombreId");
let apellidoPacienteRef = document.getElementById("apellidoId");
let domicilioPacienteRef = document.getElementById("domicilioId");
let documentoPacienteRef = document.getElementById("documentoId");
let obraSocialPacienteRef = document.getElementById("obraSocialId");

// Referencias a los campos del modal para la edición de la información del paciente
let nombreRef = document.getElementById("nombrePaciente");
let apellidoRef = document.getElementById("apellidoPaciente");
let documentoRef = document.getElementById("numeroDocumento");
let domicioRef = document.getElementById("domicilioPaciente");
let obraSocialRef = document.getElementById("obraSocial");

// Referencia a la división que será completada con la información del turno tomado
let divTurnoRef = document.getElementById("listadoTurnos");

// Referencia a la división que será completada con la información de los profesionales de la base de datos
let divProfesionalesRef = document.getElementById("listadoProfesionales");

let botonUpdateRef = document.getElementById("botonUpdate");
botonUpdateRef.addEventListener("click", updatePaciente);

// Variables globales

let userId; // ID de cada usuario generado con Firebase Authentication
let cancelarRef, reservarRef, horariosRef; // Referencias a los botones para cancelar, tomar la reserva del turno y seleccionar los horarios disponibles.

// Clases desarrolladas. Clase Turno y Paciente

class Turno{

    constructor(paciente, profesionalMatricula, profesionalNombre, profesionalApellido, dia, hora, minuto){
        this.paciente = paciente;
        this.profesionalMatricula = profesionalMatricula;
        this.profesionalNombre = profesionalNombre;
        this.profesionalApellido = profesionalApellido;
        this.hora = hora;
        this.dia = dia;
        this.minuto = minuto;
    }

}

class Paciente{
    constructor (legajo, nombre, apellido, dni, domicilio, obraSocial)
    {
        this.legajo = legajo;
        this.nombre = nombre;
        this.apellido = apellido;
        this.documento = dni;
        this.domicilio = domicilio;
        this.obraSocial = obraSocial;
    }

    actualizarDatos (nombre, apellido, dni, domicilio, obraSocial){
        this.nombre = nombre;
        this.apellido = apellido;
        this.documento = dni;
        this.domicilio = domicilio;
        this.obraSocial = obraSocial;
    }

    // tomarTurno (id, especialista, paciente, fecha, horario, estado){
    //     turnosDB.push(new Turno(id, especialista, paciente, fecha, horario, estado));
    // }

    // modificarTurno (id, fecha, horario){
    //     turnosDB.forEach(turno => {if(turno.id == id){turno.fecha = fecha; turno.horario = horario;}});
    // }
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        userId = user.uid;
        //console.log("User ID: " + userId);

        // https://firebase.google.com/docs/database/web/read-and-write#read_data_once

        get(child(ref(database), 'users/' + userId))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    //console.log("Snapshot.val(): " + snapshot.val());
                    localStorage.setItem("pacienteEnLinea", JSON.stringify(snapshot.val().paciente));
                    actualizarDatosActuales();
                    //actualizarDatosProfesionales();

                    // Esta query la hago para filtrar la información de los turnos según cada uno corresponda al paciente logueado. Esto quiere decir que no se mostrarán a cada usuario los turnos que sean de otros pacientes.
                    // Link de interés: https://www.youtube.com/watch?v=C4ZnTCi50bc
                    const turnosQuery = query(ref(database, 'turnos'), orderByChild('turno/paciente'), equalTo(userId));

                    onValue(turnosQuery, (snapshot) => {
                        divTurnoRef.innerHTML = ``;
                        snapshot.forEach((childSnapshot) => {
                            const childKey = childSnapshot.key;
                            const childData = childSnapshot.val();
                            console.log("Child key: " + childKey);
                            console.log("Child data: " + childData);

                            divTurnoRef.innerHTML += `
                                <div class="card" style="margin-bottom: 1rem">
                                    <div class="card-header">
                                        Turno confirmado
                                    </div>
                                    <div class="card-body">
                                        <h5 class="card-title">${childSnapshot.val().turno.profesionalApellido}, ${childSnapshot.val().turno.profesionalNombre}</h5>
                                        <h6>MN/MP: ${childSnapshot.val().turno.profesionalMatricula}</h6>
                                        <p class="card-text">Usted tiene un turno con el profesional el día ${childSnapshot.val().turno.dia} a las ${childSnapshot.val().turno.hora}:${childSnapshot.val().turno.minuto}. En caso de no poder asistir, tenga a bien cancelar el turno.</p>
                                        <button id="cancelar${childSnapshot.key}"class="cancelar btn btn-danger">Cancelar</button>
                                    </div>
                                </div>
                            `;                            
                        });

                        cancelarRef = document.getElementsByClassName("cancelar btn btn-danger");

                        for(let cancela of cancelarRef) {
                            cancela.addEventListener('click', cancelarTurno);
                        }
                    });

                    console.log("Usuario Logueado");
                } else {
                    console.log("No hay información sobre este usuario. Debe actualizarse.");
                }
                })
            .catch((error) => {
                console.error(error);
            });
    } else {
    // User is signed out
    console.log("No hay usuario conectado.");
    // actualizarDatosProfesionales();
    }
});

// Esta query a la base de datos la hago para poder ordenar el listado de los profesionales que trabajan en el consultorio según la especialidad de cada uno. Esto puede ser escalable a un filtrado por el valor antes mencionado.
const profesionalesQuery = query(ref(database, 'profesionales'), orderByChild('profesional/especialidad'));
// console.log(mostViewedPosts.toString());

onValue(profesionalesQuery, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        //console.log("Child key: " + childKey);
        //console.log("Child data: " + childData);

        // diaInfo contiene la matriz descripta en el funcionamiento de analisisHorario.
        let diaInfo = analisisHorario(diaDisponible(childSnapshot.val().profesional.dia));
        let tagFinal, tagAux, flagPrimerDato = true, flagPrimerCalendario = true;

        for(let i = 0; i < 5; i++){
            // Esta es la condición generada de que en este día el profesional está trabajando en los consultorios.
            if(diaInfo[i][0] == 1){
                
                if(i == 0){diaInfo[i][0] = "Lunes";}
                if(i == 1){diaInfo[i][0] = "Martes";}
                if(i == 2){diaInfo[i][0] = "Miércoles";}
                if(i == 3){diaInfo[i][0] = "Jueves";}
                if(i == 4){diaInfo[i][0] = "Viernes";}

                for(let j = 1; j < 17; j++){
                    if(diaInfo[i][j] != 0)
                    {
                        //Separo el día del horario con : porque me es mucho más útilo luego para hacer la toma del turno una vez que el paciente seleccionó una opción.
                        if(flagPrimerDato){
                            tagAux = `
                                <input class="horario form-check-input me-1" id="${diaInfo[i][0] + ":" + diaInfo[i][j]}" type="checkbox" value="" aria-label="...">
                                <span>
                                    ${diaInfo[i][j]}
                                </span>                                        
                            `;
                            flagPrimerDato = false;
                        }
                        else{
                            tagAux += `
                                <input class="horario form-check-input me-1" id="${diaInfo[i][0] + ":" + diaInfo[i][j]}" type="checkbox" value="" aria-label="...">
                                <span>
                                    ${diaInfo[i][j]}
                                </span>                                        
                            `
                        }
                    }
                }
                
                flagPrimerDato = true;
                //console.log("tagAux: " + tagAux);

                if(flagPrimerCalendario){
                    tagFinal = `

                    <div class="row justify-content-center">
                        <div class="col-lg-10 col-md-10 col-sm-10 col-12" style="margin-top: 1rem; margin-left: 0; padding: 0; width: 100%;">
                            <div class="accordion-item">
                                <h2 class="accordion-header" id="heading${childSnapshot.val().profesional.matricula + "-" + i}">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${childSnapshot.val().profesional.matricula + "-" + i}" aria-expanded="true" aria-controls="collapse${childSnapshot.val().profesional.matricula + "-" + i}">
                                        ${diaInfo[i][0]}
                                    </button>
                                </h2>
                                <div id="collapse${childSnapshot.val().profesional.matricula + "-" + i}" class="accordion-collapse collapse" aria-labelledby="heading${childSnapshot.val().profesional.matricula + "-" + i}" data-bs-parent="#accordionExample">
                                    <div class="accordion-body">
                                        ` +

                                        tagAux +
                                    `    
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>                            
                    `;
                    flagPrimerCalendario = false;
                }
                else{
                    tagFinal += `

                    <div class="row justify-content-center">
                        <div class="col-lg-10 col-md-10 col-sm-10 col-12" style="margin-top: 1rem; margin-left: 0; padding: 0; width: 100%;">
                            <div class="accordion-item">
                                <h2 class="accordion-header" id="heading${childSnapshot.val().profesional.matricula + "-" + i}">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${childSnapshot.val().profesional.matricula + "-" + i}" aria-expanded="true" aria-controls="collapse${childSnapshot.val().profesional.matricula + "-" + i}">
                                        ${diaInfo[i][0]}
                                    </button>
                                </h2>
                                <div id="collapse${childSnapshot.val().profesional.matricula + "-" + i}" class="accordion-collapse collapse" aria-labelledby="heading$${childSnapshot.val().profesional.matricula + "-" + i}" data-bs-parent="#accordionExample">
                                    <div class="accordion-body">
                                        ` +

                                        tagAux +
                                    `    
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
                }                        
                
            }         
        }

        //console.log("tagFinal: " + tagFinal);
        flagPrimerCalendario = true;       

        divProfesionalesRef.innerHTML = divProfesionalesRef.innerHTML + `

            <div class="card" style="margin-bottom: 1rem;">
                <div class="card-body">
                    <h5 class="card-title"><span id="...">${childSnapshot.val().profesional.apellido}</span>, <span id="...">${childSnapshot.val().profesional.nombre}</span></h5>
                    <h6 class="card-title">Matrícula: <span id="...">${childSnapshot.val().profesional.especialidad}</span></h6>
                    <p class="card-text">Matrícula (MN/MP): <span id="...">${childSnapshot.val().profesional.matricula}</span></p>
                    <button type="button" id="tomarTurno${childSnapshot.val().profesional.matricula}" class="reservar btn btn-warning" style="width: 100%;" >Resevar</button> 
                    ` +
                    tagFinal +
                    `
                </div>
            </div>  
        `;
        // data-bs-dismiss="modal"
    });
        
    horariosRef = document.getElementsByClassName("horario form-check-input me-1");
    reservarRef = document.getElementsByClassName("reservar btn btn-warning");

    for(let reserva of reservarRef) {
        reserva.addEventListener('click', confirmarTurno);
    }

    }, {
    // https://github.com/kiprotect/klaro/issues/283
    // onlyOnce: true // Si lo descomento realizará esta lectura solo una vez.
});

// Funciones para el manejo de la información de los horarios disponibles para los profesionales.

// diaDisponible espera como parámetro la matriz de los días disponibles en los que un profesional trabaja en los consultorios. A partir de esto analiza en que se encuentra un turno disponible y genera una nueva matriz. El primero de los elementos en cada uno de los arrays contenidos en la matriz indicará, en caso de ser '1', que en ese día hay horarios disponibles. Pero en caso de ser '0', indicará que ese día en la semana el profesional no trabaja en los consultorios.

function diaDisponible (dias){
    let flagDay = new Array (5);
    flagDay[0] = new Array (17);    
    flagDay[1] = new Array (17);    
    flagDay[2] = new Array (17);    
    flagDay[3] = new Array (17);    
    flagDay[4] = new Array (17);
    
    for(let i = 0; i < 5; i++){
        flagDay[i][0] = 0;
        for(let j = 1; j < 17; j++){
            flagDay[i][j] = 0;
            if (dias[i][j] == 'D'){
                flagDay[i][0] = 1;
                flagDay[i][j] = 1;
            }
        }
    }

    return flagDay;
}

// La función analisisHorario espera una matriz como parámetro una matriz como la que es retornada por diaDisponible. Lo que hace esta función con esta matriz es manipularla de manera en que en los días en los que hay turnos disponibles se almacene el nombre del día más el horario disponible para turnos. Esta información será utilizada para generar el listado de turnos posibles a los que el paciente puede aplicar.

function analisisHorario (flagDay){
    for(let i = 0; i < 5; i++){
        if(flagDay[i][0] == 1){
            for(let j = 1; j < 17; j++){
                if(flagDay[i][j] == 1){
                    let minPlus = j * 30;

                    let hora = parseInt(8 + (minPlus / 60));
                    let min  = minPlus % 60;
                    
                    if(hora < 10){
                        hora = hora.toString().padStart(2, "0")
                    }
                    else{
                        hora = hora.toString();
                    }

                    if(min == 0){
                        min = min.toString().padEnd(2, "0")
                    }
                    else{
                        min = min.toString();
                    }

                    flagDay[i][j] = hora + ":" + min; 
                }
            }
        }    
    }

    return flagDay;
}

// https://firebase.google.com/docs/database/web/read-and-write#basic_write

// Función para actualizar los datos del paciente. Es importante recordar que cuando llegue a este punto ya tendrá una cuenta creada con su correo y contraseña.

function updatePaciente(){
    // Información antes del update.
    console.log("Información antes del update");
    //console.log(pacientesDB[0]); No descomentar esta línea. emoroni.

    let flagNombre, flagApellido, flagDocumento, flagDomicilio, flagObraSocial;

    let nombre = nombreRef.value;    
    let apellido = apellidoRef.value;
    let documento = documentoRef.value;
    let domicilio = domicioRef.value;
    let obraSocial = obraSocialRef.value;

    if((nombre != "")&&(isNaN(nombre))){flagNombre = 1;}
    if((apellido != "")&&(isNaN(apellido))){flagApellido = 1;}
    if((documento != "")&&(!isNaN(documento))){flagDocumento = 1;}
    if((domicilio != "")&&(isNaN(domicilio))){flagDomicilio = 1;}
    if((obraSocial != "")&&(isNaN(obraSocial))){flagObraSocial = 1;}

    if(flagNombre && flagApellido && flagDocumento && flagDomicilio && flagObraSocial){
        // Actualización de los datos del paciente. Relación entre el ID del usuario creado con la información respectiva a cada paciente.
        let paciente = new Paciente (userId, nombre, apellido, documento, domicilio, obraSocial);
        //const db = getDatabase();
        set(ref(database, 'users/' + userId), {
            paciente: paciente//pacientesDB[0]
        });

        console.log("Información luego del update");
        //console.log(pacientesDB[0]);

        localStorage.setItem("pacienteEnLinea", JSON.stringify(paciente));//pacientesDB[0]));
        actualizarDatosActuales();

        nombreRef.value = "";
        apellidoRef.value = "";
        obraSocialRef.value = "";
        domicioRef.value = "";
        documentoRef.value = "";

        Swal.fire({
            title: '¡Bien!',
            text: 'Tu información fue actualizada.',
            icon: 'success',
            confirmButtonText: 'Continuar'
        });
        
        console.log("Información actualizada.");
    }
    else{        
        Swal.fire({
            title: 'Algo no salió bien...',
            text: 'Repasa todos los campos a completar',
            icon: 'error',
            confirmButtonText: 'Continuar'
        });

        console.log("Repasar los campos ingresados."); 
    }  
}

function actualizarDatosActuales (){
    const pacienteActual = JSON.parse(localStorage.getItem("pacienteEnLinea"));
    nombrePacienteRef.innerHTML = pacienteActual.nombre;
    apellidoPacienteRef.innerHTML = pacienteActual.apellido;
    documentoPacienteRef.innerHTML = pacienteActual.documento;
    domicilioPacienteRef.innerHTML = pacienteActual.domicilio;
    obraSocialPacienteRef.innerHTML = pacienteActual.obraSocial;
}

// confirmarTurno es una función que evaluará que solamente uno de los inputs se encuentre seleccionado de manera que el paciente solo puede tomar un turno por vez cuando ingrese a la sección de tomar turnos.

function confirmarTurno (){
    let contador = 0;
    
    let profesionalId = this.id;
    profesionalId = profesionalId.slice(10);
    console.log(profesionalId);

    let horarioId;

    for(let horario of horariosRef){
        if(horario.checked){
            contador ++;            
            horarioId = horario.id;
        }
    }

    if(contador == 0){
        Swal.fire({
            title: '¿Olvidó algo?',
            text: 'Seleccione una fecha y horario.',
            icon: 'question',
            confirmButtonText: 'Continuar'
        });
    }

    else if(contador == 1){
        let turno, diaHorario, nombreProf, apellidoProf, dia, hora, minuto;
        diaHorario = horarioId.split(":");
        dia = diaHorario[0];
        hora = diaHorario [1];
        minuto = diaHorario [2];
        //console.log("Horario Id: " + horarioId + " DiaHorario: " + diaHorario);
        //console.log("Dia: " + dia);
        //console.log("Hora: " + hora);
        //console.log("Min: " + minuto);

        const matriculaQuery = query(ref(database, 'profesionales'), orderByChild('profesional/matricula'), equalTo(profesionalId));
        //console.log(matriculaQuery);

        onValue(matriculaQuery, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                // console.log("Child key: " + childKey);
                // console.log("Child data: " + childData);

                nombreProf = childSnapshot.val().profesional.nombre;
                apellidoProf = childSnapshot.val().profesional.apellido;
            });
        }, {
            onlyOnce: true
        });
                         
        turno = new Turno(userId, profesionalId, nombreProf, apellidoProf, dia, hora, minuto);
        push(ref(database, 'turnos/'), {
            turno: turno
        });

        Swal.fire({
            title: 'Turno reservado',
            text: 'Su turno fue reservado con el profesional seleccionado.',
            icon: 'success',
            confirmButtonText: 'Continuar'
        });
    }

    else if (contador > 1){
        Swal.fire({
            title: 'Demasiados turnos...',
            text: 'Seleccione solo una fecha y horario.',
            icon: 'warning',
            confirmButtonText: 'Continuar'
        });
    }

}

// cancelarTurno es una función que elimina de la base de datos el turno tomado por el paciente.

function cancelarTurno (){
    let cancelarId = this.id; 
    cancelarId = cancelarId.slice(8);

    //const deleteQuery = query(ref(database, 'turnos'), equalTo(cancelarId));

    remove(ref(database, 'turnos/' + cancelarId))
        .then(() => {
            Swal.fire({
                title: 'Turno cancelado',
                text: 'Su turno fue cancelado de manera exitosa.',
                icon: 'info',
                confirmButtonText: 'Continuar'
            });
            //console.log("Turno eliminado correctamente");
            }
        )
        .catch((error) => {
            console.log(error);
        }
        )
}