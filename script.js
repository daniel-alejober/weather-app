const form = document.getElementById("form");
const main = document.getElementById("main");
const search = document.getElementById("search");
const timezone = document.getElementById("timezone");
const newBusqueda = document.querySelector(".research");
const fragmento = document.createDocumentFragment();
const newapi = "ca3fb0801ffd4bf99c9e513eac9767e0";
const apikey = "3265874a2c77ae4a04bb96236a642d2f";

const weatherCity = (city) =>
  `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;

async function getWeatherLocation(localizacion) {
  try {
    const respuesta = await fetch(weatherCity(localizacion));
    const data = await respuesta.json();

    if (data.cod == 404) {
      Swal.fire({
        icon: "error",
        title: '<span class="oops">Oops...</span>',
        text: "Este no es un país!",
      });
      search.value = "";
      main.innerHTML = "";
      timezone.innerHTML = "";
      return;
    } else {
      agregarClima(data);
      hide();
    }
  } catch (error) {
    console.log(error);
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const localizacion = search.value;

  if (localizacion) {
    getWeatherLocation(localizacion);
  }
});
/*quitar el teclado en el celular--- */
function hide() {
  document.activeElement.blur();
  search.blur();
}

newBusqueda.addEventListener("click", () => {
  main.innerHTML = "";
  timezone.innerHTML = "";
});

function agregarClima(data) {
  const temp = gradosKelvinACelcius(data.main.temp);
  const clima = document.createElement("div");
  clima.classList.add("clima");

  clima.innerHTML = `<h2 class="name"><span>Localización</span><span>${data.name}</span></h2>
        <p class="tiempo-clima" >${data.weather[0].description}</p>
        <div class="clima-img">
            <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png">
        </div>
        <p class="temperatura">${temp} °C</p>`;

  search.value = "";
  main.innerHTML = "";

  getTimeZone(data.coord.lon, data.coord.lat);

  fragmento.appendChild(clima);
  main.appendChild(fragmento);
}

function gradosKelvinACelcius(gradosK) {
  /*.toFixed(2) redonde el numero a solos dos decimales*/
  return Math.floor(gradosK - 273.15);
}

/*--------------Timezone--------------------------------- */

async function getTimeZone(longitud, latitud) {
  try {
    const respuesta = await fetch(
      `https://api.ipgeolocation.io/timezone?apiKey=${newapi}&lat=${latitud}&long=${longitud}`
    );
    const data = await respuesta.json();
    horaFecha(data);
  } catch (error) {}
}

function horaFecha(data) {
  const horaFechaContainer = document.createElement("div");
  horaFechaContainer.classList.add("hora-fecha");

  horaFechaContainer.innerHTML = `
        <p>${data.date_time_txt}</p>
    `;
  timezone.innerHTML = "";

  fragmento.appendChild(horaFechaContainer);
  timezone.appendChild(fragmento);
}

/*----dark mode-------------------------------------- */
const btnDark = document.querySelector(".dark-mode");

btnDark.addEventListener("click", () => {
  document.body.classList.toggle("oscuro");
});
