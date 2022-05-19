console.log("Consola de pruebas - Sistema de gestión de consultorios privados");

// ¿Qué es el atributo type="module" cuando agrago el script?
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let correoRef = document.getElementById("correoId");
let passwordRef = document.getElementById("passwordId");
let passwordCheckRef = document.getElementById("passwordCheckId");
let botonRef = document.getElementById("altaButtonId");

botonRef.addEventListener("click", altaUser);

// API Docs: https://firebase.google.com/docs/reference/js/auth?hl=es&authuser=0#getauth
const auth = getAuth(); 

// API Docs: https://firebase.google.com/docs/reference/js/auth.md?authuser=0&hl=es#createuserwithemailandpassword
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
                window.close("./alta_usuario.html");
                window.open("./perfil_usuario.html");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode);
                console.log(errorMessage);
            });

        correoRef.value = "";
        passwordRef.value = "";
        passwordCheckRef.value = "";
    }
    else{
        console.log("Verifique los datos ingresados...");
    }    
}

