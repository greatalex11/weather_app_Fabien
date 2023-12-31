/**
 *                                                        swiper cst
 *
 *
 **/
let returnVille;


const swiper = new Swiper(".swiper", {
  // Optional parameters
  direction: "horizontal",
  loop: true,

  on: {
    init: function () {
      console.log("swiper initialized");
    },

    // If we need pagination
    pagination: {
      el: ".swiper-pagination",
    },

    // Navigation arrows
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },

    // And if we need scrollbar
    scrollbar: {
      el: ".swiper-scrollbar",
    },
  },
});

swiper.on("slideChange", function () {
  console.log("slide changed");
});


let dateJourFavoris = new Date();
let dateFavoris = dateJourFavoris.getDate();

function recordRandom() {
  let historiques = localStorage.getItem("favoris")||JSON.stringify([]);
  historiques = JSON.parse(historiques);
  if(returnVille == null)  
    return false;
  historiques.push(returnVille);
  let historiques_string = JSON.stringify(historiques);
  localStorage.setItem('favoris', historiques_string);
}

const favorisBtn = document
  .querySelector("#infoLike")
  .addEventListener("click", recordRandom);

/**
 *                                          FETCH LISTE VILLES EN LOCAL / RANDOM
 *
 *
 **/


async function villesDataList() {
  console.log("click sur random")
  returnVille = await fetch(`./json/city.list.json`)
  .then((response) => response.json())
  .then((response) => {
    console.log(response)
    let villesRamdomList = response;
    let resultVilleRandom = villesRamdomList[Math.floor(Math.random() * villesRamdomList.length)];
    let villeName = resultVilleRandom.name;

    getVilleRandom(villeName);
    return resultVilleRandom;
  });
  console.log(returnVille)
  return returnVille;
}
console.log(returnVille)

let btnRandom = document.getElementById("btnRandom");
btnRandom.addEventListener("click", villesDataList);

/**
 *                                            FETCH TRIPADVISOR EN LOCAL
 *
 *
 **/

function trippy() {
  fetch(`./php/scrapp-google.php`)
    .then((response) => response.text())
    .then((response) => {
      let reponseTrippy = response;

      let trippy = document.getElementById("trippySecond");
      trippy.style.fontSize = "10px";
      trippy.style.overflow = "ellipsis";
      trippy.style.margin = "5px 5px 5px 18px";
      trippy.innerHTML = reponseTrippy;
    });
}

let butonTrippy = document.getElementById("buttonTrippy");
butonTrippy.addEventListener("click", trippy);

/**
 *
 *
 *                                                FETCH WIKI EN LOCAL
 *
 **/

function wiki() {
  fetch(`./php/scrapp-wikipedia.php`)
    .then((response) => response.text())
    .then((response) => {
      let reponseWiki = response;
      //console.log(reponseWiki);//
      let divWiki = document.getElementById("wikiSecond");
      divWiki.style.fontSize = "10px";
      divWiki.style.overflow = "ellipsis";
      /*divWiki.style.overflow = "break-word";*/
      divWiki.style.margin = "5px";
      divWiki.innerHTML = reponseWiki;
    });
}
let butonWiki = document.getElementById("buttonWiki");
butonWiki.addEventListener("click", wiki);

/**
 *
 *                                       EXTRACTION DES DATA WEATHER 4j
 *
 **/

function getMeteoObjByJson(myarray) {
  let data = new Array();

  for (let i = 0; i < 40; i++) {
    if (myarray[i].dt_txt.includes("12:00:00")) {
      let date_txt = myarray[i].dt_txt;
      let description = myarray[i].weather[0].description;
      let temperature = myarray[i].main.temp;
      let returndata = {
        date: date_txt,
        description: description,
        temperature: temperature,
      };
      data.push(returndata); //l'un derrrière l'autre//
      //console.log(returndata);//
    }
  }
  return data;
}

