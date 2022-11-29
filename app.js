const CurrBtn = document.querySelector('#CurrLocation');
// console.dir(CurrBtn);

const CityName = document.querySelector("#CityName");
// console.dir(CityName);
const Search = document.querySelector("#Search");

const disBox = document.querySelector('.display');
// console.dir(disBox);

const nav = document.querySelector('.display-nav');
// console.dir(nav);

const disInput = document.querySelector('.display-input');

const disMsg = document.querySelector('.display-msg');

const infoBox = document.querySelector('.infoItems');

const contactUs = document.querySelector('.foot h3');

const contactUsBox = document.querySelector(".display-AboutUs-items");

const contactUsNav = document.querySelector('.AboutUsNav');

contactUs.addEventListener('click', () => {
  AddAboutUsInfo();
})

const APIKey = "a40340e404ef11982d3749f85d5203ed";

let API;
let APIfore;

const options = {
  enableHighAccuracy: true,
  timeout: 35000,
  maximumAge: 30000
};

const succ = (pos) => {
  const { latitude, longitude } = pos.coords;
  API = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIKey}&units=metric`;

  APIfore = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${APIKey}&units=metric`;

  getWeather();
}

function err(error) {
  disMsg.style = "display: flex";
  const errMsg = document.querySelector('#status');
  errMsg.classList.add('err');
  errMsg.innerHTML = error.message;
  // console.log(error.message);
}

Search.addEventListener('click', (evt) => {
  // console.log(evt);
  // console.log(CityName.value);
  if (CityName.value != null) {
    evt.preventDefault();
    city = CityName.value;
    CityName.value = "";
    API = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=metric`;

    APIfore = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}&units=metric`;

    getWeather();
  }
})
CityName.addEventListener('keydown', (evt) => {
  if (evt.code === "Enter" && CityName.value != null) {
    evt.preventDefault();
    city = evt.srcElement.value;
    evt.srcElement.value = "";
    API = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=metric`;

    APIfore = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}&units=metric`;

    getWeather();
  }
})

CurrBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    pending = document.querySelector('#status');
    pending.classList.remove('err');
    pending.classList.add('suc');
    disMsg.style = "display: flex";
    navigator.geolocation.getCurrentPosition(succ, err, options);
  }
  else {
    alert("Your Browser do not support Current Location Function");
  }
})

const getWeather = async () => {
  disMsg.style = "display: flex";
  pending = document.querySelector('#status');
  pending.classList.remove('err');
  pending.classList.add('suc');
  pending.innerHTML = "Fetching Weather Information...";
  try {
    const res = await axios.get(API);
    const res2 = await axios.get(APIfore);
    addWeatherInfo(res.data);
    addWeatherForecast(res2.data);
  }
  catch (e) {
    pending.classList.add('err');
    pending.innerHTML = e.response.data.message;
  }
}

const addWeatherForecast = (foreData) => {
  const today = new Date();
  let data = today.getDate();
  let month = today.getMonth();
  let year = today.getFullYear();
  let days_in_month = new Date(year, ++month, 0).getDate();
  let count = 1;
  // console.log(foreData);
  // console.log(foreData.list);

  for (const i of foreData.list) {
    let date = new Date(i.dt * 1000);
    let data2 = date.getDate();
    if (data === data2 && count <= 5) {
      let day = document.querySelector(`#fore${count} #day`);
      if (count === 1) {
        day.innerHTML = "Today";
      }
      else {
        day.innerHTML = date.toLocaleDateString("en", { weekday: "short", });
      }

      let temp = document.querySelector(`#fore${count} #temp`);
      temp.innerHTML = `<p style = "font-size: 1.4rem">${Math.round(i.main.temp)}<sup>o</sup>C</p>`;

      let weath = document.querySelector(`#fore${count} #weath`);
      weath.innerHTML = `<p style = "font-size: 1.2rem">${i.weather[0].main}</p>`;

      setForeIcon(i.weather[0].id, count);

      if (data === days_in_month) {
        data = 1;
      } else {
        data++;
      }
      count++;
    }
  }
}

