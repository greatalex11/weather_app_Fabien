/* PREPA SWIPER JS

let divBlankWiki = document.getElementById("containerAdvisor");
console.log(divBlankWiki);
divBlankWiki.style.fontSize = "10px";
divBlankWiki.style.width = "300px";
divBlankWiki.style.height = "500px";
divBlankWiki.innerHTML = reponseTrippy;
*/

/*                          AJOUT DE LA VILLE A LA LISTE DES FAVORIS                        */
/*

            let tableFavoris = new Array();

            function favoris() {
              let ListFavoris = {
                ville: city,
                country: country,
                icone: sourceUrlGdeIcone,
              };

              tableFavoris.push(ListFavoris);
              console.log(tableFavoris);
              return tableFavoris;
            }

            let btnFavoris = document.getElementById("btnFavoris");
            btnFavoris.addEventListener("click", favoris);
            for (let favoList of tableFavoris) {
              console.log(favoList);
            }
            console.log(tableFavoris);





/**
 *
 *                     INSERTION DE LA GRANDE ICONE METEO - PAGE MAIN
 *
 **/

const firstC = document.getElementById("gdMeteoIcone").firstChild;
const gdIcone = document.createElement("img");
gdIcone.src = "/assets/meteo/gd_soleil.png";
firstC.before(gdIcone); // insertion gde img meteo avant span //

/**
 *
 *                      "L'ARBRE A FONCTIONS" - STRUCTURE PRINCIPALE PRG - PAGE MAIN
 *
 **/

function getData() {
  let ville = getVille();
  var latlon = getLatitudeLongitude(ville);
  console.log(latlon.latitude);
  let result = getMeteo(latlon);
}
const validateVille = document.querySelector("button");
const searchVille = document.querySelector("input");

validateVille.addEventListener("click", getData);

/**
 *
 *                       RECUP VALEUR CHAMP POUR RECHERCHE API GEOCODING
 *
 **/

function getVille(ville) {
  ville = searchVille.value;
  if (ville == "") {
    ville = "Besancon"; //valeur par défaut : besançon
    return ville;
  } else {
    return ville;
  }
}

/**
 *                                   FETCH API GEOCODING
 *
 *
 **/

/*{country code}*/
//creation objet latlon, easy to pass values//

async function getLatitudeLongitude(ville) {
  await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${ville},fr&limit=5&appid=0ecf229967bee135b64207c0a18df389`
  )
    .then((response) => response.json()) // convert to json//
    /*.then((json) => console.log(json)) //print data to console// */
    .then((response) => {
      i = 0;
      //for (let i = 0; i < response.length; i++) { qd je traiterai une liste de résultat//
      let latiVille = response[i].lat;
      let longiVille = response[i].lon;

      latlon = {
        latitude: latiVille,
        longitude: longiVille,
      };
    });
  console.log(latlon);
  return latlon;
}
/**
 *                                      FETCH API METEO
 *
 *
 **/

async function getMeteo(latlon) {
  //setTimeout(alert, 1000, "Message d'alerte après 2 secondes");//

  console.log(latlon.latitude);

  let url = `http://api.openweathermap.org/data/2.5/weather?lat=${latlon.latitude}&lon=${latlon.longitude},fr&appid=0ecf229967bee135b64207c0a18df389&units=metric`;

  await fetch(url)
    .then((response) => response.json())
    .then((response) => {
      i = 0;
      /*for (let i = 0; i < response.length; i++) {*/
      result = response[i];
    });
  return result;
}

async function getMeteo(latlon) {
  //setTimeout(alert, 1000, "Message d'alerte après 2 secondes");//

  console.log(latlon.latitude);

  let url = `http://api.openweathermap.org/data/2.5/weather?lat=${latlon.latitude}&lon=${latlon.longitude},fr&appid=0ecf229967bee135b64207c0a18df389&units=metric`;

  await fetch(url)
    .then((response) => response.json())
    .then((response) => {
      for (let i = 0; i < response.length; i++) {
        result = response[i];
      }
    });
  return result;
}

/*
            let findIcone = assoUrlIcon[0].find(
              (element) => element === weatherJ
            ); // ok! //
            console.log(findIcone); // ok! //
            console.log(weatherJ); // ok! //

            console.log(assoUrlIcon[1].find(findIcone));

            let beta = function reload(findIcone) {
              console.log(assoUrlIcon[1] == findIcone);
            };

            console.log(findIcone); // ok! clear sky //
            console.log(weatherJ); // ok! clear sky //

            for (let j = 0; j < assoUrlIcon[1][j]; j++) {
              console.log(assoUrlIcon[1].find(findIcone));
              //return assoUrlIcon[0][i].find(weatherJ);//
            }
          });
      }
    });
}
*/
