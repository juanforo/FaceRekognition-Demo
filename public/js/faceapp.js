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
      var snapshot = camera.capture();
      var api_url = "/compare";
      snapshot.upload({api_url: api_url}).done(function(response) {
        var data = JSON.parse(response);
        console.log(data);
        if (data.id !== undefined && data.id != "0" && data.id != "UNRECOGNIZED") {
            intervalManager(false);
            // create speech response
            $.post("/speech", {tosay: "Good " + greetingTime(moment()) + " " + data.id + ". Welcome to eendava. Today you have 3 new tickets, and 1, new project awaiting for you!, also, please remember to fill your oracle timesheets"}, function(response) {
                $("#audio_speech").attr("src", "data:audio/mpeg;base64," + response);
                $("#audio_speech")[0].play();
            });
           setTimeout(function () {intervalManager(true);},10000);

        } else if (data.id !== undefined && data.id == "0") {

          console.log("no one is here!");

        } else {
              $.post("/speech", {tosay: "I can't recognize you. Sorry"}, function(response) {
                  $("#audio_speech").attr("src", "data:audio/mpeg;base64," + response);
                  $("#audio_speech")[0].play();
              });
          }
        this.discard();
      }).fail(function(status_code, error_message, response) {
        $.post("/speech", {tosay: "I can't recognize you. Sorry"}, function(response) {
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