const addWeatherInfo = async (data) => {
  disBox.classList.remove('display');
  disBox.classList.add('info');
  nav.style = "display: flex";
  disInput.style = "display: none";
  infoBox.style = "display: flex";
  disMsg.style = "display: none";
  // console.log(data);

  LocName = document.querySelector("#loc_name");
  LocName.innerHTML = `<p>${data.name}, ${data.sys.country}</p>`;

  WeatDesc = document.querySelector("#weath span");
  WeatDesc.innerHTML = data.weather[0].main;

  Temp = document.querySelector('#temp_val');
  Temp.innerHTML = `<p>${Math.round(data.main.temp)}<sup>o</sup>C</p>`;

  Feels = document.querySelector("#feels_val p");
  Feels.innerHTML = `<p>${Math.round(data.main.feels_like)}<sup>o</sup>C</p>`;

  Hum = document.querySelector("#hum_val p");
  Hum.innerHTML = `<p>${data.main.humidity}%</p>`;

  setIcon(data.weather[0].id);
}

const setIcon = (code) => {
  icon = document.querySelector("#icon");

  if (code >= 200 && code <= 232) {
    icon.innerHTML = '<i class="fa-solid fa-cloud-bolt fa-4x"></i>';
  }
  else if (code >= 300 && code <= 321) {
    icon.innerHTML = '<i class="fa-solid fa-cloud-rain fa-4x"></i>';
  }
  else if (code >= 500 && code <= 531) {
    icon.innerHTML = '<i class="fa-solid fa-cloud-showers-heavy fa-4x"></i>';
  }
  else if (code >= 600 && code <= 622) {
    icon.innerHTML = '<i class="fa-solid fa-snowflake fa-4x"></i>';
  }
  else if (code >= 701 && code <= 781) {
    icon.innerHTML = '<i class="fa-solid fa-smog fa-4x"></i>';
  }
  else if (code === 800) {
    icon.innerHTML = '<i class="fa-solid fa-sun fa-4x"></i>';
  }
  else if (code > 800) {
    icon.innerHTML = '<i class="fa-solid fa-cloud fa-4x"></i>';
  }
}

const setForeIcon = (code2, count2) => {
  if (count2 <= 5) {

    // console.log(code2);
    foreIcon = document.querySelector(`#fore${count2} #icon`);

    if (code2 >= 200 && code2 <= 232) {
      foreIcon.innerHTML = '<i class="fa-solid fa-cloud-bolt fa-3x"></i>';
    }
    else if (code2 >= 300 && code2 <= 321) {
      foreIcon.innerHTML = '<i class="fa-solid fa-cloud-rain fa-3x"></i>';
    }
    else if (code2 >= 500 && code2 <= 531) {
      foreIcon.innerHTML = '<i class="fa-solid fa-cloud-showers-heavy fa-3x"></i>';
    }
    else if (code2 >= 600 && code2 <= 622) {
      foreIcon.innerHTML = '<i class="fa-solid fa-snowflake fa-3x"></i>';
    }
    else if (code2 >= 701 && code2 <= 781) {
      foreIcon.innerHTML = '<i class="fa-solid fa-smog fa-3x"></i>';
    }
    else if (code2 === 800) {
      foreIcon.innerHTML = '<i class="fa-solid fa-sun fa-3x"></i>';
    }
    else if (code2 > 800) {
      foreIcon.innerHTML = '<i class="fa-solid fa-cloud fa-3x"></i>';
    }
  }
}

nav.addEventListener('click', () => {
  disBox.classList.remove('info');
  disBox.classList.add('display');
  nav.style = "display: none";
  disMsg.style = "display: none";
  disInput.style = "display: flex";
  infoBox.style = "display: none";
})


const AddAboutUsInfo = () => {
  disBox.classList.remove('display');
  disBox.classList.remove('info');
  disInput.style = "display: none";
  disMsg.style = "display: none";
  nav.style = "display: none";
  infoBox.style = "display: none";
  contactUsBox.style = "display: flex";
}

contactUsNav.addEventListener('click', () => {
  disInput.style = "display: flex";
  contactUsBox.style = "display: none";
  disBox.classList.add('display');
})