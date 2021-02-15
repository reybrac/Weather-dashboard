//api key - 007b58b57ff2308d83f8a775c2291ca5
//api key - c6ac65a79b2de0a72c3f209350782695


// Gets the document ready
$(document).ready(function(){
    $("#display-section").hide();
    $("#five-day-section").hide();
});

var formEl = $('#city-form');
var nameInputEl = $('#city-name');
var cityListEl = $('#city-list');
var searchedCities = [];

// Prints the name of the cities searched as buttons
var printCity = function (name) {
    var listEl = $('<button>');
    var listDetail = name;
    listEl.addClass('list-group-button').text(listDetail);
    
    listEl.appendTo(cityListEl);
    searchedCities.push(listDetail);
    localStorage.setItem("city Name", JSON.stringify(searchedCities));
};

// Current day variable
var currentDay = new Date();

// Handles the user input
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
   
    nameInputEl.val('');
    
    $(".card-title").text(nameInput + " (" + currentDay.toLocaleDateString() + ")");

// Calls the various API's and passes the city name the user entered
    cityName = nameInput;
    callApi1();
    callApi3();
};

var cityName = " ";

formEl.on('submit', handleFormSubmit);

//API call to get the information by the city name
function callApi1(){
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=007b58b57ff2308d83f8a775c2291ca5";
    
    fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        
        console.log("data: ", data);
        
        // Verifies that the city name was entered and then gets temp information
        if(cityName === ""){
            return;
        }else{
            $("#temperature").text("Temperature: " + data.main.temp + " F");
            $("#humidity").text("Humidity: " + data.main.humidity + " %");
            $("#wind-speed").text("Wind speed: " + data.wind.speed + " MPH");
        }

        // Calls API2 and passes the city coordinates
        callApi2(data.coord.lat, data.coord.lon);

        // Gets the sunrise and sunset for the city
        var imageType = data.weather[0].main;
        var currentTime = data.dt;
        var sunRise = data.sys.sunrise;
        var sunSet = data.sys.sunset;

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

// API to get the UV data for the city
function callApi2(lat, longe){
    var requestUrl2 = "https://api.openweathermap.org/data/2.5/uvi?appid=007b58b57ff2308d83f8a775c2291ca5&lat=" + lat + "&lon=" + longe;
    
    fetch(requestUrl2)
        .then(function (response2) {
            return response2.json();
        })
        .then(function (data2) {
            
            // Assigns color to UV data based on UV index severity
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

// API to get for the 5 day forecast
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
                var d1 = new Date(data3.list[4].dt_txt);
                var day1 = d1.toLocaleDateString();
                          
                $("#date1").text(day1);
                $("#day1temp").text("Temp: " + data3.list[4].main.temp + " F");
                $("#day1humidity").text("Humidity: " + data3.list[4].main.humidity + " %");
                

                var imageType = data3.list[4].weather[0].main;
                
                
                //Checks if API sends over keywords sunny/clear and then adds appropriate weather image if keywords sunny or clear come over from API
                    
                if(imageType === "Sunny" || imageType === "Clear"){
                    
                    $("#image1").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/sun.png?raw=true");              
                
                // Checks if API sends over keywords clouds/haze and adds appropriate weather image
                }else if(imageType === "Clouds" || imageType === "Haze"){
                    
                    $("#image1").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/cloud.png?raw=true");

                // Checks if API sends over keyword snow and adds appropriate weather image
                } else if(imageType === "Snow"){
                    
                    $("#image1").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/snow.png?raw=true");

                // Checks if API sends over keyword rain and adds appropriate weather image
                } else if(imageType === "Rain"){
                    
                    $("#image1").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/rain.png?raw=true");
                }  

        // Start Forecast day 2
            var d2 = new Date(data3.list[11].dt_txt);
            var day2 = d2.toLocaleDateString();
                    
            $("#date2").text(day2);
            $("#day2temp").text("Temp: " + data3.list[11].main.temp + " F");
            $("#day2humidity").text("Humidity: " + data3.list[11].main.humidity + " %");
            

            var imageType2 = data3.list[11].weather[0].main;
            
            
            //Checks if API sends over keywords sunny/clear and then adds appropriate weather image if keywords sunny or clear come over from API
                
            if(imageType2 === "Sunny" || imageType2 === "Clear"){
                
                $("#image2").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/sun.png?raw=true");              
            
            // Checks if API sends over keywords clouds/haze and adds appropriate weather image
            }else if(imageType2 === "Clouds" || imageType2 === "Haze" || imageType2 === "Mist"){
                
                $("#image2").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/cloud.png?raw=true");

            // Checks if API sends over keyword snow and adds appropriate weather image
            } else if(imageType2 === "Snow"){
                
                $("#image2").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/snow.png?raw=true");

            // Checks if API sends over keyword rain and adds appropriate weather image
            } else if(imageType2 === "Rain"){
                
                $("#image2").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/rain.png?raw=true");
            }  
        
            // Start Forecast day 3
            var d3 = new Date(data3.list[19].dt_txt);
            var day3 = d3.toLocaleDateString();
                    
            $("#date3").text(day3);
            $("#day3temp").text("Temp: " + data3.list[19].main.temp + " F");
            $("#day3humidity").text("Humidity: " + data3.list[19].main.humidity + " %");
            

            var imageType3 = data3.list[19].weather[0].main;
            
            //Checks if API sends over keywords sunny/clear and then adds appropriate weather image if keywords sunny or clear come over from API    
            if(imageType3 === "Sunny" || imageType3 === "Clear"){
                
                $("#image3").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/sun.png?raw=true");              
            
            // Checks if API sends over keywords clouds/haze and adds appropriate weather image
            }else if(imageType3 === "Clouds" || imageType3 === "Haze" || imageType3 === "Mist"){
                
                $("#image3").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/cloud.png?raw=true");

            // Checks if API sends over keyword snow and adds appropriate weather image
            } else if(imageType3 === "Snow"){
                
                $("#image3").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/snow.png?raw=true");

            // Checks if API sends over keyword rain and adds appropriate weather image
            } else if(imageType3 === "Rain"){
                
                $("#image3").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/rain.png?raw=true");
            }  

            // Start Forecast day 4
            var d4 = new Date(data3.list[27].dt_txt);
            var day4 = d4.toLocaleDateString();
                    
            $("#date4").text(day4);
            $("#day4temp").text("Temp: " + data3.list[27].main.temp + " F");
            $("#day4humidity").text("Humidity: " + data3.list[27].main.humidity + " %");
            

            var imageType4 = data3.list[27].weather[0].main;
            
            
            //Checks if API sends over keywords sunny/clear and then adds appropriate weather image if keywords sunny or clear come over from API
                
            if(imageType4 === "Sunny" || imageType4 === "Clear"){
            
                $("#image4").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/sun.png?raw=true");              
            
            // Checks if API sends over keywords clouds/haze and adds appropriate weather image
            }else if(imageType4 === "Clouds" || imageType4 === "Haze" || imageType4 === "Mist"){
            
                $("#image4").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/cloud.png?raw=true");

            // Checks if API sends over keyword snow and adds appropriate weather image
            } else if(imageType4 === "Snow"){
            
                $("#image4").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/snow.png?raw=true");

            // Checks if API sends over keyword rain and adds appropriate weather image
            } else if(imageType4 === "Rain"){
            
                $("#image4").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/rain.png?raw=true");
            }  

            // Start Forecast day 5
            var d5 = new Date(data3.list[36].dt_txt);
            var day5 = d5.toLocaleDateString();
                    
            $("#date5").text(day5);
            $("#day5temp").text("Temp: " + data3.list[36].main.temp + " F");
            $("#day5humidity").text("Humidity: " + data3.list[36].main.humidity + " %");
            

            var imageType5 = data3.list[36].weather[0].main;
            
            //Checks if API sends over keywords sunny/clear and then adds appropriate weather image if keywords sunny or clear come over from API
                
            if(imageType5 === "Sunny" || imageType5 === "Clear"){
            
                $("#image5").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/sun.png?raw=true");              
            
            // Checks if API sends over keywords clouds/haze and adds appropriate weather image
            }else if(imageType5 === "Clouds" || imageType5 === "Haze" || imageType5 === "Mist"){
            
                $("#image5").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/cloud.png?raw=true");

            // Checks if API sends over keyword snow and adds appropriate weather image
            } else if(imageType5 === "Snow"){
            
                $("#image5").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/snow.png?raw=true");

            // Checks if API sends over keyword rain and adds appropriate weather image
            } else if(imageType5 === "Rain"){
            
                $("#image5").attr("src", "https://github.com/reybrac/Weather-dashboard/blob/main/Assets/images/rain.png?raw=true");
            }  
    });

// Favority city button is clicked, runs the API's again to get the information for that city
    $(".list-group-button").unbind('click').click(function(){
        
        cityName = $(this).text();
        $(".card-title").text(cityName + " (" + currentDay.toLocaleDateString() + ")");
        callApi1(cityName);
        callApi3();
        
    });
  
}



