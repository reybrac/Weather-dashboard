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
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=007b58b57ff2308d83f8a775c2291ca5";
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
        //Checks if it's day or night and then adds appropriate weather image if keywords sunny or clear come over from API
        if(sunRise <= currentTime && currentTime < sunSet ){
            
            if(imageType === "Sunny" || imageType === "Clear"){
                console.log("its day time and clear & sunny");
                $(".imageMain").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/sun.png?raw=true");
            }
        }else{
            
            if(imageType === "Clear"){
                console.log("its night time and clear");
                $(".imageMain1").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/clear-night.png?raw=true");
            }
        }
        // Checks if API sends over keywords clouds/haze and adds appropriate weather image
        if(imageType === "Clouds" || imageType === "Haze"){
            console.log("Clouds: ", imageType);
            $(".imageMain").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/cloud.png?raw=true");

        // Checks if API sends over keyword snow and adds appropriate weather image
        } else if(imageType === "Snow"){
            console.log("Snow: ", imageType);
            $(".imageMain").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/snow.png?raw=true");

        // Checks if API sends over keyword rain and adds appropriate weather image
        } else if(imageType === "Rain"){
            console.log("Rain: ", imageType);
            $(".imageMain").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/rain.png?raw=true");
        }
        
    });
}

// API to call the UV data
function callApi2(lat, longe){
    var requestUrl2 = "https://api.openweathermap.org/data/2.5/uvi?appid=007b58b57ff2308d83f8a775c2291ca5&lat=" + lat + "&lon=" + longe;
    //console.log("requestUrl2: ", requestUrl2);
    fetch(requestUrl2)
    .then(function (response2) {
        return response2.json();
    })
    .then(function (data2) {
        //console.log('Data2 ', data2);
        if(data2.value <= 2){
            $("#UV-index").text(data2.value).css("background-color", "greenyellow");
        }else if(2 < data2.value && data2.value <= 6) {
             $("#UV-index").text(data2.value).css("background-color", "yellow");
        } else if(6 < data2.value && data2.value <= 8) {
            $("#UV-index").text(data2.value).css("background-color", "orange");
        }else if(data2.value > 8){
            $("#UV-index").text(data2.value).css("background-color", "red");
        }
            
    });
}

// API to call for the 5 day forecast
function callApi3(){
    var requestUrl3 = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=007b58b57ff2308d83f8a775c2291ca5";
    console.log("requestUrl3: ", requestUrl3);
    fetch(requestUrl3)
    .then(function (response3) {
        return response3.json();
    })
    .then(function (data3) {
        console.log('Data3 ', data3);
        // Start Forecast day 1
                var d1 = new Date(data3.list[0].dt_txt);
                var day1 = d1.toLocaleDateString();
                          
                $("#date1").text(day1);
                $("#day1temp").text("Temp: " + data3.list[4].main.temp + " F");
                $("#day1humidity").text("Humidity: " + data3.list[4].main.humidity + " %");
                

                var imageType = data3.list[4].weather[0].main;
                console.log("Date main: ", imageType)
                
                //Checks if API sends over keywords sunny/clear and then adds appropriate weather image if keywords sunny or clear come over from API
                    
                if(imageType === "Sunny" || imageType === "Clear"){
                    console.log("its clear & sunny");
                    $("#image1").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/sun.png?raw=true");              
                
                // Checks if API sends over keywords clouds/haze and adds appropriate weather image
                }else if(imageType === "Clouds" || imageType === "Haze"){
                    console.log("Clouds: ", imageType);
                    $("#image1").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/cloud.png?raw=true");

                // Checks if API sends over keyword snow and adds appropriate weather image
                } else if(imageType === "Snow"){
                    console.log("Snow: ", imageType);
                    $("#image1").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/snow.png?raw=true");

                // Checks if API sends over keyword rain and adds appropriate weather image
                } else if(imageType === "Rain"){
                    console.log("Rain: ", imageType);
                    $("#image1").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/rain.png?raw=true");
                }  

        // Start Forecast day 2
            var d2 = new Date(data3.list[11].dt_txt);
            var day2 = d2.toLocaleDateString();
                    
            $("#date2").text(day2);
            $("#day2temp").text("Temp: " + data3.list[11].main.temp + " F");
            $("#day2humidity").text("Humidity: " + data3.list[11].main.humidity + " %");
            

            var imageType2 = data3.list[11].weather[0].main;
            console.log("Date main: ", imageType2);
            
            //Checks if API sends over keywords sunny/clear and then adds appropriate weather image if keywords sunny or clear come over from API
                
            if(imageType2 === "Sunny" || imageType2 === "Clear"){
                console.log("its clear & sunny");
                $("#image2").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/sun.png?raw=true");              
            
            // Checks if API sends over keywords clouds/haze and adds appropriate weather image
            }else if(imageType2 === "Clouds" || imageType2 === "Haze" || imageType2 === "Mist"){
                console.log("Clouds: ", imageType2);
                $("#image2").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/cloud.png?raw=true");

            // Checks if API sends over keyword snow and adds appropriate weather image
            } else if(imageType2 === "Snow"){
                console.log("Snow: ", imageType2);
                $("#image2").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/snow.png?raw=true");

            // Checks if API sends over keyword rain and adds appropriate weather image
            } else if(imageType2 === "Rain"){
                console.log("Rain: ", imageType2);
                $("#image2").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/rain.png?raw=true");
            }  
    });
}

