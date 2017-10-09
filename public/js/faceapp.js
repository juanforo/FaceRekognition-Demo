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

            if(data.id == "JUAN"){
                $('#status').find('.texts li:first').text("Success!");
                $('.tlt').textillate('in');
                $('.tlt2').textillate('in');
                intervalManager(false);
                // create speech response
                $.post("/speech", {tosay: "Good " + greetingTime(moment()) + " " + data.id + ". Welcome to eendava. Today you have 3 new tickets, and 1, new project awaiting for you!, also, please remember to fill your oracle timesheets"}, function(response) {
                    $("#audio_speech").attr("src", "data:audio/mpeg;base64," + response);
                    $("#audio_speech")[0].play();
                });
            }


            //if Hollman
            else if(data.id == "HOLLMAN"){
                $('#status').find('.texts li:first').text("Success!");
                $('.tlt').textillate('in');
                intervalManager(false);
                // create speech response
                $.post("/speech", {tosay: "Good " + greetingTime(moment()) + " " + data.id + ". Welcome to eendava. Today you have 3 new tickets, and 1, new project awaiting for you!, also, please remember to fill your oracle timesheets"}, function(response) {
                    $("#audio_speech").attr("src", "data:audio/mpeg;base64," + response);
                    $("#audio_speech")[0].play();
                });
            }

            //if Julian
            else if(data.id == "Julian"){
                $('#status').find('.texts li:first').text("Success!");
                $('.tlt').textillate('in');
                intervalManager(false);
                // create speech response
                $.post("/speech", {tosay: "Good " + greetingTime(moment()) + " " + data.id + ". Welcome to eendava. Today you have 3 new tickets, and 1, new project awaiting for you!, also, please remember to fill your oracle timesheets"}, function(response) {
                    $("#audio_speech").attr("src", "data:audio/mpeg;base64," + response);
                    $("#audio_speech")[0].play();
                });
            }

            else {

                $('#status').find('.texts li:first').text("Success!");
                $('.tlt').textillate('in');
                intervalManager(false);
                // create speech response
                $.post("/speech", {tosay: "Good " + greetingTime(moment()) + " " + data.id + ". Welcome to eendava. Today you have 3 new tickets, and 1, new project awaiting for you!, also, please remember to fill your oracle timesheets"}, function(response) {
                    $("#audio_speech").attr("src", "data:audio/mpeg;base64," + response);
                    $("#audio_speech")[0].play();
                });
            }



            setTimeout(function () {intervalManager(true); $('.tlt').textillate('out');},10000);

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
    // Initiate the camera widget on screen
    var options = {
      swf_url: "js/jpeg_camera/jpeg_camera.swf",
      quality: 1
    }


    camera = new JpegCamera("#camera", options).ready(function(info) {
      $("#loading_img").hide();
    });

  }

});
