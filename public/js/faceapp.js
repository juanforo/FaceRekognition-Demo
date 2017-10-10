$(document).ready(function() {

  if (window.JpegCamera) {
      //Variable to pause the snapshots if someone was recognized
      var interval = 0;
      var camera; // placeholder

    // Add the photo taken to the current Rekognition collection for later comparison

    function intervalManager(flag) {
        if(flag)
            interval = setInterval(compare_image, 5000);
        else
            clearInterval(interval);
    }


    // Compare the photographed image to the current Rekognition collection
    var compare_image = function() {
      $('#status').find('.texts li:first').text("Identifying...");
      $('.tlt').textillate('in');
      var snapshot = camera.capture();
      var api_url = "/compare";
      snapshot.upload({api_url: api_url}).done(function(response) {
        var data = JSON.parse(response);
        console.log(data);
        if (data.id !== undefined && data.id != "0" && data.id != "UNRECOGNIZED") {
            $('.tlt').textillate('out');


            //If JUAN

            if(data.id.toUpperCase() == "JUAN"){
                $('#status').find('.texts li:first').text("Success!");
                $('#name').find('.texts li:first').text("Name: Juan Sebastian Ruiz Villa");
                $('#newTickets').find('.texts li:first').text("New Tickets: 3");
                $('#ongoingTickets').find('.texts li:first').text("Ongoing Tickets: 1");
                $('#projects').find('.texts li:first').text("New Project: Speedpay");
                $('#alert1').find('.texts li:first').text("Alert: Oracle Timesheets!");
                $('.tlt').textillate('in');
                $('.tlt2').textillate('in');
                intervalManager(false);
                // create speech response
                $.post("/speech", {tosay: "Good " + greetingTime(moment()) + " " + data.id + ". Welcome to eendava. Today you have 3 new tickets, 1, ongoing ticket, and you were included on the speedpay project, also, please remember to fill your oracle timesheets"}, function(response) {
                    $("#audio_speech").attr("src", "data:audio/mpeg;base64," + response);
                    $("#audio_speech")[0].play();
                });
            }


            //if Hollman
            else if(data.id.toUpperCase() == "HOLLMAN"){
                $('#status').find('.texts li:first').text("Success!");
                $('#name').find('.texts li:first').text("Name: Hollman Eduardo Enciso Peña");
                $('#newTickets').find('.texts li:first').text("New Tickets: 0");
                $('#ongoingTickets').find('.texts li:first').text("Ongoing Tickets: 1");
                $('#projects').find('.texts li:first').text("New Project: Buzzpoints");
                $('#alert1').find('.texts li:first').text("Alert: Oracle Timesheets!");
                $('#alert2').find('.texts li:first').text("Alert: Travel Expenses!!");
                $('.tlt').textillate('in');
                $('.tlt2').textillate('in');
                intervalManager(false);
                // create speech response
                $.post("/speech", {tosay: "Good " + greetingTime(moment()) + " " + data.id + ". Welcome to eendava. Today you have no new tickets, 2, ongoing tickets, and you look pretty danm gay. Also please remember to fill your oracle timesheets, and log your travel expenses"}, function(response) {
                    $("#audio_speech").attr("src", "data:audio/mpeg;base64," + response);
                    $("#audio_speech")[0].play();
                });
            }

            //if Julian
            else if(data.id.toUpperCase() == "JULIAN"){
                $('#status').find('.texts li:first').text("Success!");
                $('#name').find('.texts li:first').text("Name: Julian Forero");
                $('#newTickets').find('.texts li:first').text("New Tickets: 4");
                $('#ongoingTickets').find('.texts li:first').text("Ongoing Tickets: 1");
                $('#projects').find('.texts li:first').text("Current Project: Mclatchy");
                $('.tlt').textillate('in');
                $('.tlt2').textillate('in');
                intervalManager(false);
                // create speech response
                $.post("/speech", {tosay: "Good " + greetingTime(moment()) + " " + data.id + ". Welcome to eendava. Today you have 4 new tickets, and 1, ongoing ticket. There are no changes regarding your project allocation"}, function(response) {
                    $("#audio_speech").attr("src", "data:audio/mpeg;base64," + response);
                    $("#audio_speech")[0].play();
                });
            }  //if someone else

            else {

                $('#status').find('.texts li:first').text("Success!");
                $('#name').find('.texts li:first').text("Name: " + data.id );
                $('#newTickets').find('.texts li:first').text("Tickets Information Unretrievable");
                $('#projects').find('.texts li:first').text("Project Allocation Unretrievable");
                $('.tlt').textillate('in');
                $('.tlt2').textillate('in');
                intervalManager(false);
                // create speech response
                $.post("/speech", {tosay: "Good " + greetingTime(moment()) + " " + data.id + ". Welcome to eendava. Sorry, I cannot retrieve your full profile your data, please contact the system administrator"}, function(response) {
                    $("#audio_speech").attr("src", "data:audio/mpeg;base64," + response);
                    $("#audio_speech")[0].play();
                });
            }


            //starts pause period
            setTimeout(function () {intervalManager(true); $('.tlt').textillate('out'); $('.tlt2').textillate('out');},10000);

            $('#status').find('.texts li:first').text("Identifying...");

        } else if (data.id !== undefined && data.id == "0") {

          console.log("no one is here!");

        } else {
              $.post("/speech", {tosay: "Sorry. I can't recognize you"}, function(response) {
                  $("#audio_speech").attr("src", "data:audio/mpeg;base64," + response);
                  $("#audio_speech")[0].play();
              });
          }
        this.discard();
      }).fail(function(status_code, error_message, response) {
        $.post("/speech", {tosay: "Sorry. I can't recognize you"}, function(response) {
          $("#audio_speech").attr("src", "data:audio/mpeg;base64," + response);
          $("#audio_speech")[0].play();

        });
        // $("#upload_status").html("Upload failed with status " + status_code + " (" + error_message + ")");
        // $("#upload_result").html(response);
        // $("#loading_img").hide();
      });

    };

    var greetingTime = function(moment) {
      var greet = null;

      if(!moment || !moment.isValid()) { return; } //if we can't find a valid or filled moment, we return.
            var split_afternoon = 12 //24hr time to split the afternoon
      var split_evening = 17 //24hr time to split the evening
      var currentHour = parseFloat(moment.format("HH"));

      if(currentHour >= split_afternoon && currentHour <= split_evening) {
        greet = "afternoon";
      } else if(currentHour >= split_evening) {
        greet = "evening";
      } else {
        greet = "morning";
      }
      return greet;
    }

    //Initializes the text animation parameters without starting it for the status text

    $('.tlt').textillate({
        // enable looping
        loop: false,

        selector: '.texts',

        // sets the initial delay before starting the animation
        // (note that depending on the in effect you may need to manually apply
        // visibility: hidden to the element before running this plugin)
        initialDelay: 1,

        // set whether or not to automatically start animating
        autoStart: false,

        // in animation settings
        in: {
            // set the effect name
            effect: 'flipInY',

            // set the delay factor applied to each consecutive character
            delayScale: 1,

            // set the delay between each character
            delay: 25,

            // set to true to animate all the characters at the same time
            sync: false,

            // randomize the character sequence
            // (note that shuffle doesn't make sense with sync = true)
            shuffle: false,

            // reverse the character sequence
            // (note that reverse doesn't make sense with sync = true)
            reverse: false
        },

        // out animation settings.
        out: {
            effect: 'flipOutY',
            delayScale: 1,
            delay: 25,
            sync: false,
            shuffle: false,
            reverse: false
        },

        // set the type of token to animate (available types: 'char' and 'word')
        type: 'char'
    });

    $('.tlt2').textillate({
        // enable looping
        loop: false,

        selector: '.texts',

        // sets the initial delay before starting the animation
        // (note that depending on the in effect you may need to manually apply
        // visibility: hidden to the element before running this plugin)
        initialDelay: 1,

        // set whether or not to automatically start animating
        autoStart: false,

        // in animation settings
        in: {
            // set the effect name
            effect: 'flipInY',

            // set the delay factor applied to each consecutive character
            delayScale: 1,

            // set the delay between each character
            delay: 25,

            // set to true to animate all the characters at the same time
            sync: false,

            // randomize the character sequence
            // (note that shuffle doesn't make sense with sync = true)
            shuffle: false,

            // reverse the character sequence
            // (note that reverse doesn't make sense with sync = true)
            reverse: false
        },

        // out animation settings.
        out: {
            effect: 'flipOutY',
            delayScale: 1,
            delay: 25,
            sync: false,
            shuffle: false,
            reverse: false
        },

        // set the type of token to animate (available types: 'char' and 'word')
        type: 'char'
    });

    // Define what the button clicks do.
    //starts timer
    intervalManager(true);

    $.post("/speech", {tosay: "Hello! I am the Luciana project"}, function(response) {
        $("#audio_speech").attr("src", "data:audio/mpeg;base64," + response);
        $("#audio_speech")[0].play();
    });
    // Initiate the camera widget on screen
    var options = {
      swf_url: "js/jpeg_camera/jpeg_camera.swf",
      quality: 1
    }


    camera = new JpegCamera("#camera", options).ready(function(info) {
    });

  }

});
