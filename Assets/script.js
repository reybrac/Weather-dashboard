//api key - 007b58b57ff2308d83f8a775c2291ca5
//api key - c6ac65a79b2de0a72c3f209350782695

$(document).ready(function(){
    $("#display-section").hide();
    $("#five-day-section").hide();
});

var formEl = $('#city-form');
var nameInputEl = $('#city-name');

var cityListEl = $('#city-list');
var searchedCities = [];

var printCity = function (name) {
  var listEl = $('<button>');
  var listDetail = name;
  listEl.addClass('list-group-button').text(listDetail);
  
  listEl.appendTo(cityListEl);
  searchedCities.push(listDetail);
  localStorage.setItem("city Name", JSON.stringify(searchedCities));
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
        if(sunRise <= currentTime  ){
            if(currentTime <= sunSet){
            
                if(imageType === "Sunny" || imageType === "Clear"){
                    //console.log("its day time and clear & sunny");
                    $(".imageMain").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/sun.png?raw=true");
                }
            }else{
            
                if(imageType === "Clear"){
                    console.log("its night time and clear");
                    $(".imageMain1").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/clear-night.png?raw=true");
                }
            }
        }
        // Checks if API sends over keywords clouds/haze and adds appropriate weather image
        if(imageType === "Clouds" || imageType === "Haze"){
           // console.log("Clouds: ", imageType);
            $(".imageMain").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/cloud.png?raw=true");

        // Checks if API sends over keyword snow and adds appropriate weather image
        } else if(imageType === "Snow"){
            console.log("Snow: ", imageType);
            $(".imageMain").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/snow.png?raw=true");

        // Checks if API sends over keyword rain and adds appropriate weather image
        } else if(imageType === "Rain"){
            //console.log("Rain: ", imageType);
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
                var d1 = new Date(data3.list[5].dt_txt);
                var day1 = d1.toLocaleDateString();
                          
                $("#date1").text(day1);
                $("#day1temp").text("Temp: " + data3.list[5].main.temp + " F");
                $("#day1humidity").text("Humidity: " + data3.list[4].main.humidity + " %");
                

                var imageType = data3.list[5].weather[0].main;
                //console.log("Date main: ", imageType)
                
                //Checks if API sends over keywords sunny/clear and then adds appropriate weather image if keywords sunny or clear come over from API
                    
                if(imageType === "Sunny" || imageType === "Clear"){
                    //console.log("its clear & sunny");
                    $("#image1").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/sun.png?raw=true");              
                
                // Checks if API sends over keywords clouds/haze and adds appropriate weather image
                }else if(imageType === "Clouds" || imageType === "Haze"){
                    //console.log("Clouds: ", imageType);
                    $("#image1").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/cloud.png?raw=true");

                // Checks if API sends over keyword snow and adds appropriate weather image
                } else if(imageType === "Snow"){
                    //console.log("Snow: ", imageType);
                    $("#image1").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/snow.png?raw=true");

                // Checks if API sends over keyword rain and adds appropriate weather image
                } else if(imageType === "Rain"){
                    //console.log("Rain: ", imageType);
                    $("#image1").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/rain.png?raw=true");
                }  

        // Start Forecast day 2
            var d2 = new Date(data3.list[11].dt_txt);
            var day2 = d2.toLocaleDateString();
                    
            $("#date2").text(day2);
            $("#day2temp").text("Temp: " + data3.list[11].main.temp + " F");
            $("#day2humidity").text("Humidity: " + data3.list[11].main.humidity + " %");
            

            var imageType2 = data3.list[11].weather[0].main;
            //console.log("Date main: ", imageType2);
            
            //Checks if API sends over keywords sunny/clear and then adds appropriate weather image if keywords sunny or clear come over from API
                
            if(imageType2 === "Sunny" || imageType2 === "Clear"){
                //console.log("its clear & sunny");
                $("#image2").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/sun.png?raw=true");              
            
            // Checks if API sends over keywords clouds/haze and adds appropriate weather image
            }else if(imageType2 === "Clouds" || imageType2 === "Haze" || imageType2 === "Mist"){
                //console.log("Clouds: ", imageType2);
                $("#image2").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/cloud.png?raw=true");

            // Checks if API sends over keyword snow and adds appropriate weather image
            } else if(imageType2 === "Snow"){
                //console.log("Snow: ", imageType2);
                $("#image2").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/snow.png?raw=true");

            // Checks if API sends over keyword rain and adds appropriate weather image
            } else if(imageType2 === "Rain"){
                //console.log("Rain: ", imageType2);
                $("#image2").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/rain.png?raw=true");
            }  
        
            // Start Forecast day 3
            var d3 = new Date(data3.list[19].dt_txt);
            var day3 = d3.toLocaleDateString();
                    
            $("#date3").text(day3);
            $("#day3temp").text("Temp: " + data3.list[19].main.temp + " F");
            $("#day3humidity").text("Humidity: " + data3.list[19].main.humidity + " %");
            

            var imageType3 = data3.list[19].weather[0].main;
            //console.log("Date main: ", imageType3);
            
            //Checks if API sends over keywords sunny/clear and then adds appropriate weather image if keywords sunny or clear come over from API
                
            if(imageType3 === "Sunny" || imageType3 === "Clear"){
                //console.log("its clear & sunny");
                $("#image3").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/sun.png?raw=true");              
            
            // Checks if API sends over keywords clouds/haze and adds appropriate weather image
            }else if(imageType3 === "Clouds" || imageType3 === "Haze" || imageType3 === "Mist"){
                //console.log("Clouds: ", imageType3);
                $("#image3").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/cloud.png?raw=true");

            // Checks if API sends over keyword snow and adds appropriate weather image
            } else if(imageType3 === "Snow"){
                //console.log("Snow: ", imageType3);
                $("#image3").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/snow.png?raw=true");

            // Checks if API sends over keyword rain and adds appropriate weather image
            } else if(imageType3 === "Rain"){
                //console.log("Rain: ", imageType3);
                $("#image3").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/rain.png?raw=true");
            }  

            // Start Forecast day 4
            var d4 = new Date(data3.list[27].dt_txt);
            var day4 = d4.toLocaleDateString();
                    
            $("#date4").text(day4);
            $("#day4temp").text("Temp: " + data3.list[27].main.temp + " F");
            $("#day4humidity").text("Humidity: " + data3.list[27].main.humidity + " %");
            

            var imageType4 = data3.list[27].weather[0].main;
            //console.log("Date main: ", imageType4);
            
            //Checks if API sends over keywords sunny/clear and then adds appropriate weather image if keywords sunny or clear come over from API
                
            if(imageType4 === "Sunny" || imageType4 === "Clear"){
                //console.log("its clear & sunny");
                $("#image4").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/sun.png?raw=true");              
            
            // Checks if API sends over keywords clouds/haze and adds appropriate weather image
            }else if(imageType4 === "Clouds" || imageType4 === "Haze" || imageType4 === "Mist"){
                //console.log("Clouds: ", imageType4);
                $("#image4").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/cloud.png?raw=true");

            // Checks if API sends over keyword snow and adds appropriate weather image
            } else if(imageType4 === "Snow"){
                //console.log("Snow: ", imageType4);
                $("#image4").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/snow.png?raw=true");

            // Checks if API sends over keyword rain and adds appropriate weather image
            } else if(imageType4 === "Rain"){
                //console.log("Rain: ", imageType4);
                $("#image4").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/rain.png?raw=true");
            }  

            // Start Forecast day 5
            var d5 = new Date(data3.list[36].dt_txt);
            var day5 = d5.toLocaleDateString();
                    
            $("#date5").text(day5);
            $("#day5temp").text("Temp: " + data3.list[36].main.temp + " F");
            $("#day5humidity").text("Humidity: " + data3.list[36].main.humidity + " %");
            

            var imageType5 = data3.list[36].weather[0].main;
            //console.log("Date main: ", imageType5);
            
            //Checks if API sends over keywords sunny/clear and then adds appropriate weather image if keywords sunny or clear come over from API
                
            if(imageType5 === "Sunny" || imageType5 === "Clear"){
                //console.log("its clear & sunny");
                $("#image5").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/sun.png?raw=true");              
            
            // Checks if API sends over keywords clouds/haze and adds appropriate weather image
            }else if(imageType5 === "Clouds" || imageType5 === "Haze" || imageType5 === "Mist"){
                //console.log("Clouds: ", imageType5);
                $("#image5").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/cloud.png?raw=true");

            // Checks if API sends over keyword snow and adds appropriate weather image
            } else if(imageType5 === "Snow"){
                //console.log("Snow: ", imageType5);
                $("#image5").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/snow.png?raw=true");

            // Checks if API sends over keyword rain and adds appropriate weather image
            } else if(imageType5 === "Rain"){
                //console.log("Rain: ", imageType5);
                $("#image5").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/rain.png?raw=true");
            }  
    });
    $(".list-group-button").unbind('click').click(function(){
        //var actualCityBtn = $("button div").text;
        //event.preventDefault();
        //var y = $(".list-group-button").text();
       
        console.log(this);
        //console.log(localStorage.getItem("city Name"));
        cityName = $(this).text();
        $(".card-title").text(cityName + " (" + currentDay.toLocaleDateString() + ")");
        callApi1(cityName);
        callApi3();
        
    });
  
}



