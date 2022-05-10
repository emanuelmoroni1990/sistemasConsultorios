console.log("Consola de pruebas - Sistema de gestión de consultorios privados");

// Referencias.

var nombreRef = document.getElementById("inputNombreUsuario");
var apellidoRef = document.getElementById("inputApellidoUsuario");
var domicilioRef = document.getElementById("inputDomicilio");
var ciudadRef = document.getElementById("inputCiudad");
var telefonoRef = document.getElementById("inputTelefono");
var correoRef = document.getElementById("inputEmail");
var passwordRef = document.getElementById("inputPassword");
var passwordCheckRef = document.getElementById("inputPasswordCheck");

var botonAltaRef = document.getElementById("botonAltaPaciente");
botonAltaRef.addEventListener("click", altaPaciente, false);

// Clases

class Paciente{
    constructor (legajo, nombre, apellido, domicilio, ciudad, telefono, correo, password)
    {
        this.legajo = legajo;
        this.nombre = nombre;
        this.apellido = apellido;
        this.domicilio = domicilio;
        this.ciudad = ciudad;
        this.telefono = telefono;
        this.correo = correo;
        this.password = password;
    }

    tomarTurno (){
        // A desarrollar...
    }
}

let numeroPaciente = 0;
const pacientesDB = [];

function altaPaciente (){
    let flagNombre, flagApellido, flagDomicilio, flagCiudad, flagTelefono, flagCorreo, flagPassword;

    let nombre = nombreRef.value;    
    let apellido = apellidoRef.value;
    let domicilio = domicilioRef.value;
    let ciudad = ciudadRef.value;
    let telefono = telefonoRef.value;
    let correo = correoRef.value;
    let password = passwordRef.value;
    let passwordCheck = passwordCheckRef.value;

    if((nombre != "")&&(isNaN(nombre))){flagNombre = 1;}
    if((apellido != "")&&(isNaN(apellido))){flagApellido = 1;}
    if((domicilio != "")&&(isNaN(domicilio))){flagDomicilio = 1;}
    if((ciudad != "")&&(isNaN(ciudad))){flagCiudad = 1;}
    if((telefono != "")&&(!isNaN(telefono))){flagTelefono = 1;}
    if((correo != "")&&(isNaN(correo))){flagCorreo = 1;}
    if((password != "")&&(isNaN(password))&&(passwordCheck != "")&&(isNaN(passwordCheck))&&(password == passwordCheck)){flagPassword = 1;}

    if(flagNombre && flagApellido && flagDomicilio && flagCiudad && flagTelefono && flagCorreo && flagPassword){
        pacientesDB.push(new Paciente(numeroPaciente, nombre, apellido, domicilio, ciudad, telefono, correo, password));

        nombreRef.value = "";
        apellidoRef.value = "";
        domicilioRef.value = "";
        ciudadRef.value = "";
        telefonoRef.value = "";
        correoRef.value = "";
        passwordRef.value = "";
        passwordCheckRef.value = "";
        numeroPaciente++;
        
        console.log("Paciente dado de alta.");
    }
    else{
        console.log("Repasar los campos ingresados."); 
    }  
}