// Mapa per guardar les dades de registre i simular el Backend
var bbdd = new Map();

// Dades de prova: (usuari, [correu, contrassenya, província])
bbdd.set("usuari1", ["Nom 1", "prova@prova.cat", "Pass0001", "Barcelona"]);
bbdd.set("usuari2", ["Nom 2", "prova@prova.cat", "Pass0002", "Girona"]);
bbdd.set("usuari3", ["Nom 3", "prova@prova.cat", "Pass0003", "Tarragona"]);
bbdd.set("usuari4", ["Nom 4", "prova@prova.cat", "Pass0004", "Lleida"]);

// ---------------------------------------------------------------------------------------
// BOTÓ 1: REGISTRE
// ---------------------------------------------------------------------------------------

// Definim el formulari i els seus inputs
var formulari = document.getElementById('formulari');
var inputs = document.querySelectorAll('#formulari input');
var login = document.getElementById('formularilogin');

// Escribim les expressions regulars que ha de complir cada camp
const expresiones = {
	usuari: /^[a-zA-Z0-9\_\-]{4,16}$/,
	nom: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
	pass: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
	mail: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/ 
};

// Inicialitzem tots els camps amb expressions regulars a incorrectes
const campos = {usuari: false, nom: false, pass: false, mail: false};

// EventListeners pels Inputs
inputs.forEach((input) => {
	input.addEventListener('keyup', validarFormulari); //Quan escribim una lletra
	input.addEventListener('blur', validarFormulari);  //Quan per el focus
});

// EventListeners pel Formulari complet
formulari.addEventListener('submit', (e) => {
	e.preventDefault();
	let condicions = document.getElementById('condicions');
	let provincia = document.getElementById('provincia').value;
	if(campos.usuari && campos.nom && campos.pass && campos.mail && comprovaProvincia(provincia, 'provincia') && condicions.checked ){
		//Guardem a la base de dades
		let usuari = document.getElementById("usuari").value;
		let nom = document.getElementById("nom").value;
		let mail = document.getElementById("mail").value;
		let pass = document.getElementById("pass").value;
		console.log("1 "+usuari+" 2 "+nom+" 3 "+mail+" 4 "+pass+" 5 "+provincia);
        bbdd.set(usuari, [nom, mail, pass, provincia]);
		document.getElementById("dades-registre").innerHTML = "<b> > Usuari:</b> " + usuari + "<br> > <b>Nom:</b> " + nom + "<br> > <b>Mail:</b> " + mail + "<br> > <b>Pass:</b> " + pass + "<br> > <b>Provincia:</b> "+provincia;

		//mostrem modal
		formulari.reset();
		document.getElementById('formulari__mensaje').classList.remove('formulari__mensaje-actiu');
		document.getElementById('formulari__mensaje-exito').classList.add('formulari__mensaje-exito-actiu');
		setTimeout(() => {
			document.getElementById('formulari__mensaje-exito').classList.remove('formulari__mensaje-exito-actiu');
		}, 5000);

		document.querySelectorAll('.formulari__grup-correcte').forEach((icona) => {
			icona.classList.remove('formulari__grup-correcte');
		});
		$('#registre-exitos').modal('show');
		$('#registre').collapse('hide');
	} else {
		document.getElementById('formulari__mensaje').classList.add('formulari__mensaje-actiu');
	}
});

// Funció principal
function validarFormulari (e) {
	switch (e.target.name) {
		case "usuari":
			validarCampo(expresiones.usuari, e.target, 'usuari');
		break;
		case "nom":
			validarCampo(expresiones.nom, e.target, 'nom');
		break;
		case "pass":
			validarCampo(expresiones.pass, e.target, 'pass');
			validarPassword2();
		break;
		case "pass2":
			validarPassword2();
		break;
		case "mail":
			validarCampo(expresiones.mail, e.target, 'mail');
		break;
	}
}

