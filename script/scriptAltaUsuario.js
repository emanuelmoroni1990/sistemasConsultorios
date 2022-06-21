// Entrega final. Curso JS, Coder House 2022.
// Sistema de gestión en consultorios privados. Emanuel Moroni

console.log("Consola de pruebas - Sistema de gestión de consultorios privados");

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

// ¿Cómo obtener esta información? https://firebase.google.com/docs/web/learn-more?authuser=0&hl=es#config-object

const firebaseConfig = {
  apiKey: "AIzaSyAjugINdVkKqoyXgrJPzIUqtCtonmXeCCg",
  authDomain: "sistemasconsultoriosmedicos.firebaseapp.com",
  projectId: "sistemasconsultoriosmedicos",
  storageBucket: "sistemasconsultoriosmedicos.appspot.com",
  messagingSenderId: "6564816613",
  appId: "1:6564816613:web:f8ec6d410733015f3bd60c"
};

// Referencias al DOM
let correoRef = document.getElementById("correoId");
let passwordRef = document.getElementById("passwordId");
let passwordCheckRef = document.getElementById("passwordCheckId");

let botonRef = document.getElementById("altaButtonId");
botonRef.addEventListener("click", altaUser);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// API Docs: https://firebase.google.com/docs/reference/js/auth?hl=es&authuser=0#getauth
const auth = getAuth(); 

// API Docs: https://firebase.google.com/docs/reference/js/auth.md?authuser=0&hl=es#createuserwithemailandpassword

// altaUser emplea una función de Firebase Authentication para poder crear una cuenta  mediante el uso de un mail y contraseña. En esta función se verifican que todos los campos ingresados sean los correctos y esperados.

function altaUser (){
    let flagEmail, flagPass;

    let email = correoRef.value;
    let password = passwordRef.value;
    let passwordCheck = passwordCheckRef.value;

    if((email != "")&&(isNaN(email))){flagEmail = 1;}
    if((password != "")&&(passwordCheck != "")&&(password == passwordCheck)){flagPass = 1;}

    if(flagEmail && flagPass){
        createUserWithEmailAndPassword(auth, email, password) 
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log(user);
                window.location.href = "./perfil_usuario.html";
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode);
                console.log(errorMessage);

                if(errorCode == 'auth/invalid-email'){
                    Swal.fire({
                        title: 'Formato incorrecto',
                        text: 'Recuerde respetar el formato de correos electrónicos',
                        icon: 'error',
                        confirmButtonText: 'Continuar'
                    });
                }
                else if(errorCode == 'auth/weak-password'){
                    Swal.fire({
                        title: 'Contraseña débil',
                        text: 'La contraseña debe ser mayor a 6 dígitos',
                        icon: 'error',
                        confirmButtonText: 'Continuar'
                    });    
                }
                else if(errorCode == 'auth/email-already-in-use'){
                    Swal.fire({
                        title: 'Correo ya utilizado',
                        text: 'Ya existe una cuenta que opera con este correo electrónico',
                        icon: 'error',
                        confirmButtonText: 'Continuar'
                    });    
                }
                else{
                    Swal.fire({
                        title: 'Información erronea',
                        text: 'Existe información incorrecta, repase todo los campos',
                        icon: 'info',
                        confirmButtonText: 'Continuar'
                    }); 
                }
            });

        correoRef.value = "";
        passwordRef.value = "";
        passwordCheckRef.value = "";
    }
    else{
        Swal.fire({
            title: 'Algo no salió bien...',
            text: 'Repasa todos los campos a completar',
            icon: 'error',
            confirmButtonText: 'Continuar'
        });

        console.log("Verifique los datos ingresados...");
    }    
}

