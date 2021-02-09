//api key - 007b58b57ff2308d83f8a775c2291ca5
//api key - c6ac65a79b2de0a72c3f209350782695

$(document).ready(function(){
    $("#display-section").hide();
    $("#five-day-section").hide();
});

var formEl = $('#city-form');
var nameInputEl = $('#city-name');

var cityListEl = $('#city-list');

var printCity = function (name) {
  var listEl = $('<li>');
  var listDetail = name;
  listEl.addClass('list-group-item').text(listDetail);
  listEl.appendTo(cityListEl);
};

//Current day
var currentDay = new Date();



var handleFormSubmit = function (event) {
  event.preventDefault();

  var nameInput = nameInputEl.val();


  if (!nameInput ) {
    console.log('You need to fill out the form!');
    return;
  }else{
    $("#display-section").show();
    $("#five-day-section").show();
  }

  printCity(nameInput);
   
  // resets form
  nameInputEl.val('');
  
  $(".card-title").text(nameInput + " (" + currentDay.toLocaleDateString() + ")");

  cityName = nameInput;
  callApi1();
  callApi3();
};

var cityName = " ";


formEl.on('submit', handleFormSubmit);


//API call to get the information by the city name
function callApi1(){
    var requestUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=007b58b57ff2308d83f8a775c2291ca5";
    //console.log("requestUrl: ", requestUrl);
    fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        
        console.log("data: ", data);
        // console.log("temp: ", data.main.temp);
        // console.log("humidity: ", data.main.humidity);
        // console.log("speed: ", data.wind.speed);
        if(cityName === ""){
            return;
        }else{
            $("#temperature").text("Temperature: " + data.main.temp + " F");
            $("#humidity").text("Humidity: " + data.main.humidity + " %");
            $("#wind-speed").text("Wind speed: " + data.wind.speed + " MPH");
        }
        callApi2(data.coord.lat, data.coord.lon);

        var imageType = data.weather[0].main;
        var currentTime = data.dt;
        var sunRise = data.sys.sunrise;
        var sunSet = data.sys.sunset;
        console.log("Sunrise: ", sunRise);
        console.log("sunset: ", sunSet);

        if(sunRise <= currentTime && currentTime < sunSet ){
            console.log("its day time");
            if(imageType === "Sunny" || imageType === "Clear"){
                
                $(".image1").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/Sun.jpg?raw=true");
            }
        }else{
            console.log("its night time");
            if(imageType === "Clear"){
                
                $(".image1").attr("src", ".\Assets\images\clear-night.jpg");
            }
        }
        
        if(imageType === "Clouds" || imageType === "Haze"){
            console.log("Clouds: ", imageType);
            $(".image1").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/cloud.jpg?raw=true");
        } else {
        }
        
    });
}

// API to call the UV data
function callApi2(lat, longe){
    var requestUrl2 = "http://api.openweathermap.org/data/2.5/uvi?appid=007b58b57ff2308d83f8a775c2291ca5&lat=" + lat + "&lon=" + longe;
    //console.log("requestUrl2: ", requestUrl2);
    fetch(requestUrl2)
    .then(function (response2) {
        return response2.json();
    })
    .then(function (data2) {
        //console.log('Data2 ', data2);
        $("#UV-index").text("UV Index: " + data2.value);
    });
}

// API to call for the 5 day forecast
function callApi3(){
    var requestUrl3 = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=007b58b57ff2308d83f8a775c2291ca5";
    console.log("requestUrl3: ", requestUrl3);
    fetch(requestUrl3)
    .then(function (response3) {
        return response3.json();
    })
    .then(function (data3) {
        console.log('Data3 ', data3);
        //Forecast day 1
        var nextDay1 = currentDay;
        nextDay1.setDate(nextDay1.getDate() + 1);
        var day1 = nextDay1.toLocaleDateString();
        var nowDate1 = nextDay1.getHours();
        console.log("day1: ", day1);
        
        //Forecast day 2
        var today2 = currentDay;

        

        for(var i = 0; i < data3.list.length; i++){
            
            
            var d = new Date(data3.list[i].dt_txt);
            var n = d.toLocaleDateString();
            //console.log("if statement: ", n);
            if(n === day1){
                var nowApi1 = d.getHours();
                
                console.log("API current time of: ", nowApi1);
                console.log("Current time of ", nowDate1);
                $("#date1").text(day1);
                $("#day1temp").text("Temp: " + data3.list[i].main.temp + " F");
                $("#day1humidity").text("Humidity: " + data3.list[i].main.humidity + " %");
                
            }
            
            //console.log("test date converstion: ", n);
            
        }
       
        
       

        //$("#UV-index").text("UV Index: " + data3.value);
    });
}

