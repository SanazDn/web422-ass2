/*********************************************************************************
*  WEB422 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Sanaz Dehghannayyeri Student ID: 121426159  Date: 2/5/2021
*
*
********************************************************************************/ 

let restaurantData = [];

let currentRestaurant = {};

let page = 1;
const perPage = 10;

let map = {};

function avg(grades) {
  let averageScore = 0;
  grades.forEach((element) => {
    averageScore += element.score / grades.length;
  });
  return averageScore.toFixed(2);
}

const tableRows = _.template(
  `<% _.forEach(restaurantData, function(restaurants) { %>
        <tr data-id=<%- restaurants._id %>>
            <td><%- restaurants.name %></td>
            <td><%- restaurants.cuisine %></td>
            <td><%- restaurants.address.building %><%-"  " %><%- restaurants.address.street %></td>
            <td><%- avg(restaurants.grades) %></td>
        </tr>
    <% }); %>`
);

function loadRestaurantData() {
  fetch(
    `https://web422assi1.herokuapp.com/api/restaurants?page=${page}&perPage=${perPage}`
  )
    .then((res) => res.json())

    .then((json) => {
      restaurantData = json;

      let rows = tableRows({ restaurants: restaurantData });

      $("#restaurant-table tbody").html(rows);
      $("#current-page").html(page);
    });
}

// Document is ready
$(document).ready(function () {
  loadRestaurantData();

  $("#restaurant-table tbody").on("click", "tr", function (e) {
    let clickedRow = $(this).attr("data-id");

    currentRestaurant = restaurantData.find(({ _id }) => _id == clickedRow);
    
    $("#restaurant-modal h4").html(` ${currentRestaurant.name}`);

    $("#restaurant-address").html(
      `${currentRestaurant.address.building} ${currentRestaurant.address.street}`
    );

    //Open the "Restaurant" Modal window
    $("#restaurant-modal").modal({
      backdrop: "static",
      keyboard: false,
    });
  });

  $("#previous-page").on("click", function (e) {
    if (page > 1) {
      page--;
    }
    loadRestaurantData();
  });

  $("#Next-page").on("click", function (e) {
    page++;
    loadRestaurantData();
  });

  $("#restaurant-modal").on("shown.bs.modal", function () {
    map = new L.Map("leaflet", {
      center: [
        currentRestaurant.address.coord[1],
        currentRestaurant.address.coord[0],
      ],
      zoom: 18,
      layers: [
        new L.TileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"),
      ],
    });

    L.marker([
      currentRestaurant.address.coord[1],
      currentRestaurant.address.coord[0],
    ]).addTo(map);

    map.invalidateSize();
  });

  $("#restaurant-modal").on("hidden.bs.modal", function () {
    map.remove();
  });
});
