console.log("Consola de pruebas - Sistema de gestión de consultorios privados");

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

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

let gestionPersonalRef = document.getElementById("gestionPersonalAnchor");

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// API Docs: https://firebase.google.com/docs/reference/js/auth?hl=es&authuser=0#getauth
const auth = getAuth();

// Al emplear este método lo que estoy haciendo es una comprobación del usuario logueado. En caso de que el usuario se encuentre logueado, cuando haga click sobre el vínculo de gestión personal no ingresará a la opción de ingresar usuario y contraseña, si no que abrirá su panel de gestión personal.

onAuthStateChanged(auth, (user) => {
    if (user) {
        gestionPersonalRef.setAttribute("href", "./perfil_usuario.html");
    } else {
    console.log("No hay usuario conectado.");
    }
});