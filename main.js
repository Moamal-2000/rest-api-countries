"use strict";

// Selectors
const darkMode = document.querySelector("header .dark-light-mode"),
  darkModeIconOff = document.createElement("i"),
  darkModeIconOn = document.createElement("i"),
  filter = document.querySelector(".search-container .filter-region"),
  filterIcon = document.querySelector(".search-container .filter-region i"),
  filterList = document.querySelector(".search-container .filter-region .list-of-country"),
  filterLimitation = document.querySelector(".search-container .filter-limitation input"),
  countriesSection = document.querySelector("main .countries"),
  searchInp = document.querySelector(".search-container .input input"),
  searchInpContainer = document.querySelector(".search-container .input"),
  searchInputAxeIcon = document.querySelector(".search-container .input .delete");




// Variables
let numOfCountries = parseInt(filterLimitation.value),
  showedCountries = 0,
  darkModeToggle = false,
  filterToggle = false,
  regionClicked = false,
  selectedRegion = "all";




// Initiate code
// Setup dark mode icons
darkModeIconOff.className = "fa-solid fa-moon";
darkModeIconOn.className = "fa-regular fa-moon";
darkMode.prepend(darkModeIconOff);
darkMode.prepend(darkModeIconOn);
darkModeIconOff.style.display = "none";

// Set the dark mode state that saved in localStorage
let darkModeToggleLocal = localStorage.getItem("dark-mode-toggle");
if (darkModeToggleLocal !== null) {
  darkModeToggleLocal === "false"
    ? (darkModeToggle = true)
    : (darkModeToggle = false);
  darkModeSwitcher();
}

  // Message not found span
const messageNotFound = document.createElement("span");
messageNotFound.classList.add("message-not-found");
messageNotFound.textContent = "The country you looking for is not found.";
messageNotFound.style.cssText = `
  font-weight: bold;
  font-size: 16px;
`;

  // Message israel not a country
const messageNotCountry = document.createElement("span");
messageNotCountry.classList.add("message-not-country");
messageNotCountry.innerHTML = `The country you looking for is not found. Do you mean <a href="#">Palestine, State of</a>?`;


countriesSection.innerHTML = "";





// Functions
(async function renderCountriesInThePage() {
  const res = await fetch("data.json");
  const data = await res.json();
  for (let i = 0; i < numOfCountries; i++) addCountry(data[i]);
})();



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

    localStorage.setItem("dark-mode-toggle", darkModeToggle);
  } else {
    document.documentElement.style.setProperty("--background", "");
    document.documentElement.style.setProperty("--text", "");
    document.documentElement.style.setProperty("--element-background", "");
    darkModeIconOn.style.display = "block";
    darkModeIconOff.style.display = "none";
    darkModeToggle = !darkModeToggle;
    localStorage.setItem("dark-mode-toggle", darkModeToggle);
  }
}



async function getFilteredCountries() {
  const isOptionAllCountries = selectedRegion.toLowerCase() === "all";
  const res = await fetch("data.json");
  const data = await res.json();

  for (let i = 0; i < data.length; i++) {
    const isItSelectedRegion =
      selectedRegion.toLowerCase() === data[i].region.toLowerCase();
    const isNotEnoughShowingCountries = numOfCountries !== showedCountries;

    if (isOptionAllCountries && isNotEnoughShowingCountries) {
      addCountry(data[i]);
      showedCountries++;
      continue;
    }

    if (isItSelectedRegion && isNotEnoughShowingCountries) {
      addCountry(data[i]);
      showedCountries++;
    }
  }
}



function handleFilterLimitation() {
  numOfCountries = parseInt(filterLimitation.value);
  countriesSection.textContent = "";
  searchInp.value = "";
  showedCountries = 0;
  getFilteredCountries();
}



function handleRegionsFilter() {
  if (!filterToggle) {
    filterList.classList.add("active");
    filterIcon.classList.add("active");
    filterToggle = !filterToggle;
  } else {
    if (!regionClicked) {
      filterList.classList.remove("active");
      filterIcon.classList.remove("active");
      filterToggle = !filterToggle;
    }
  }
}



