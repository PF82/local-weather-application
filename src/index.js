import { meterSecToKmH, meterSecToMpH, degreesToDirections, speedGustToKmH, speedGustToMpH, utcTogmt } from "./js/weather-data.js";
import { backgroundImageChange } from "./js/background-img.js";

window.addEventListener('load', () => {
    let lon;
    let lat;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            console.log(position)
            lon = position.coords.longitude;
            lat = position.coords.latitude;

            const apiKey = "229123719331231a3ae10f87dcb22d0d";

            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)

                .then((response) => {
                    if (!response.ok) {
                        alert("No weather found");
                        throw new Error("No weather found");
                    }
                    return response.json();
                })

                .then((data) => {

                    const name = data.name;
                    const { country } = data.sys;
                    const dataReceivingTime = data.dt;
                    const { description, icon } = data.weather[0];
                    const { temp, feels_like, temp_min, temp_max, pressure, humidity } = data.main;
                    const { visibility } = data;
                    const { sunset, sunrise } = data.sys;
                    const { speed, deg, gust } = data.wind;

                    const dt = dataReceivingTime;
                    var id = data.weather[0]['id'];

                    var currentTime = new Date(dt * 1000);
                    var sunriseTime = new Date(sunrise * 1000);
                    var sunsetTime = new Date(sunset * 1000);

                    function dayAndNightImages(currentTime) {
                        if (currentTime > sunriseTime && currentTime < sunsetTime) {
                            document.querySelector("#image").setAttribute('src', '../public/img/day-1.jpg');
                            document.getElementById('msg').innerHTML = 'GOOD DAY';
                        } else {
                            document.querySelector("#image").setAttribute('src', '../public/img/night.jpg');
                            document.getElementById('msg').innerHTML = 'GOOD NIGHT';
                        }
                    }

                    var countryUnits = 'metric';
                    var button = document.getElementById("unit");

                    function toggleUnits() {
                        if (countryUnits === 'metric') {
                            document.getElementById("temp").innerHTML = `${Math.round((temp * 9 / 5) + 32)}°F`;
                            document.getElementById("temp_max").innerHTML = `${Math.round((temp_max * 9 / 5) + 32)}°F &nbsp`;
                            document.getElementById("temp_min").innerHTML = `/&nbsp ${Math.round((temp_min * 9 / 5) + 32)}°F &nbsp`;
                            document.getElementById("feels_like").innerHTML = `| Feels like ${Math.round((feels_like * 9 / 5) + 32)}°F &nbsp`;
                            document.getElementById("visibility").innerHTML = `${Math.round((visibility / 1.609) / 1000)} Miles`;
                            document.getElementById("wind-speed").innerHTML = meterSecToMpH(speed);
                            document.getElementById("wind-gust").innerHTML = speedGustToMpH(gust);
                            countryUnits = 'imperial';
                            button.innerHTML = 'Metric Units';
                        }
                        else {
                            document.getElementById("temp").innerHTML = `${Math.round(temp)}°C`;
                            document.getElementById("temp_max").innerHTML = `${temp_max.toFixed(0)}°C &nbsp`;
                            document.getElementById("temp_min").innerHTML = `/&nbsp ${temp_min.toFixed(0)}°C &nbsp`;
                            document.getElementById("feels_like").innerHTML = `| Feels like ${feels_like.toFixed(0)}°C`;
                            document.getElementById("visibility").innerHTML = `${Math.round(visibility / 1000)} Km`;
                            document.getElementById("wind-speed").innerHTML = meterSecToKmH(speed);
                            document.getElementById("wind-gust").innerHTML = speedGustToKmH(gust);
                            countryUnits = 'metric';
                            button.innerHTML = 'Imperial Units';
                        }
                    }
                    document.getElementById("unit").onclick = function () {
                        toggleUnits();
                    };

                    document.getElementById("location").innerHTML = `${name}`;
                    document.getElementById("country").innerHTML = `${country}`;
                    document.getElementById("date-time").innerHTML = utcTogmt(dt);
                    document.querySelector("#weather_icon").setAttribute("src", "http://openweathermap.org/img/w/" + icon + ".png"); 
                    document.getElementById("temp").innerHTML = `${temp.toFixed(0)}°C`;
                    document.getElementById("temp_max").innerHTML = `${temp_max.toFixed(0)}°C &nbsp`;
                    document.getElementById("temp_min").innerHTML = `/&nbsp ${temp_min.toFixed(0)}°C &nbsp`;
                    document.getElementById("feels_like").innerHTML = `| Feels like ${feels_like.toFixed(0)}°C`;
                    document.getElementById("descr").innerHTML = `${description}`;
                    document.getElementById("sunrise").innerHTML = window.moment(sunrise * 1000).format('HH:mm'); 
                    document.getElementById("sunset").innerHTML = window.moment(sunset * 1000).format('HH:mm'); 
                    document.getElementById("humidity").innerHTML = `${humidity} %`;
                    document.getElementById("visibility").innerHTML = `${Math.round(visibility / 1000)} Km`;
                    document.getElementById("wind-speed").innerHTML = meterSecToKmH(speed);
                    document.getElementById("wind-deg").innerHTML = degreesToDirections(deg);
                    document.getElementById("wind-gust").innerHTML = meterSecToKmH(gust);

                    var bi = document.getElementById('background-image');
                    bi.style.backgroundImage = backgroundImageChange(id);

                    var i = document.getElementById('image');
                    i.style.setAttribute = dayAndNightImages(currentTime);

                    console.log(data);
                });
        });
    } else {
        document.getElementById("heading").innerHTML = "Geolocation is not supported by this browser";
    }
});