// Get references to page elements
var $exampleText = $("#example-text");
var $exampleDescription = $("#example-description");
var $submitBtn = $("#submit");
var $exampleList = $("#example-list");

// The API object contains methods for each kind of request we'll make
var API = {
  saveExample: function(example) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/examples",
      data: JSON.stringify(example)
    });
  },
  getExamples: function() {
    return $.ajax({
      url: "api/examples",
      type: "GET"
    });
  },
  deleteExample: function(id) {
    return $.ajax({
      url: "api/examples/" + id,
      type: "DELETE"
    });
  }
};

// refreshExamples gets new examples from the db and repopulates the list
var refreshExamples = function() {
  API.getExamples().then(function(data) {
    var $examples = data.map(function(example) {
      var $a = $("<a>")
        .text(example.text)
        .attr("href", "/example/" + example.id);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": example.id
        })
        .append($a);

      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      $li.append($button);

      return $li;
    });

    $exampleList.empty();
    $exampleList.append($examples);
  });
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function(event) {
  event.preventDefault();

  var example = {
    text: $exampleText.val().trim(),
    description: $exampleDescription.val().trim()
  };

  if (!(example.text && example.description)) {
    alert("You must enter an example text and description!");
    return;
  }

  API.saveExample(example).then(function() {
    refreshExamples();
  });

  $exampleText.val("");
  $exampleDescription.val("");
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function() {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deleteExample(idToDelete).then(function() {
    refreshExamples();
  });
};

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
$exampleList.on("click", ".delete", handleDeleteBtnClick);

$(document).ready(function() {
  $(".dropdown-trigger").dropdown({
    closeOnClick: false
  });
  $('.sidenav').sidenav();

  var currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);

  $("#pickupDate").datepicker({
    dateFormat: "yyyy-mm-dd",
    minDate: currentDate,
    onSelect: function(dateText, inst){
      $("#dropoffDate").datepicker("option","minDate",
      $("#pickupDate").datepicker("getDate"));
    }
  });

  $("#dropoffDate").datepicker({
    dateFormat: "yyyy-mm-dd",
    minDate: $("#pickupDate").datepicker("getDate"),
    onSelect: function(endDate, inst){
      console.log("End Date MM/DD/YYYY: " + endDate);
      userTimeDetails.push(endDate);
      return endDate;
    }
  });
  
  $("#pickupTime").timepicker({
    onSelect: function(pickUpTime, inst) {
      console.log("Pick Up Time: " + pickUpTime);
      userTimeDetails.push(pickUpTime);
      return pickUpTime;
    }
  });

  $("#dropoffTime").timepicker({
    onSelect: function(dropOffTime, inst) {
      console.log("Drop Off Time: " + dropOffTime);
      userTimeDetails.push(dropOffTime);
      console.log(userTimeDetails[0]);
      console.log(userTimeDetails[1]);
      console.log(userTimeDetails[2]);
      console.log(userTimeDetails[3]);
      dropOffTime =  dropOffTime;
    }
  });

  console.log(dropOffTime)

  $("#findCars").on("click", function() {
    $("#results").show();
    var userPickUpLocation = $("#pickupLocation").val();
    if (!$dropOffLocation.val()) {
      var userDropOffLocation = userPickUpLocation;
    } else {
      var userDropOffLocation = $dropOffLocation.val()
    }

    $("#results").append("<hr>");
    $("#results").append(userPickUpLocation);
    $("#results").append("<hr>");
    $("#results").append(userDropOffLocation);
    $("#results").append("<hr>");
    $("#results").append(userTimeDetails[0]);
    $("#results").append("<hr>");
    $("#results").append(userTimeDetails[1]);
    $("#results").append("<hr>");
    $("#results").append(userTimeDetails[2]);
    $("#results").append("<hr>");
    $("#results").append(userTimeDetails[3]);
  })

  var url = "https://api.sandbox.amadeus.com/v1.2/cars/search-circle?apikey=fMUHkOJ5X8vyjqCHnzz4D94FG8rfPMxc&latitude=35.1504&longitude=-114.57632&radius=42&pick_up=" + userTimeDetails[0] + "&drop_off=" + userTimeDetails[1];

  $.ajax({
    url: url
  })
});