/**
 *
 *                          "L'ARBRE A FONCTIONS" - STRUCTURE PRINCIPALE PRG - PAGE MAIN
 *
 **/

function getData() {
  let ville = getVille(); //input "ville choisie"//
  let latlon = getLatitudeLongitude(ville, "search");
}

let validateVille = document.querySelector("button");
const searchVille = document.querySelector("input");
validateVille.addEventListener("click", getData);

/**
 *
 *                                 RECUP VALEUR CHAMP POUR RECHERCHE API GEOCODING
 *
 **/

function getVille(ville) {
  if ((validateVille = true)) {
    ville = searchVille.value;
    if (ville == "") {
      ville = "Besancon"; //valeur par défaut : besançon
      return ville;
    } else {
      return ville;
    }
  }
}

/*{country code}*/
//creation objet latlon, easy to pass values*/

/**
 *                                   INTEGRATION RESULTATS FUNCT RANDOM
 *
 *
 **/

function getVilleRandom(monObjet2) {
  getLatitudeLongitude(monObjet2, "random");
  
}

let effetAffichage;
function affichageEffet(city) {
  divVille = document.getElementById("ville");
  divVille.innerHTML = "";

  if (document.getElementById("typingDemo") == undefined) {
    monSpan = document.createElement("span");
    monSpan.id = "typingDemo";
    //console.log(city);
    divVille.append(monSpan);
  } else {
    monSpan = document.getElementById("typingDemo");
  }
  monSpan.innerHTML = city;
}

/**
 *                                             FETCH API GEOCODING
 *
 *
 **/