function validarCampo (expresion, input, campo) {
	if(expresion.test(input.value)){
		document.getElementById(`grup__${campo}`).classList.remove('formulari__grup-incorrecte');
		document.getElementById(`grup__${campo}`).classList.add('formulari__grup-correcte');
		document.querySelector(`#grup__${campo} i`).classList.add('fa-check-circle');
		document.querySelector(`#grup__${campo} i`).classList.remove('fa-times-circle');
		document.querySelector(`#grup__${campo} .formulari__input-error`).classList.remove('formulari__input-error-actiu');
		campos[campo] = true;
	} else {
		document.getElementById(`grup__${campo}`).classList.add('formulari__grup-incorrecte');
		document.getElementById(`grup__${campo}`).classList.remove('formulari__grup-correcte');
		document.querySelector(`#grup__${campo} i`).classList.add('fa-times-circle');
		document.querySelector(`#grup__${campo} i`).classList.remove('fa-check-circle');
		document.querySelector(`#grup__${campo} .formulari__input-error`).classList.add('formulari__input-error-actiu');
		campos[campo] = false;
	}
}

function comprovaProvincia (input, campo) {
	let provinciaOK;
	if(input !== "" && input !== undefined & input !== null) {
		document.getElementById(`grup__${campo}`).classList.remove('formulari__grup-incorrecte');
		document.getElementById(`grup__${campo}`).classList.add('formulari__grup-correcte');
		document.querySelector(`#grup__${campo} i`).classList.add('fa-check-circle');
		document.querySelector(`#grup__${campo} i`).classList.remove('fa-times-circle');
		document.querySelector(`#grup__${campo} .formulari__input-error`).classList.remove('formulari__input-error-actiu');
		provinciaOK = true;
	} else {
		document.getElementById(`grup__${campo}`).classList.add('formulari__grup-incorrecte');
		document.getElementById(`grup__${campo}`).classList.remove('formulari__grup-correcte');
		document.querySelector(`#grup__${campo} i`).classList.add('fa-times-circle');
		document.querySelector(`#grup__${campo} i`).classList.remove('fa-check-circle');
		document.querySelector(`#grup__${campo} .formulari__input-error`).classList.add('formulari__input-error-actiu');
		provinciaOK = false;
	}
	return provinciaOK;
}

function validarPassword2() {
	let inputPassword1 = document.getElementById('pass');
	let inputPassword2 = document.getElementById('pass2');

	if(inputPassword1.value !== inputPassword2.value){
		document.getElementById("grup__pass2").classList.add("formulari__grup-incorrecte");
		document.getElementById("grup__pass2").classList.remove("formulari__grup-correcte");
		document.querySelector("#grup__pass2 i").classList.add("fa-times-circle");
		document.querySelector("#grup__pass2 i").classList.remove("fa-check-circle");
		document.querySelector("#grup__pass2 .formulari__input-error").classList.add("formulari__input-error-actiu");
		campos.password = false;
	} else {
		document.getElementById("grup__pass2").classList.remove("formulari__grup-incorrecte");
		document.getElementById("grup__pass2").classList.add("formulari__grup-correcte");
		document.querySelector("#grup__pass2 i").classList.remove("fa-times-circle");
		document.querySelector("#grup__pass2 i").classList.add("fa-check-circle");
		document.querySelector("#grup__pass2 .formulari__input-error").classList.remove("formulari__input-error-actiu");
		campos.password = true;
	}
}

// ---------------------------------------------------------------------------------------
// BOTÓ 2: LOGIN
// ---------------------------------------------------------------------------------------
function Login() {
    var user = document.getElementById("loginuser").value;
    var pass = document.getElementById("loginpass").value;
    if (existeixUsuari(user, pass)){
		login.reset();
		document.getElementById('login__mensaje').classList.remove('formulari__mensaje-actiu');
		$('#login-exitos').modal('show');
		$('#login').collapse('hide');
    } else {
		document.getElementById('login__mensaje').classList.add('formulari__mensaje-actiu');
    }
}

function existeixUsuari(nom, pass) {
    let existeix = false;
    for (var [clau, valor] of bbdd) {
        if ((clau==nom) && (valor[2]==pass)) {
            existeix = true;
        }
    }
    return existeix;
}

// ---------------------------------------------------------------------------------------
// BOTÓ 3: CONSULTA
// ---------------------------------------------------------------------------------------
function mostraDades() {
    let imprimible = "";
    for (var [clau, valor] of bbdd) {
        imprimible = imprimible + "<b> > Usuari:</b> " + clau + "<br> > <b>Nom:</b> " + valor[0] + "<br> > <b>Mail:</b> " + valor[1] + "<br> > <b>Pass:</b> " + valor[2] + "</br> > <b>Provincia:</b> "+valor[3]+"<br><br>";
    }
    document.getElementById("llistadades").innerHTML = imprimible;
}