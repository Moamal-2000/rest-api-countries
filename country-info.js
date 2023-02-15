"use strict";

const websiteIconTag = document.querySelector(".website-icon"),
  backButton = document.querySelector("main .back-button-container"),
  flag = document.querySelector("main .country-container .img img"),
  nameCountry = document.querySelector(".country-container .country-info .name-country"),
  countryContent = document.querySelectorAll(".country-info .country-content li"),
  countryContentColumn2 = document.querySelectorAll(".country-container .country-info .country-content-prt2 li"),
  borderCountries = document.querySelector(".country-info .border-countries .countries"),
  darkMode = document.querySelector("header .dark-light-mode"),
  darkModeIconOff = document.createElement("i"),
  darkModeIconOn = document.createElement("i");






darkModeIconOff.className = "fa-solid fa-moon";
darkModeIconOn.className = "fa-regular fa-moon";
darkMode.prepend(darkModeIconOff);
darkMode.prepend(darkModeIconOn);
darkModeIconOff.style.display = "none";





let darkModeToggle = false;
let darkModeToggleLocal = localStorage.getItem('dark-mode-toggle')
if (darkModeToggleLocal !== null) {
  darkModeToggleLocal === 'false'
  ? darkModeToggle = true
  : darkModeToggle = false
  darkModeSwitcher()
}





function darkModeSwitcher() {
  if (!darkModeToggle) {
    document.documentElement.style.setProperty("--background", "#202c37");
    document.documentElement.style.setProperty("--text", "#ffffff");
    document.documentElement.style.setProperty(
      "--element-background",
      "#2b3945"
    );
    darkModeIconOn.style.display = "none";
    darkModeIconOff.style.display = "block";
    darkModeToggle = !darkModeToggle;

    localStorage.setItem('dark-mode-toggle', darkModeToggle)
  } else {
    document.documentElement.style.setProperty("--background", "");
    document.documentElement.style.setProperty("--text", "");
    document.documentElement.style.setProperty("--element-background", "");
    darkModeIconOn.style.display = "block";
    darkModeIconOff.style.display = "none";
    darkModeToggle = !darkModeToggle;
    localStorage.setItem('dark-mode-toggle', darkModeToggle)
  }
}
darkMode.addEventListener("click", darkModeSwitcher);





backButton.addEventListener("click", () => {
  location.href = "index.html";
});


let nameCountryLocal = localStorage.getItem("name-country");
document.querySelector("title").textContent = nameCountryLocal;
nameCountry.textContent = nameCountryLocal;






(async function getData() {
  const res = await fetch('data.json')
  const data = await res.json()
  addDataToPage(data);
  addBorderCountries(data);
})();





function addDataToPage(data) {
  let dataCountry;

  data.forEach((obj) => {
    if (nameCountryLocal === obj.name) dataCountry = obj;
  });

  let languages = "";
  websiteIconTag.href = dataCountry.flags.png;
  flag.src = dataCountry.flags.png;
  flag.setAttribute('alt', `${nameCountryLocal} flag`)

  countryContent[0].innerHTML = `Native Name: <span>${dataCountry.nativeName}</span>`;
  countryContent[1].innerHTML = `Population: <span>${dataCountry.population}</span>`;
  countryContent[2].innerHTML = `Region: <span>${dataCountry.region}</span>`;
  countryContent[3].innerHTML = `Sub Region: <span>${dataCountry.subregion}</span>`;
  countryContent[4].innerHTML = `Capital: <span>${dataCountry.capital}</span>`;
  countryContent[5].innerHTML = `Top Level Domain: <span>${dataCountry.topLevelDomain}</span>`;
  countryContentColumn2[0].innerHTML = `Currencies: <span>${dataCountry.currencies[0].name}</span>`;

  for (const i of dataCountry.languages) languages += ` ${i.name}`;
  languages = languages.trim().split(" ").join(", ");

  countryContentColumn2[1].innerHTML = `Languages: <span>${languages}</span>`;
  countryContentColumn2[2].innerHTML = `Time Zone: <span>${dataCountry.timezones[0]}</span>`;
  countryContentColumn2[3].innerHTML = `Numeric Code: <span>+${dataCountry.numericCode}</span>`;

  dataCountry.borders.forEach((border) => {
    borderCountries.innerHTML += `<button type="button">${border}</button>`;
  });
}





function addBorderCountries(data) {
  const bordersButtons = document.querySelectorAll(
    ".country-info .border-countries button"
  );

  for (const obj of data) {
    bordersButtons.forEach((button) => {
      if (button.textContent === obj.alpha3Code) button.textContent = obj.name;
    });
  }
}





// Fix problem infinite loop on data
setTimeout(() => {
  const bordersButtons = document.querySelectorAll(
    ".country-info .border-countries button"
  );

  for (let i = 0; i < bordersButtons.length; i++) {
    bordersButtons[i].addEventListener("click", () => {
      localStorage.setItem("name-country", bordersButtons[i].textContent);
      location.href = "country-info.html";
    });
  }
}, 500);