function addCountry(data) {
  // country container
  const country = document.createElement("div");
  country.classList.add("country");
  countriesSection.append(country);

  // flag img
  const flag = document.createElement("img");
  flag.src = data.flags.png;
  flag.classList.add("flag");
  flag.setAttribute("alt", "flag country");
  country.append(flag);

  // content div
  const content = document.createElement("div");
  content.classList.add("content");
  country.append(content);

  // name country
  const nameCountry = document.createElement("h2");
  nameCountry.textContent = data.name;
  nameCountry.classList.add("name-country");
  content.append(nameCountry);

  nameCountry.addEventListener("click", () => {
    localStorage.setItem("name-country", data.name);
    location.href = "country-info.html";
  });

  // population
  const population = document.createElement("div");
  population.innerHTML = `Population: <span>${data.population}</span`;
  population.classList.add("population");
  content.append(population);

  // region
  const region = document.createElement("div");
  region.innerHTML = `Region: <span>${data.region}</span`;
  region.classList.add("region");
  content.append(region);

  // capital
  const capital = document.createElement("div");
  capital.innerHTML = `Capital: <span>${data.capital}</span`;
  capital.classList.add("capital");
  content.append(capital);
}


function handleSearchInput() {
  countriesSection.innerHTML = "";
  numOfCountries = parseInt(filterLimitation.value);

  (async function getData() {
    const res = await fetch("data.json");
    const data = await res.json();
    // Show specific country
    for (let i = 0; i < data.length; i++) {
      let countryName = data[i].name.toLowerCase();
      let inpText = searchInp.value.toLowerCase();
      if (countryName.includes(inpText) && numOfCountries !== 0) {
        addCountry(data[i]);
        numOfCountries--;
      } else if (inpText === "israel")
        countriesSection.appendChild(messageNotCountry);
    }

    if (countriesSection.children.length === 0)
      countriesSection.appendChild(messageNotFound);
  })();
}



function handleGeneralClick(e) {
  const target = e.target
  const notContainsClassFilterRegion = !target.classList.contains("filter-region")
  const notEqualToText = target.textContent !== "Filter by Region"
  const notAngleDownIcon = target.className !== "fa-solid fa-angle-down"


  // Toggle filter by regions
  if (notContainsClassFilterRegion && notEqualToText && notAngleDownIcon) {
    if (filterToggle) {
      filterList.classList.remove("active");
      filterIcon.classList.remove("active");
      filterToggle = !filterToggle;
    }
  }


  // Check if one of region clicked
  Array.from(filterList.children).forEach((li) => {
    if (target.textContent === li.textContent) {
      selectedRegion = li.textContent;
      regionClicked = true;
    }
  });


  // Check if filter is open & check if one of region is clicked
  if (!filterToggle && regionClicked) {
    // Reset settings
    countriesSection.innerHTML = "";
    numOfCountries = parseInt(filterLimitation.value);
    regionClicked = false;

    (async function getData() {
      const res = await fetch("data.json");
      const data = await res.json();
      for (let i = 0; i < data.length; i++) {
        let selectedRegion = target.textContent.toLowerCase();
        let region = data[i].region.toLowerCase();

        if (selectedRegion === "all") {
          addCountry(data[i]);
          numOfCountries--;
          continue;
        }

        if (selectedRegion === region && numOfCountries !== 0) {
          addCountry(data[i]);
          numOfCountries--;
        }
      }
    })();
  }

  // Remove active class on search input
  const isNotSearchClassSearch = !target.classList.contains("search")
  const isNotAxeIcon = !target.classList.contains("delete")
  const isNotInputTag = !target.classList.contains("input")
  const isNotSearchClassSearchInput = !target.classList.contains("search-input")
  const removeClassActive = 
    isNotSearchClassSearch &&
    isNotAxeIcon &&
    isNotInputTag &&
    isNotSearchClassSearchInput

  if (removeClassActive) {
    searchInpContainer.classList.remove("active");
    searchInputAxeIcon.classList.remove("active");
  }
}





// Events
darkMode.addEventListener("click", darkModeSwitcher);

filterLimitation.addEventListener("input", () => handleFilterLimitation());

filter.addEventListener("click", () => handleRegionsFilter());

messageNotCountry.addEventListener("click", () => {
  localStorage.setItem("name-country", messageNotCountry.children[0].textContent);
  location.href = "country-info.html";
});

searchInpContainer.addEventListener("click", () => {
  searchInpContainer.classList.add("active");
  searchInputAxeIcon.classList.add("active");
  searchInp.focus();
});

searchInp.addEventListener("input", () => handleSearchInput());

searchInputAxeIcon.addEventListener("click", () => {
  searchInp.value = "";
});

window.addEventListener("click", (e) => handleGeneralClick(e));
