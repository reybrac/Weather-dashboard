//api key - 007b58b57ff2308d83f8a775c2291ca5
//api key - c6ac65a79b2de0a72c3f209350782695

var formEl = $('#skills-form');
var nameInputEl = $('#skill-name');
// var dateInputEl = $('#datepicker');
var skillsListEl = $('#skills-list');

var printSkills = function (name) {
  var listEl = $('<li>');
  var listDetail = name;
  listEl.addClass('list-group-item').text(listDetail);
  listEl.appendTo(skillsListEl);
};

var handleFormSubmit = function (event) {
  event.preventDefault();

  var nameInput = nameInputEl.val();
//   var dateInput = dateInputEl.val();

  if (!nameInput ) {
    console.log('You need to fill out the form!');
    return;
  }

  printSkills(nameInput);

  // resets form
  nameInputEl.val('');
//   dateInputEl.val('');
};

formEl.on('submit', handleFormSubmit);

// Autocomplete widget
// $(function () {
//   var skillNames = [
//     'Bootstrap',
//     'C',
//     'C++',
//     'CSS',
//     'Express.js',
//     'Git',
//     'HTML',
//     'Java',
//     'JavaScript',
//     'jQuery',
//     'JSON',
//     'MySQL',
//     'Node.js',
//     'NoSQL',
//     'PHP',
//     'Python',
//     'React',
//     'Ruby',
//   ];
//   $('#skill-name').autocomplete({
//     source: skillNames,
//   });
// });

// Datepicker widget
// $(function () {
//   $('#datepicker').datepicker({
//     changeMonth: true,
//     changeYear: true,
//   });
// });
var cityName = "Tracy";

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
      console.log(data[i].name);
      console.log(data[i].id);
    }
  });
