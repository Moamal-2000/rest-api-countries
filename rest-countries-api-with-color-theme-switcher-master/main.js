"use strict";

const darkMode = document.querySelector("header .dark-light-mode"),
  darkModeIconOff = document.createElement("i"),
  darkModeIconOn = document.createElement("i"),
  filter = document.querySelector(".search-container .filter-region"),
  filterList = document.querySelector(".search-container .filter-region .list-of-country"),
  filterLimitation = document.querySelector(".search-container .filter-limitation input"),
  countriesSection = document.querySelector("main .countries"),
  searchInp = document.querySelector(".search-container .input input");


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







let showCountries = parseInt(filterLimitation.value);
let showedCountries = 0;
filterLimitation.addEventListener("input", () => {
  showCountries = parseInt(filterLimitation.value);
  countriesSection.textContent = "";
  searchInp.value = "";
  showedCountries = 0;

  fetch("data.json")
    .then((res) => res.json())
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        if (
          selectedRegion.toLowerCase() === "all" &&
          showCountries !== showedCountries
        ) {
          addCountry(data[i]);
          showedCountries++;
          continue;
        }

        if (
          selectedRegion.toLowerCase() === data[i].region.toLowerCase() &&
          showCountries !== showedCountries
        ) {
          addCountry(data[i]);
          showedCountries++;
        }
      }
    });
});





let filterToggle = false;
let regionClicked = false;
let selectedRegion = "all";
filter.addEventListener("click", () => {
  if (!filterToggle) {
    filterList.style.display = "flex";
    filterToggle = !filterToggle;
  } else {
    if (!regionClicked) {
      filterList.style.display = "none";
      filterToggle = !filterToggle;
    }
  }
});





window.addEventListener("click", (e) => {
  if (
    !e.target.classList.contains("filter-region") &&
    e.target.textContent !== "Filter by Region" &&
    e.target.className !== "fa-solid fa-angle-down"
  ) {
    if (filterToggle) {
      filterList.style.display = "none";
      filterToggle = !filterToggle;
    }
  }

  // Check if one of region clicked
  Array.from(filterList.children).forEach((li) => {
    if (e.target.textContent === li.textContent) {
      selectedRegion = li.textContent;
      regionClicked = true;
    }
  });

  // Check if filter is open & check if one of region is clicked
  if (!filterToggle && regionClicked) {
    // Reset settings
    countriesSection.innerHTML = "";
    showCountries = parseInt(filterLimitation.value);
    regionClicked = false;

    // Get needed data
    fetch("data.json")
      .then((res) => res.json())
      .then((data) => {
        for (let i = 0; i < data.length; i++) {
          let selectedRegion = e.target.textContent.toLowerCase();
          let region = data[i].region.toLowerCase();

          if (selectedRegion === "all") {
            addCountry(data[i]);
            showCountries--;
            continue;
          }

          if (selectedRegion === region && showCountries !== 0) {
            addCountry(data[i]);
            showCountries--;
          }
        }
      });
  }
});







function addCountry(data) {
  // country container
  let country = document.createElement("div");
  country.classList.add("country");
  countriesSection.append(country);

  // flag img
  let flag = document.createElement("img");
  flag.src = data.flags.png;
  flag.classList.add("flag");
  country.append(flag);

  // content div
  let content = document.createElement("div");
  content.classList.add("content");
  country.append(content);

  // name country
  let nameCountry = document.createElement("h2");
  nameCountry.textContent = data.name;
  nameCountry.classList.add("name-country");
  content.append(nameCountry);

  nameCountry.addEventListener('click', () => {
    localStorage.setItem('name-country', data.name)
    location.href = 'country-info.html'
  })

  // population
  let population = document.createElement("div");
  population.innerHTML = `Population: <span>${data.population}</span`;
  population.classList.add("population");
  content.append(population);

  // region
  let region = document.createElement("div");
  region.innerHTML = `Region: <span>${data.region}</span`;
  region.classList.add("region");
  content.append(region);

  // capital
  let capital = document.createElement("div");
  capital.innerHTML = `Capital: <span>${data.capital}</span`;
  capital.classList.add("capital");
  content.append(capital);
}





countriesSection.innerHTML = "";
fetch("data.json")
  .then((res) => res.json())
  .then((data) => {
    for (let i = 0; i < data.length; i++) addCountry(data[i]);
  });







// Message not found span
const messageNotFound = document.createElement("span");
messageNotFound.classList.add("message-not-found");
messageNotFound.textContent = "The country you looking for is not found.";
messageNotFound.style.cssText = `
  font-weight: bold;
  font-size: 16px;
`;

// Message not a country
const messageNotCountry = document.createElement("span");
messageNotCountry.classList.add("message-not-country");
messageNotCountry.innerHTML = `The country you looking for is not found. Do you mean <a href="#">palatine</a>?`;






searchInp.addEventListener("input", () => {
  countriesSection.innerHTML = "";
  showCountries = parseInt(filterLimitation.value);
  fetch("data.json")
    .then((res) => res.json())
    .then((data) => {
      // Show specific country
      for (let i = 0; i < data.length; i++) {
        let countryName = data[i].name.toLowerCase();
        let inpText = searchInp.value.toLowerCase();
        if (countryName.includes(inpText) && showCountries !== 0) {
          addCountry(data[i]);
          showCountries--;
        } else if (inpText === "israel") {
          countriesSection.appendChild(messageNotCountry);
        }
      }

      if (countriesSection.children.length === 0)
        countriesSection.appendChild(messageNotFound);
    });
});
