import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

// configuración
const firebaseConfig = {
  apiKey: "AIzaSyASKKCLqpbErLL3zwf8Ap3x2V5WsaERB3M",
  authDomain: "mercadia-tiendas.firebaseapp.com",
  projectId: "mercadia-tiendas",
  storageBucket: "mercadia-tiendas.firebasestorage.app",
  messagingSenderId: "802265716384",
  appId: "1:802265716384:web:9af269b6a171537fbfdbc5",
  databaseURL: "https://mercadia-tiendas-default-rtdb.firebaseio.com"
};

// iniciar firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// crear stores si no existe
set(ref(db, "stores"), {});