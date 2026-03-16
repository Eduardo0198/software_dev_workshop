function mostrarInfo(nombre, descripcion) {
  document.getElementById("modalTitle").textContent = nombre;
  document.getElementById("modalBody").textContent = descripcion;

  const modal = new bootstrap.Modal(document.getElementById("infoModal"));
  modal.show();
}

// -------------------------
// SECCION AÑADIDA DE LAB06 
// -------------------------

const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const passwordHelp = document.getElementById("passwordHelp");
const confirmHelp = document.getElementById("confirmHelp");
const togglePasswordBtn = document.getElementById("togglePassword");
const passwordForm = document.getElementById("passwordForm");
const resultadoPassword = document.getElementById("resultadoPassword");
const validatorTitle = document.getElementById("validatorTitle");

const reqLength = document.getElementById("reqLength");
const reqUppercase = document.getElementById("reqUppercase");
const reqNumber = document.getElementById("reqNumber");
const reqMatch = document.getElementById("reqMatch");

function validarPassword() {
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  const tieneLongitud = password.length >= 8;
  const tieneMayuscula = /[A-Z]/.test(password);
  const tieneNumero = /[0-9]/.test(password);
  const coinciden = password !== "" && password === confirmPassword;

  actualizarEstado(reqLength, tieneLongitud);
  actualizarEstado(reqUppercase, tieneMayuscula);
  actualizarEstado(reqNumber, tieneNumero);
  actualizarEstado(reqMatch, coinciden);

  return tieneLongitud && tieneMayuscula && tieneNumero && coinciden;
}

function actualizarEstado(elemento, valido) {
  if (valido) {
    elemento.classList.add("valid");
    elemento.classList.remove("invalid");
  } else {
    elemento.classList.add("invalid");
    elemento.classList.remove("valid");
  }
}

// Ayuda dinámica con focus
passwordInput.addEventListener("focus", function () {
  passwordHelp.textContent = "Debe tener mínimo 8 caracteres, una mayúscula y un número.";
});

confirmPasswordInput.addEventListener("focus", function () {
  confirmHelp.textContent = "Repite exactamente la misma contraseña.";
});

// Cambio al salir del campo
passwordInput.addEventListener("blur", function () {
  passwordHelp.textContent = "Revisa que tu contraseña sea segura.";
});

confirmPasswordInput.addEventListener("blur", function () {
  confirmHelp.textContent = "Verifica que ambas contraseñas coincidan.";
});

// Validación en tiempo real
passwordInput.addEventListener("input", validarPassword);
confirmPasswordInput.addEventListener("input", validarPassword);

// Mostrar / ocultar contraseña
togglePasswordBtn.addEventListener("click", function () {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    confirmPasswordInput.type = "text";
  } else {
    passwordInput.type = "password";
    confirmPasswordInput.type = "password";
  }
});

// Cambiar estilo del título con eventos distintos a click
validatorTitle.addEventListener("mouseover", function () {
  validatorTitle.style.fontStyle = "italic";
  validatorTitle.style.fontSize = "2.3rem";
  validatorTitle.style.color = "#0d6efd";
});

validatorTitle.addEventListener("mouseout", function () {
  validatorTitle.style.fontStyle = "normal";
  validatorTitle.style.fontSize = "";
  validatorTitle.style.color = "";
});

// Submit del formulario
passwordForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const esValida = validarPassword();

  if (esValida) {
    resultadoPassword.innerHTML = `
      <div class="alert alert-success">
        Contraseña válida. Acceso concedido al sistema de Avengers Secure Access.
      </div>
    `;

    // Opcional sencillo con setTimeout
    setTimeout(() => {
      resultadoPassword.innerHTML += `
        <div class="alert alert-info mt-2">
          Validación completada correctamente.
        </div>
      `;
    }, 1000);
  } else {
    resultadoPassword.innerHTML = `
      <div class="alert alert-danger">
        Contraseña inválida. Verifica los requisitos y vuelve a intentarlo.
      </div>
    `;
  }
});