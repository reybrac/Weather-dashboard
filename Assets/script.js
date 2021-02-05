//api key - 007b58b57ff2308d83f8a775c2291ca5
//api key - c6ac65a79b2de0a72c3f209350782695

$(document).ready(function(){
    $("#display-section").hide();
    $("#five-day-section").hide();
});

var formEl = $('#city-form');
var nameInputEl = $('#city-name');

var skillsListEl = $('#city-list');

var printSkills = function (name) {
  var listEl = $('<li>');
  var listDetail = name;
  listEl.addClass('list-group-item').text(listDetail);
  listEl.appendTo(skillsListEl);
};

//Current day
var currentDay = new Date();
//$("#currentDay").append(currentDay);


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

  printSkills(nameInput);
   
  // resets form
  nameInputEl.val('');
  $(".card-title").text(nameInput + " (" + currentDay.toLocaleDateString() + ")");

  cityName = nameInput;
  callApi1();

};

var cityName = " ";


formEl.on('submit', handleFormSubmit);


//API call to get the information by the city name
function callApi1(){
    var requestUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=007b58b57ff2308d83f8a775c2291ca5";
    console.log("requestUrl: ", requestUrl);
    fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log('weathermap Data \n----------');
        console.log("data: ", data);
        for (var i = 0; i < data.length; i++) {
        console.log("name: ", data[i].name);
        console.log("temp: ", data.main.temp);
        }
        console.log("temp: ", data.main.temp);
        console.log("humidity: ", data.main.humidity);
        console.log("speed: ", data.wind.speed);
        if(cityName === ""){
            return;
        }else{
            $("#temperature").text("Temperature: " + data.main.temp + " F");
            $("#humidity").text("Humidity: " + data.main.humidity + " %");
            $("#wind-speed").text("Wind speed: " + data.wind.speed + " MPH");
        }
        callApi2(data.coord.lat, data.coord.lon);
    });
}

// API to call the UV data
function callApi2(lat, longe){
    var requestUrl2 = "http://api.openweathermap.org/data/2.5/uvi?appid=007b58b57ff2308d83f8a775c2291ca5&lat=" + lat + "&lon=" + longe;
    console.log("requestUrl2: ", requestUrl2);
    fetch(requestUrl2)
    .then(function (response2) {
        return response2.json();
    })
    .then(function (data2) {
        console.log('Data2 ', data2);
        // console.log("data2: ", data2);
        // for (var i = 0; i < data2.length; i++) {
        // console.log("name: ", data2[i].name);
        // console.log("temp: ", data2.main.temp);
        // }
        // console.log("temp: ", data2.main.temp);
        // console.log("humidity: ", data2.main.humidity);
        // console.log("speed: ", data2.wind.speed);
        // if(cityName === ""){
        //     return;
        // }else{
        //     $("#temperature").text("Temperature: " + data2.main.temp + " F");
        //     $("#humidity").text("Humidity: " + data2.main.humidity + " %");
        //     $("#wind-speed").text("Wind speed: " + data2.wind.speed + " MPH");
        // }
    });
}