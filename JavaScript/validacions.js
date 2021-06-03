// Mapa per guardar les dades de registre i simular el Backend
var bbdd = new Map();

// Dades de prova: (usuari, [correu, contrassenya, província])
bbdd.set("usuari1", ["Nom 1", "prova1@prova.cat", "Pass0001", "Barcelona"]);
bbdd.set("usuari2", ["Nom 2", "prova2@prova.cat", "Pass0002", "Girona"]);
bbdd.set("usuari3", ["Nom 3", "prova3@prova.cat", "Pass0003", "Tarragona"]);
bbdd.set("usuari4", ["Nom 4", "prova4@prova.cat", "Pass0004", "Lleida"]);

// ---------------------------------------------------------------------------------------
// BOTÓ 1: REGISTRE
// ---------------------------------------------------------------------------------------

// Escribim les expressions regulars que ha de complir cada camp
const expresiones = {
	usuari: /^[a-zA-Z0-9\_\-]{4,16}$/,
	nom: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
	pass: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
	mail: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/ 
};

// Inicialitzem tots els camps amb expressions regulars a incorrectes
const campos = {Usuari: false, Nom: false, Pass: false, Pass2: false, Mail: false};

// EventListeners pels Inputs
document.querySelectorAll('#formulari input').forEach((input) => {
	input.addEventListener('keyup', validarFormulari); //Quan escribim una lletra
	input.addEventListener('blur', validarFormulari);  //Quan per el focus
});

// EventListeners pel Formulari complet
function Formulari (e) {
	e.preventDefault();
	let usuari = e.target[0].value;
	let mail = e.target[4].value;
	let provincia = e.target[5];
	let condicions = e.target[6];
	
	if (jaExisteix(usuari, mail)) { 
		//Si l'usuari ja és a la base de dades (per user o mail) mostrem un avís
		e.target.children[0].children[7].classList.add('formulariMensaje-actiu'); //formulariJaExisteix
	} else if(campos.Usuari && campos.Nom && campos.Pass && campos.Pass2 && campos.Mail && validarProvincia(provincia) && condicions.checked){
		//Guardem a la base de dades
		let nom = e.target[1].value;
		let pass = e.target[2].value;
        bbdd.set(usuari, [nom, mail, pass, provincia.value]);
		e.target.parentElement.parentElement.children[4].children[0].children[0].children[1].children[1].innerHTML = "<b> > Usuari:</b> " + usuari + "<br> > <b>Nom:</b> " + nom + "<br> > <b>Mail:</b> " + mail + "<br> > <b>Pass:</b> " + pass + "<br> > <b>Provincia:</b> "+provincia.value;
		
		//Eliminem els camps i possibles missatges d'error anteriors
		e.target.reset();
		e.target.children[0].children[8].classList.remove('formulariMensaje-actiu');
		e.target.children[0].children[8].classList.remove('formulariJaexisteix-actiu');
		e.target.children[1].children[0].children[1].classList.add('formulariMensaje-exito-actiu');
		setTimeout(() => {
			e.target.children[1].children[0].children[1].classList.remove('formulariMensaje-exito-actiu');
		}, 5000);
		document.querySelectorAll('.formulariGrup-correcte').forEach((icona) => {
			icona.classList.remove('formulariGrup-correcte');
		});

		//Mostrem la finestra modal
		$('#registre-exitos').modal('show');
		$('#registre').collapse('hide');
	} else {
		e.target.children[0].children[8].classList.add('formulariMensaje-actiu');
	}
}

// Funcions de validació
function validarFormulari(e) {
	switch (e.target.name) {
		case "usuari":
			validarCampo(expresiones.usuari, e.target, "Usuari");
		break;
		case "nom":
			validarCampo(expresiones.nom, e.target, "Nom");
		break;
		case "pass":
			validarCampo(expresiones.pass, e.target, "Pass");
			validarPassword2(e.target, e.target.parentElement.parentElement.parentElement.children[3].children[1].children[0]);
		break;
		case "pass2":
			validarPassword2(e.target.parentElement.parentElement.parentElement.children[2].children[1].children[0], e.target);
		break;
		case "mail":
			validarCampo(expresiones.mail, e.target, "Mail");
		break;
	}
}
function validarCampo (expresion, input, campo) {
	if(expresion.test(input.value)){
		correcte(input.parentElement);
		campos[campo] = true;
	} else {
		incorrecte(input.parentElement);
		campos[campo] = false;
	}
}
function validarProvincia(input) {
	let provinciaOK;
	if(input.value !== "" && input.value !== undefined & input.value !== null) {
		correcte(input.parentElement);
		provinciaOK = true;
	} else {
		incorrecte(input.parentElement);
		provinciaOK = false;
	}
	return provinciaOK;
}
function validarPassword2(inputPassword1, inputPassword2) {
	if(inputPassword1.value == inputPassword2.value){
		correcte(inputPassword2.parentElement);
		campos.Pass2 = true;
	} else {
		incorrecte(inputPassword2.parentElement);
		campos.Pass2 = false;
	}
}
function jaExisteix(usuari, mail) {
	let existeix = false;
		for (let [clau, valor] of bbdd) {
			if ((clau==usuari) || (valor[1]==mail)) {
				existeix = true;
			}
		}
    return existeix;
}
function correcte(input) {
	input.parentElement.classList.remove('formulariGrup-incorrecte');
	input.parentElement.classList.add('formulariGrup-correcte');
	input.children[1].classList.add('fa-check-circle');
	input.children[1].classList.remove('fa-times-circle');
	input.parentElement.children[2].classList.remove('formulariInput-error-actiu');
}
function incorrecte(input) {
	input.parentElement.classList.add('formulariGrup-incorrecte');
	input.parentElement.classList.remove('formulariGrup-correcte');
	input.children[1].classList.add('fa-times-circle');
	input.children[1].classList.remove('fa-check-circle');
	input.parentElement.children[2].classList.add('formulariInput-error-actiu');
}

// ---------------------------------------------------------------------------------------
// BOTÓ 2: LOGIN
// ---------------------------------------------------------------------------------------
function Login(e) {
	e.preventDefault();
    if (existeixUsuari(e.target[0].value, e.target[1].value)){
		//Eliminem els camps i possibles missatges d'error anteriors
		e.target.reset();
		e.target.children[0].children[2].classList.remove('formulariMensaje-actiu');
		//Mostrem la finestra modal
		$('#login-exitos').modal('show');
		$('#login').collapse('hide');
    } else {
		e.target.children[0].children[2].classList.add('formulariMensaje-actiu');
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