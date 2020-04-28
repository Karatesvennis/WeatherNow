const elements = {
    searchForm: document.querySelector(".search-form"),
    searchInput: document.querySelector(".search-field"),
    location: document.getElementById("location"),
    results: document.querySelector(".result-panel"),
    weather: document.querySelector(".result-weather-condition"),
    temp: document.querySelector(".result-temperature"),
    wind: document.querySelector(".result-wind")
};

class Search {
    constructor (query) {
        this.query = query;
    }

    async getResults() {
        try {
            const result = await fetch(`https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/search/?query=${this.query}`);
            const data = await result.json();
            const woeID = data[0].woeid;
            const forecast = await fetch(`https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/${woeID}/`);
            const forecastData = await forecast.json();
            return forecastData;
        } catch (error) {
            alert("Error");
            console.log(error);
        }
    }

    displayResults(result) {
        elements.location.textContent = result.title;
        const daysArray = result.consolidated_weather.slice(0, 3);

        daysArray.forEach((element, index) => {
            document.querySelector(`.day-${index} .day-header`).textContent = `${element.applicable_date}`;
            document.querySelector(`.day-${index} .result-weather-condition`).textContent = `Weather: ${element.weather_state_name}`;
            document.querySelector(`.day-${index} .result-temperature`).textContent =
                `Min temp: ${element.min_temp.toFixed(1)} | 
                Max temp: ${element.max_temp.toFixed(1)}`;
            document.querySelector(`.day-${index} .result-wind`).textContent = `Wind: ${element.wind_speed.toFixed(1)}`;
        });
    }
}

const showResultsPanel = (showResults) => {
    showResults ? elements.results.classList.add("fade") : elements.results.classList.remove("fade");
};

const state = {};

showResultsPanel(false);

const controlSearch = async () => {
    const query = elements.searchInput.value;
    if (query) {
        // Create new search object and add to state
        state.search = new Search(query);
        try {
            const result = await state.search.getResults();
            state.search.displayResults(result);
            showResultsPanel(true);
        } catch (error) {
            console.log(error);
        }
    }
};



elements.searchForm.addEventListener("submit", e => {
    e.preventDefault();
    showResultsPanel(false);
    controlSearch();
});