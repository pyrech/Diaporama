/*----------------------------------------------------------------

	Auteur: Pyrech  ( github.com/Pyrech )

	Version: 28 juillet 2011
	
	You can use this script in the way you want. It's free to use.
	Vous pouvez utilisez ce script comme vous voulez. Il est libre d'utilisation.

----------------------------------------------------------------*/

// Variable nécessaire au diaporama
var Repertoire;								// Variable indiquant le nom du répertoire des photos
var Tab_nom_images = new Array();			// Tableau contenant le nom de toutes les images
var Tab_nom_legende = new Array();			// Tableau contenant le nom de toutes les légendes
var Tab_description_legende = new Array();	// Tableau contenant la description de toutes les légendes
var Tab_images = new Array();				// Tableau qui contiendra les images

var conteneur;								// Indique le nom du conteneur du diapo
var compteur;								// Compteur permettant de parcourir tout le tableau d'images
var opacite;								// Opacité du plan 1
var changement;								// Indique si une image a fait un tour complet, et peut donc être remplacée
var pause;									// Indique si la lecture est en cours ou non
var boucle_lecture = null;					// Timer
var initialise = false;						// Permet de savoir si les init sont déjà effectueés

// Constantes
var HAUTEUR_IMAGE = "700";
var LARGEUR_IMAGE = "600";
var COEFF_FONDU = 0.015;		// Coefficient du fondu	
var DELAI_FONDU = 20;			// Opacité modifiée par incrémentation toutes les 20 ms
var DELAI_PAUSE = 5;			// Durées en secondes entre deux images


function Init(cont)
{
	if(!initialise)
	{
		conteneur = cont;
		pause = false;
		
		// Création du conteneur principal
		DIVdiapo = document.createElement("div");
		// Attribution de l'id "diapo"
		DIVdiapo.setAttribute("id", "diapo");
		
		// Création de la div de loading
		IMGloader = document.createElement("img");
		// Attribution de l'id "loader" et de la source
		IMGloader.setAttribute("id", "loader");
		IMGloader.setAttribute("src", "ressources/loader.gif");
		IMGloader.setAttribute("width", "126");
		IMGloader.setAttribute("height", "22");
		
		// Attachement au conteneur principal
		DIVdiapo.appendChild(IMGloader);
		
		// Attachement au conteneur du html
		document.getElementById(conteneur).appendChild(DIVdiapo);
		
		Precharger_Images();		
		Insertion_Diapo();
		compteur = 0;
		
		initialise = true;
	}

	if (Images_Chargees())
	{
		// Destruction du loader
		DIVdiapo.removeChild(IMGloader);
		
		// Les plans, toujours invisibles, et la barre prennent leurs places
		IMGplan0.style.display = "block";
		IMGplan1.style.display = "block";
		DIVbarre.style.display = "block";
		
		// On affiche la barre d'outils et l'image du plan 1
		opacite = 1;
		IMGplan1.style.opacity = opacite;
		
		boucle_lecture = setTimeout("Lecture()", DELAI_PAUSE*1000);
		
	}
	else
	{
		setTimeout("Init()", 200);
	}
}

// Chargement des 5 premières images en mémoire
function Precharger_Images()
{
	var nb_images_charger = 5;
	
	if(Tab_nom_images.length < 5)
	{
		nb_images_charger = Tab_nom_images.length;
	}
	
	for (i=0; i<nb_images_charger; i++)
	{
		Tab_images[i] = new Image();
		Tab_images[i].src = Repertoire + Tab_nom_images[i];
	}
}

function Insertion_Diapo()
{
	
	// Création du plan 0
	IMGplan0 = document.createElement("img");
	// Attribution de l'id et autres attributs
	IMGplan0.setAttribute("id", "plan0");
	IMGplan0.setAttribute("class", "plans");
	IMGplan0.setAttribute("src", Tab_images[1].src);
	IMGplan0.setAttribute("width", HAUTEUR_IMAGE);
	IMGplan0.setAttribute("height", LARGEUR_IMAGE);
	// Attachement au conteneur
	DIVdiapo.appendChild(IMGplan0);
	
	// Création du plan 1
	IMGplan1 = document.createElement("img");
	// Attribution de l'id et autres attributs
	IMGplan1.setAttribute("id", "plan1");
	IMGplan1.setAttribute("class", "plans");
	IMGplan1.setAttribute("src", Tab_images[0].src);
	IMGplan1.setAttribute("width", HAUTEUR_IMAGE);
	IMGplan1.setAttribute("height", LARGEUR_IMAGE);
	// Attachement au conteneur
	DIVdiapo.appendChild(IMGplan1);
	
	// Création de la barre d'outils
	DIVbarre = document.createElement("div");
	// Attribution de l'id
	DIVbarre.setAttribute("id", "barre-outils");
	
	// Création de la liste de controleurs
	ULcontroleurs = document.createElement("ul");
	// Attribution de l'id
	ULcontroleurs.setAttribute("id", "controleurs");
	
	// Création du controleur precedent
	LIprec = document.createElement("li");
	// Attribution de l'id
	LIprec.setAttribute("id", "precedent");
	// Attibution de l'évènement onmouseover
	LIprec.onclick = Precedent;
	// Attachement au conteneur
	ULcontroleurs.appendChild(LIprec);
	
	// Création du controleur pause
	LIpause = document.createElement("li");
	// Attribution de l'id
	LIpause.setAttribute("id", "pause");
	// Attibution de l'évènement onmouseover
	LIpause.onclick = Pause;
	// Attachement au conteneur
	ULcontroleurs.appendChild(LIpause);
	
	// Création du controleur suivant
	LIsuiv = document.createElement("li");
	// Attribution de l'id
	LIsuiv.setAttribute("id", "suivant");
	// Attibution de l'évènement onmouseover
	LIsuiv.onclick = Suivant;
	// Attachement au conteneur
	ULcontroleurs.appendChild(LIsuiv);				
	
	// Attachement de la liste de controleurs à la barre d'outils
	DIVbarre.appendChild(ULcontroleurs);				
	
	// Création du paragraphe nom
	Pnom = document.createElement("p");
	// Attribution de l'id
	Pnom.setAttribute("id", "nom");
	// Création du nom
	var texte_nom = document.createTextNode(Tab_nom_legende[0]);
	// Attachement du noeud texte
	Pnom.appendChild(texte_nom);
	// Attachement du paragraphe nom à la barre d'outils
	DIVbarre.appendChild(Pnom);
	
	// Création du paragraphe description
	Pdesc = document.createElement("p");
	// Attribution de l'id
	Pdesc.setAttribute("id", "description");
	// Création de la légende
	var texte_legende = document.createTextNode(Tab_description_legende[0]);
	// Attachement du noeud texte
	Pdesc.appendChild(texte_legende);
	// Attachement du paragraphe nom à la barre d'outils
	DIVbarre.appendChild(Pdesc);
	
	// Attachement de la barre d'outils au conteneur
	DIVdiapo.appendChild(DIVbarre);
	
}