async function getLatitudeLongitude(ville, callType = "search") {
  console.log(ville);
  await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${ville}&limit=5&appid=0ecf229967bee135b64207c0a18df389`
  )
    .then((response) => response.json()) // convert to json//
    /*.then((json) => console.log(json)) //print data to console// */
    .then(async (response) => {
      i = 0;
      console.log(response)
      if(response.length === 0) {
        return villesDataList();
      }
      //for (let i = 0; i < response.length; i++) { qd je traiterai une liste de résultat//
      let latiVille = response[i].lat;
      let longiVille = response[i].lon;

      latlon = {
        latitude: latiVille,
        longitude: longiVille,
      };
      //console.log(latlon);//

      /**
       *                                       FETCH API METEO
       *
       *
       **/

      await meteo(latlon);

      async function meteo(latlon) {
        let city = "";
        await fetch(
          `http://api.openweathermap.org/data/2.5/forecast?lat=${latlon.latitude}&lon=${latlon.longitude}&appid=0ecf229967bee135b64207c0a18df389&units=metric`
        )
          .then((response) => response.json()) // convert to json//
          /*.then((json) => console.log(json));                                               //print data to console// */
          .then((response) => {
            //console.log(response);//

            let city = response["city"]["name"];
            let country = response["city"]["country"];
            let dateJ = response["list"][0]["dt_txt"];
            let tempJ = response["list"][0]["main"]["temp"];
            let weatherJ = response["list"][0]["weather"][0]["description"];
            let tempMaxJ = response["list"][0]["main"]["temp_max"];
            let tempMinJ = response["list"][0]["main"]["temp_min"];

            //console.log(country);//

            /*
             *                                AFFICHAGE RESULAT METEO
             *
             *
             */

            if (callType == "search") {
              let cityLabel = document.querySelector("#ville");
              cityLabel.innerHTML = city;
            } else {
              affichageEffet(city);
            }

            let affichageTemperature = document.querySelector(
              "#gdMeteoIcone > span"
            );
            affichageTemperature.innerHTML = tempJ.toFixed(1) + "°";

            let countryCodeJ = (document.getElementById("pays").innerHTML =
              country);

            /**
             *                                 TABLE ASSOCIATION ICONE_URL
             *
             *
             **/

            let description = [
              "clear sky",
              "few clouds",
              "scattered clouds",
              "broken clouds",
              "shower rain",
              "rain",
              "thunderstorm",
              "light rain",
              "overcast clouds",
              "snow",
              "mist",
              "moderate rain",
            ];

            let urlIcon = [
              "../assets/meteo/gd_soleil.png",
              "../assets/meteo/gd_clairci.png",
              "../assets/meteo/gd_nuageux.png",
              "../assets/meteo/gd_nuageux.png",
              "../assets/meteo/gd_nuageux.png",
              "../assets/meteo/gd_pluie.png",
              "../assets/meteo/gd_nuageux.png",
              "../assets/meteo/gd_pluie.png",
              "../assets/meteo/gd_nuageux.png",
              "../assets/meteo/gd_neige.png",
              "../assets/meteo/gd_neige.png",
              "../assets/meteo/gd_pluie.png",
            ];

            let assoUrlIcon = new Array(description, urlIcon);
            //console.table(assoUrlIcon);//

            /*console.log(assoUrlIcon[0][0]);
            console.log(assoUrlIcon[1][0]); // ok! mais pas en fonction de la ville mais tu array//
            */
            let findIcone = assoUrlIcon[0].findIndex(
              (element) => element === weatherJ
            );
            /*console.log(findIcone); // ok! //
              console.log(weatherJ); // ok! //
            */
            let sourceUrlGdeIcone = null;
            sourceUrlGdeIcone = assoUrlIcon[1][findIcone]; //  variable de récupération de l'url icone  //

            let divGdeIcone = (document.getElementById(
              "gdMeteoIcone"
            ).innerHTML =
              `<img width=120 src='` +
              sourceUrlGdeIcone +
              `'>` +
              `<span>` +
              Math.round(tempJ) +
              `°` +
              `</span>`);

            let divMedianMin = (document.getElementById("temp_Min").innerHTML =
              `<span>` + Math.round(tempMinJ) + ` ° Min` + `</span>`);

            let divMedianMax = (document.getElementById("temp_Max").innerHTML =
              `<span>` + Math.round(tempMaxJ) + ` ° Max` + `</span>`);

            let joursemaine2 = new Array();
            joursemaine2 = ["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"];

            //console.log(dateJ);//
            /*console.log(joursemaine2[dateJ.getDay()]);*/

            let divJJ = (document.getElementById("dateJJHH").innerHTML =
              `<p>` + dateJ);

            //console.log(divMedianMax, divMedianMin, divGdeIcone);//

            /**
             *                                 TABLE FORECAST
             *
             *
             **/

            let monObjet = getMeteoObjByJson(response["list"]);
            //console.log(monObjet);//

            for (let l = 0; l < monObjet.length; l++) {
              let findIcone = assoUrlIcon[0].findIndex(
                //index si//
                (element) => element === monObjet[l].description
              ); //description=description//

              let urlIcone = assoUrlIcon[1][findIcone];
              let datejouractuel = new Date(monObjet[l].date);
              let joursemaine = new Array();
              joursemaine = ["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"];

              //console.log(datejouractuel.getDay());//

              let div = (document.getElementById("jour" + (l + 1)).innerHTML =
                `<p>` +
                joursemaine[datejouractuel.getDay()] +
                `</p> <p><img width=30 src='` +
                urlIcone +
                `'></p> <p>` +
                Math.round(monObjet[l].temperature) +
                `°` +
                `</p>`);
              if (l == 3) {
                break;
              }
            }
          });
      }
    });
}

/*
  // And if we need scrollbar
  scrollbar: {
    el: ".swiper-scrollbar",

//                                              IA    url grande icone                                 //

let urlCorrespondant = null;

            for (let j = 0; j < assoUrlIcon.length; j++) {
              let description2 = assoUrlIcon[0][j];
              let url = assoUrlIcon[1][j];

              console.log(description2); //ok indique bien 1&2L 1C//
              console.log(url);

              if (description2 === weatherJ) {
                urlCorrespondant = url;
                console.log(urlCorrespondant); // null !!
              }
            } 
    */
