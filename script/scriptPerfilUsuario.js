console.log("Consola de pruebas - Sistema de gestión de consultorios privados");

// ¿Qué es el atributo type="module" cuando agrago el script?
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getDatabase, ref, set, child, get, query, orderByChild, onValue } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

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
let userId;

// Get a reference to the database service; https://firebase.google.com/docs/database/web/start#initialize_the_javascript_sdk
const database = getDatabase(app);
console.log(database);

// Referencias al DOM

let nombrePacienteRef = document.getElementById("nombreId");
let apellidoPacienteRef = document.getElementById("apellidoId");
let domicilioPacienteRef = document.getElementById("domicilioId");
let documentoPacienteRef = document.getElementById("documentoId");
let obraSocialPacienteRef = document.getElementById("obraSocialId");
let nombreRef = document.getElementById("nombrePaciente");
let apellidoRef = document.getElementById("apellidoPaciente");
let documentoRef = document.getElementById("numeroDocumento");
let domicioRef = document.getElementById("domicilioPaciente");
let obraSocialRef = document.getElementById("obraSocial");

let botonUpdateRef = document.getElementById("botonUpdate");
botonUpdateRef.addEventListener("click", updatePaciente, false);

let botonModalUpdateRef = document.getElementById("buttonModalUpdatePaciente");

let numeroPaciente = 0;

// Arrays a emplear

const pacientesDB = [];
const turnosDB = [];

// Clases desarrolladas. Clase Turno y Paciente

class Turno{

    constructor(id, semanaAno, dia, horario, profesional, paciente){
        this.id = id;
        this.semanaAno = semanaAno;
        this.horario = horario;
        this.dia = dia;
        this.profesional = profesional;
        this.paciente = paciente;
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

    tomarTurno (id, especialista, paciente, fecha, horario, estado){
        turnosDB.push(new Turno(id, especialista, paciente, fecha, horario, estado));
    }

    modificarTurno (id, fecha, horario){
        turnosDB.forEach(turno => {if(turno.id == id){turno.fecha = fecha; turno.horario = horario;}});
    }
}

// Agrego de manera inicial estos elementos a los arrays porque cuando el proyecto este más avanzado, el paciente al momento de ver el desarrollo compartido, será porque efectivamente ya habrá creado su cuenta y también, habrá tomado un turno.

pacientesDB.push(new Paciente(numeroPaciente, "Nombre", "Apellido", 23456789, "Calle Ejemplar 1", "Obra Social"));
turnosDB.push(new Turno(1234, "Médico clinico", 0, "12/06/2022", "12:00", "Tomado"));

onAuthStateChanged(auth, (user) => {
    if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    userId = user.uid;
    console.log("User ID: " + userId);

    // https://firebase.google.com/docs/database/web/read-and-write#read_data_once

    get(child(ref(database), 'users/' + userId))
        .then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val());
                localStorage.setItem("pacienteEnLinea", JSON.stringify(snapshot.val().paciente));
                actualizarDatosActuales();
                //actualizarDatosProfesionales();
                console.log("User Logged in");
            } else {
                console.log("No data available");
            }
            })
        .catch((error) => {
            console.error(error);
        });
    } else {
    // User is signed out
    console.log("No hay usuario conectado.");
    //actualizarDatosProfesionales();
    }
});

const mostViewedPosts = query(ref(database, 'profesionales'), orderByChild('profesional/especialidad'));

// console.log("Que obtengo de la query: ");
// console.log(mostViewedPosts.toString());

let divProfesionalesRef = document.getElementById("listadoProfesionales");
let reservarRef, horariosRef;

onValue(mostViewedPosts, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        console.log(childKey);
        console.log(childData);

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
                        if(flagPrimerDato){
                            tagAux = `
                                <input class="horario form-check-input me-1" id="${diaInfo[i][0] + "-" + diaInfo[i][j]}" type="checkbox" value="" aria-label="...">
                                <span>
                                    ${diaInfo[i][j]}
                                </span>                                        
                            `;
                            flagPrimerDato = false;
                        }
                        else{
                            tagAux += `
                                <input class="horario form-check-input me-1" id="${diaInfo[i][0] + "-" + diaInfo[i][j]}" type="checkbox" value="" aria-label="...">
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
    onlyOnce: true
});

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


numeroPaciente++;

// https://firebase.google.com/docs/database/web/read-and-write#basic_write

// Función para actualizar los datos del paciente. Es importante recordar que cuando llegue a este punto ya tendrá una cuenta creada con su correo y contraseña.

function updatePaciente(){
    // Información antes del update.
    console.log("Información antes del update");
    console.log(pacientesDB[0]);

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
        // Actualización de los datos del paciente.
        pacientesDB[0].actualizarDatos(nombre, apellido, documento, domicilio, obraSocial);
        //const db = getDatabase();
        set(ref(database, 'users/' + userId), {
            paciente: pacientesDB[0]
        });

        console.log("Información luego del update");
        console.log(pacientesDB[0]);

        localStorage.setItem("pacienteEnLinea", JSON.stringify(pacientesDB[0]));
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

function confirmarTurno (){
    let contador = 0;

    console.log(this.id);

    for(let horario of horariosRef){
        if(horario.checked){
            contador ++;
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

function actualizarDatosProfesionales (){
    get(child(ref(database), 'profesionales/'))
        .then((snapshot) => {
        if (snapshot.exists()) {
            // var dato = snapshot.val();
            // const array = new Array;
            // console.log("Que hay en la base de datos: ");

            // Object.keys(dato).forEach((key) => {
            //     array.push({[key]: [key]});
            // });

            // console.log(array[1]);
        } else {
            console.log("No data available");
        }
        }).catch((error) => {
        console.error(error);
    });
}