function Images_Chargees()
{
	var complet = true;
	for (i=0; i<=Tab_images.length-1; i++)
	{
		if (!Tab_images[i].complete)
		{
			complet = false;
		}
	}
	return complet;
}

function Lecture()
{
	Chargement_Suivant()
	Switcher();
	Apparition_Fondu();
	
	if (!pause)
	{
		boucle_lecture = setTimeout("Lecture()", ((1/COEFF_FONDU)*DELAI_FONDU)+DELAI_PAUSE*1000);
	}
}

// Fonction permettant de switcher les images entre les plans 0 et 1
function Switcher()
{
	var src_temp = IMGplan0.src;
	
	// L'image du bas devient celle qui était en haut, visible
	IMGplan0.style.opacity = 1;
	IMGplan0.src = IMGplan1.src;
	
	changement = false;
	
	// L'image du haut devient celle qui était en bas, invisible, pour enchainer avec l'effet de fondu
	opacite = 0;
	IMGplan1.style.opacity = opacite;
	IMGplan1.src = src_temp;
	Changement_Textes();
}

function Apparition_Fondu()
{
	if (opacite < 1)
	{
		opacite += COEFF_FONDU;
		IMGplan1.style.opacity = opacite;
		setTimeout("Apparition_Fondu()", DELAI_FONDU);
	}
	else
	{
		opacite = 1;
		IMGplan0.style.opacity = 0;
		IMGplan1.style.opacity = opacite;
	
		// Indique que l'mage peut être changée
		changement = true;
	}
}

function Chargement_Suivant()
{
	// Compteur permettant de parcourir le tableau en boucle
	compteur++;
	if (compteur == Tab_images.length)
	{
		compteur = 0;
	}
	
	// Remplacement de l'image au plan 0 par l'image suivant celle du plan 1
	IMGplan0.src = Tab_images[compteur].src;
}

function Changement_Textes()
{
	// Création des nouveaux noeuds textes
	texte_nom = document.createTextNode(Tab_nom_legende[compteur]);
	texte_legende = document.createTextNode(Tab_description_legende[compteur]);
	
	// Suppression des anciens noeux
	Pnom.removeChild(Pnom.firstChild);
	Pdesc.removeChild(Pdesc.firstChild);
	
	// Attachement des noeuds textes
	Pnom.appendChild(texte_nom);
	Pdesc.appendChild(texte_legende);
}

function Pause()
{
	if (!pause)
	{
		clearTimeout(boucle_lecture);									// Annulation de la prochaine lecture
		
		document.getElementById("pause").id = "play";					// Changement de l'icone de pause pour celui de lecture
		pause = true;
	}
	else
	{
		document.getElementById("play").id = "pause";					// Changement de l'icone de lecture pour celui de pause
		pause = false;
		
		boucle_lecture = setTimeout("Lecture()", DELAI_PAUSE*1000);		// Relance de la lecture
	}
}

function Precedent()
{
	if (changement)
	{
		clearTimeout(boucle_lecture);
		
		// Compteur permettant de parcourir le tableau en boucle
		compteur -=2;
		if (compteur == -1)
		{
			compteur = Tab_images.length-1;
		}
		else if (compteur == -2)
		{
			compteur = Tab_images.length-2;
		}
		
		// Remplacement de l'image au plan 0 par l'image precedant celle du plan 1
		IMGplan0.src = Tab_images[compteur].src;
		
		Lecture();
	}
}

function Suivant()
{
	if (changement)
	{
		clearTimeout(boucle_lecture);
		Lecture();
	}
}