import { data } from "../data/module.mjs";

$(document).ready(() => {
  // Initialize AOS
  AOS.init();

  // Define global variables
  let chosenCar = {};
  let cars = [];
  let pickupLocation =
    $("#location").val() || "Santa Monica - 2102 Lincoln Blvd";
  let pickupLocationMap = "Santa Monica - 2102 Lincoln Blvd";
  let pickupDate = new Date(Date.now() + 8.64e7);
  let dropoffDate = new Date(pickupDate.getTime() + 8.64e7);

  // Initialize the map
  initMap();
  // Initialize date pickers
  initDatePickers();
  // Set event listeners
  setEventListeners();
  // Load car data
  loadCarData();
  // Initialize titles
  initializeTitles();
  //initialize reviews
  initializeReviews();

  // Footer content
  $("footer").html(
    `©${new Date().getFullYear()} Aya.AbdElsalam, All Rights Reserved`
  );
  // Menu toggle
  $("#menu").click(() => $("ul").slideToggle());
  // Window resize and scroll handling
  handleWindowResize();
  handleWindowScroll();

  // Functions
  function initMap() {
    var map = L.map("map").setView([51.505, -0.09], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.Control.geocoder().addTo(map);
    // Create a custom icon
    var customIcon = L.icon({
      iconUrl: "../assets/icons8-pain-point-100.png",
      iconSize: [70, 70], // Size of the icon
      iconAnchor: [37, 37], // Point of the icon which will correspond to marker's location
      popupAnchor: [0, 0], // Point from which the popup should open relative to the iconAnchor
    });

    var geocoder = L.Control.Geocoder.nominatim();
    SetMarker(pickupLocation);

    function SetMarker(location) {
      geocoder.geocode(location, function (results) {
        if (results.length > 0) {
          var latlng = results[0].center;
          L.marker(latlng, { icon: customIcon })
            .addTo(map)
            .bindPopup(
              `<h1 class="text-[30px] font-bold text-mainColor">CAR Rental Station</h1> <p>${location}</p>`
            )
            .openPopup();
          map.setView(latlng, 13);
        } else {
          console.log("Location not found.");
        }
      });
    }

    $("#locationMap").change(() => SetMarker($("#locationMap").val()));
  }

  function initDatePickers() {
    $("#timedatePicker").datetimepicker({
      value: pickupDate,
      minDate: Date.now() + 8.64e7,
    });

    $("#timedatePickerdrop").datetimepicker({
      step: 15,
      value: dropoffDate,
      minDate: dropoffDate,
    });
  }

  function setEventListeners() {
    $(window).on("scroll", activeNavLink);
    $("nav ul li a").on("click", scrollToSection);
    $("#location").change((e) => (pickupLocation = e.target.value));
    $("#timedatePicker").change((e) => {
      pickupDate = new Date(e.target.value);
      updateDropoffPicker();
    });
    $("#timedatePickerdrop").change(
      (e) => (dropoffDate = new Date(e.target.value))
    );
    $("#reservationFormCompalte").submit(handleReservationComplete);
    $("#cancel").click(handleCancel);
    $("#reservationForm").submit(handleReservationForm);
    $("#cars").change((e) => chosenCarFun(e.target.value));

    $(".emailForm").submit(handleEmailForm);
    $(".contactForm").submit(handleContactForm);
    $(window).scroll(showBtnTop);

    $("#scrollToTopBtn").click(scrollToTop);

    function handleReservationComplete(e) {
      e.preventDefault();
      $("#reservationFormCompalte").fadeOut();
      $("#msg p").html(
        "<h1>Success!!</h1> <p> We will connect with you as soon as possible </p>"
      );
      $("#msg").fadeIn().css("display", "flex").delay(2000).fadeOut();
      $("html").css("overflow-y", "auto");
    }

    function handleCancel(e) {
      $("#reservationFormCompalte").fadeOut();
      $("html").css("overflow-y", "auto");
    }

    function handleReservationForm(e) {
      e.preventDefault();
      updateReservationDetails();
      $("#reservationFormCompalte").fadeIn();
      $("html").css("overflow", "hidden");
    }

    function handleEmailForm(e) {
      e.preventDefault();
      $("#msg p").text("We will connect with you as soon as possible");
      $("#msg").fadeIn().css("display", "flex").delay(2000).fadeOut();
    }

    function handleContactForm(e) {
      e.preventDefault();
      $("#msg p").html(
        "<h1>Your message has been sent</h1> <p> We will connect with you as soon as possible </p>"
      );
      $("#msg").fadeIn().css("display", "flex").delay(2000).fadeOut();
    }

    function updateDropoffPicker() {
      $("#timedatePickerdrop").datetimepicker({
        step: 15,
        value: new Date(pickupDate.getTime() + 8.64e7),
        minDate: new Date(pickupDate.getTime() + 8.64e7),
      });
    }

    function updateReservationDetails() {
      $("#pickUpTime").text(pickupDate);
      $("#dropOffTime").text(dropoffDate);
      $("#pickUpLocation").text(pickupLocation);
      $("#dropOffLocation").text(pickupLocation);
      $("#carModel").text("CAR: " + chosenCar.model);
      $("#imgModel").attr("src", chosenCar.image);
    }
    function showBtnTop() {
      if ($(window).scrollTop() > 100) {
        // Show button after scrolling down 100px
        $("#scrollToTopBtn").fadeIn();
      } else {
        $("#scrollToTopBtn").fadeOut();
      }
    }
    function scrollToTop() {
      $("html, body").animate(
        {
          scrollTop: 0,
        },
        "slow"
      );
      return false;
    }
  }
  function scrollToSection(event) {
    event.preventDefault();
    $("html, body").animate(
      {
        scrollTop: $($.attr(this, "href")).offset().top - 50, // Adjust the offset if needed
      },
      500
    );
  }
  function activeNavLink() {
    var currentScroll = $(this).scrollTop();

    $("section").each(function () {
      var sectionTop = $(this).offset().top - 60;
      var sectionBottom = sectionTop + $(this).outerHeight();

      if (currentScroll >= sectionTop && currentScroll < sectionBottom) {
        var id = $(this).attr("id");
        $("nav ul li a").removeClass("active");
        $('nav ul li a[href="#' + id + '" ]').addClass("active");
      }
    });
  }
  function chosenCarFun(carId) {
    chosenCar = cars.find((car) => car.id == carId);
    $("#carIMG").animate(
      {
        left: "-100%",
      },
      400,
      function () {
        $(this)
          .attr("src", chosenCar.image)
          .animate(
            {
              left: "100%",
            },
            0
          )
          .animate({
            left: 0,
          });
      }
    );

    updateCarDetails();
  }

  function updateCarDetails() {
    $("#make").text(chosenCar.make);
    $("#model").text(chosenCar.model);
    $("#year").text(chosenCar.year);
    $("#color").text(chosenCar.color);
    $("#mileage").text(chosenCar.mileage);
    $("#fuelType").text(chosenCar.fuelType);
    $("#transmission").text(chosenCar.transmission);
    $("#engine").text(chosenCar.engine);
    $("#horsepower").text(chosenCar.horsepower);
    $("#features").html(
      chosenCar.features.map((feature) => `<p>${feature}</p>`).join("")
    );
    $("#price").text(`Price: ${chosenCar.price}$`);
  }

  function populateCarOptions() {
    $("#cars").html(
      cars
        .map((car) => `<option value="${car.id}">${car.model}</option>`)
        .join("")
    );
  }

  function loadCarData() {
    // $.getJSON("https://freetestapi.com/api/v1/cars").done((res) => {
    //   cars = res;
    //   console.log(res);
    //   chosenCarFun(res[0].id);
    //   populateCarOptions();
    // });
    cars = data();
    chosenCarFun(cars[0].id);
    populateCarOptions();
  }

  function initializeTitles() {
    drawTitle("#CustomerServices", "Customer Services");
    drawTitle("#ContactUs", "Contact Us");
    drawTitle("#MeetOurPartners", "Meet Our Partners");
  }

  function drawTitle(element, title) {
    $(element).html(
      `<h1 class="md:text-[42px] text-[36px] text-center my-4 font-bold text-mainText relative after:absolute after:w-[30%] after:h-1 after:bg-mainColor after:left-[34%] after:bottom-[-13px] after:content-['']">${title}</h1>`
    );
  }

  function handleWindowResize() {
    $(window).resize(() => {
      if ($(window).width() > 777) {
        $("ul").css("display", "flex").css("top", "0");
      } else {
        $("nav ul").css("top", `${$("nav").height()}px`);
      }
    });
  }

  function handleWindowScroll() {
    $(window).scroll(() => {
      if ($(window).width() > 777) {
        if ($(window).scrollTop() >= 10) {
          $("nav").css({
            position: "fixed",
            "box-shadow": "0 0 20px lightgray",
          });
          $(".logo").css({
            height: "34px",
            width: "180px",
          });
        } else {
          $("nav").css({
            position: "relative",
            "box-shadow": "none",
          });
          $(".logo").css({
            height: "70px",
            width: "271px",
          });
        }
      } else {
        if ($(window).scrollTop() >= 10) {
          $("nav").css({
            position: "fixed",
            "box-shadow": "0 0 20px lightgray",
          });
        } else {
          $("nav").css({
            position: "relative",
            "box-shadow": "none",
          });
        }
        $("nav ul").css("top", `${$("nav").height()}px`);
      }
    });
  }
  function initializeReviews() {
    var reviews = [
      {
        id: 1,
        review:
          "This rental was the best rental experience ever! After completing all details online myself, the pick-up was super efficient,extremely friendly, and free of the usual 5 - 10 min very unpleasant drilling of why one is not signing up to all options(insurance, etc) .I was handed the keys and a wide register print out that required...",
        name: "– Jon Doe, Las Vegas NV",
      },
      {
        id: 2,
        review:
          "I had a fantastic experience with this car rental service. The process was smooth and hassle-free. Thestaff was courteous and made sure I was well taken care of .The car was in excellent condition, and the return process was equally seamless.I will definitely use their services again.",
        name: "– Jane Smith, New York NY",
      },
      {
        id: 3,
        review:
          "Exceptional service and great value for money! The booking process was straightforward, and the car exceeded my expectations in terms of cleanliness and performance  .The customer support team was very responsive and helpful.I highly recommend this car rental company.",
        name: "– Mike Johnson, San Francisco CA",
      },
    ];

    $("#bulletReview").html(
      "<li class='cursor-pointer'></li>".repeat(reviews.length)
    );
    $("#review").text(reviews[0].review);
    $("#nameClient").text(reviews[0].name);
    $("#bulletReview li")[0].style.color = "red";
    $("#bulletReview li").each(function (index) {
      $(this).on("click", function () {
        $("#bulletReview li").each((i, val) => {
          $(val).css("color", "black");
        });
        // Update review content based on clicked bullet point index
        $(this).css("color", "red");
        $("#review")
          .fadeOut(() => {
            return $("#review").text(reviews[index].review);
          })
          .fadeIn();
        $("#nameClient")
          .fadeOut(() => {
            return $("#nameClient").text(reviews[index].name);
          })
          .fadeIn();
      });
    });
  }
});
