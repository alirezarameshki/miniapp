const main = document.querySelector(".main")
const date = document.querySelector(".date")
const input = document.querySelector(".input")
const search_btn = document.querySelector(".search_btn")
const temp = document.querySelector(".temp")
const Humidity = document.querySelector(".hum")
const wind = document.querySelector(".status_wind")
const visibility = document.querySelector(".visible")
const next_days = document.querySelector(".next_days")

const check_ai = document.querySelector(".check_ai")
const ai_response = document.querySelector(".ai_response")
const close = document.querySelector(".close")
const response_text = document.querySelector(".response_text")

const loading = document.querySelector(".loading")

const back_icon = document.querySelector(".back_icon")

back_icon.addEventListener("click",()=>{
    loading.classList.remove("display")
   

    setTimeout(() => {
         document.location.href = "../index.html"
    }, 1000);
});




check_ai.addEventListener("click",()=>{
    ai_response.classList.toggle("display")
    ai_response.classList.add("animation")
})

close.addEventListener("click",()=>{
    ai_response.classList.add("display")
})

next_days.addEventListener("click",()=>{
    ai_response.classList.add("display")
})





const dt = new Date();

const get_date = document.querySelector(".date");

get_date.innerHTML = dt.toLocaleDateString('fa-IR', { weekday: 'long', day: 'numeric', month: 'long' });



 async function getweather(city){
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=9a21a57d6c50a26aed3b1256cc3b1f50`)
        const data = await response.json()
        return `
coord.lon : ${data.coord.lon} 
coord.lat : ${data.coord.lat} 
weather.main : ${data.weather[0].main} 
weather.description : ${data.weather[0].description} 
main.temp : ${data.main.temp} 
main.feels_like : ${data.main.feels_like} 
main.temp_min : ${data.main.temp_min} 
main.temp_max : ${data.main.temp_max} 
main.pressure : ${data.main.pressure} 
main.humidity : ${data.main.humidity} 
visibility : ${data.visibility} 
wind.speed : ${data.wind.speed} 
wind.deg : ${data.wind.deg} 
clouds.all : ${data.clouds.all} 
sys.country : ${data.sys.country} 
timezone : ${data.timezone} 
name : ${data.name}
`;
    }catch(error){
        console.log(error)
    }
}

async function weatherAi(value) {
    const weather = await getweather(value);
    console.log(weather);

    try {
        const response = await fetch('/api/getweather', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ weather_data: weather })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const default_message = `
        پیامی دریافت نشد 
        لطفا مجدد شهر خود را وارد کنید و بر روی دکمه جست و جو کلیک کنید ,سپس دوباره امتحان کنید
        `;
        const markdownText = data.choices?.[0]?.message?.content || default_message;
        response_text.innerHTML = markdownText;
    } catch (error) {
        console.log(error);
    }
}

async function weather(city) {
    const appid = "9a21a57d6c50a26aed3b1256cc3b1f50"
try{
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${appid}&units=metric&lang=fa`)

if(!response.ok){
    console.error("response is not Ok")
    return;
}

const data = await response.json()
return data

}
catch(error){
    console.log(error)
}

}

window.addEventListener("click",(e)=>{
    if(!e.target.classList.contains("check_ai")){
        ai_response.classList.add("display")
    }
    
})
input.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^آ-یa-zA-Z\s]/g, '');

   

    let persian = new RegExp(/[^a-zA-Z\s]/g, '');

    if(persian.test(e.target.value)){
        e.target.value = e.target.value.replace(/[^آ-ی\s]/g, '');
    }
    else{
        e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    }
});

 search_btn.addEventListener("click",() => {
    if(input.value.trim() == ""){
        return;
    }
    let value = input.value;
    
    weatherAi(value)
   change_weather(value)


    input.value = "";
 });


async function change_weather(value) {
    const get_weather = await weather(value);

    if(!get_weather){
        return;
    }
   

    let status = {}
    let status_weather = {}

    get_weather.list.forEach(element => {
        if (!status.temp) {
            status = {
                temp: element.main.temp,
                humidity: element.main.humidity,
                wind: element.wind.speed,
                visibility: element.visibility,
                weather: element.weather[0].main,
                description: element.weather[0].description
            }
        }

        if (!status_weather[element.dt_txt.split(" ")[0]]) {
            status_weather[element.dt_txt.split(" ")[0]] = {
                date: element.dt_txt.split(" ")[0],
                temp_min: element.main.temp_min.toFixed(1),
                temp_max: element.main.temp_max.toFixed(1),
                weather: element.weather[0].main,
                description: element.weather[0].description
            }
        }
    });

    next_days.innerHTML = ""

    Object.values(status_weather).forEach(day => {
        const next_day = document.createElement("div");
        next_day.classList.add("next_day");
 
        const futureDate = new Date(day.date);
        next_day.innerHTML = `
            <p class="next_day-date">${futureDate.toLocaleDateString('fa-IR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            <span class="next_day-status">${day.description}</span>
            <span class="next_day-temp">${day.temp_min}/${day.temp_max}°C</span>
        `;

        next_days.appendChild(next_day);
    });

    temp.innerHTML = `${status.temp.toFixed(1)}°c`;
    Humidity.innerHTML = `${status.humidity}%`;
    wind.innerHTML = `${status.wind}km/h`;
    visibility.innerHTML = `${(status.visibility / 1000).toFixed(1)}km`;

    const weather_status = status.weather;
     

    if (weather_status.toLowerCase().includes("clouds")) {
    main.style.backgroundImage = `url(https://images.unsplash.com/photo-1509803874385-db7c23652552?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`;
    } else if (weather_status.toLowerCase().includes("clear")) {
    main.style.backgroundImage = `url(https://images.unsplash.com/photo-1673175980915-3c1c648bec60?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`;
    } else if (weather_status.toLowerCase().includes("rain")) {
    main.style.backgroundImage = `url(https://images.unsplash.com/photo-1515890922410-ae767899d6b3?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`;
    } else if (weather_status.toLowerCase().includes("snow")) {
    main.style.backgroundImage = `url(https://plus.unsplash.com/premium_photo-1673926270081-3692a88f9f28?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`;
    }


}

change_weather("ایران")