// Entrega final. Curso JS, Coder House 2022.
// Sistema de gestión en consultorios privados. Emanuel Moroni

console.log("Consola de pruebas - Sistema de gestión de consultorios privados");

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

// ¿Cómo obtener esta información? https://firebase.google.com/docs/web/learn-more?authuser=0&hl=es#config-object
const firebaseConfig = {
  apiKey: "AIzaSyAjugINdVkKqoyXgrJPzIUqtCtonmXeCCg",
  authDomain: "sistemasconsultoriosmedicos.firebaseapp.com",
  projectId: "sistemasconsultoriosmedicos",
  storageBucket: "sistemasconsultoriosmedicos.appspot.com",
  messagingSenderId: "6564816613",
  appId: "1:6564816613:web:f8ec6d410733015f3bd60c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Referencias al DOM
let correoRef = document.getElementById("correoId");
let passwordRef = document.getElementById("passwordId");

let botonRef = document.getElementById("logInButttonId");
botonRef.addEventListener("click", logInUser);

// API Docs: https://firebase.google.com/docs/reference/js/auth?hl=es&authuser=0#getauth
const auth = getAuth(); 

// API Docs: https://firebase.google.com/docs/auth/web/password-auth?hl=es#sign_in_a_user_with_an_email_address_and_password

// logInUser emplea una función de Firebase Authentication para poder ingresar a una cuenta ya creada mediante el uso de un mail y contraseña. En esta función se verifican que todos los campos ingresados sean los correctos y esperados.

function logInUser (){
    let flagEmail, flagPass;

    let email = correoRef.value;
    let password = passwordRef.value;

    if((email != "")&&(isNaN(email))){flagEmail = 1;}
    if(password != ""){flagPass = 1;}

    if(flagEmail && flagPass){
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                console.log(userCredential.user);
                window.location.href = "./perfil_usuario.html";
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode);
                console.log(errorMessage);

                if(errorCode == 'auth/wrong-password'){
                    Swal.fire({
                        title: 'Contraseña incorrecta',
                        text: 'Repasa la contraseña ingresada',
                        icon: 'error',
                        confirmButtonText: 'Continuar'
                    });
                }
                else if(errorCode == 'auth/user-not-found'){
                    Swal.fire({
                        title: 'Usuario incorrecto',
                        text: 'Repasa el usuario ingresado. ¿Fue dado de alta?',
                        icon: 'error',
                        confirmButtonText: 'Continuar'
                    });    
                }
                else{
                    Swal.fire({
                        title: 'Información erronea',
                        text: 'Existe información incorrecta, repase ambos campos. Recuerde respetar el formato de correos electrónicos.',
                        icon: 'info',
                        confirmButtonText: 'Continuar'
                    }); 
                }
            });

        correoRef.value = "";
        passwordRef.value = "";
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

