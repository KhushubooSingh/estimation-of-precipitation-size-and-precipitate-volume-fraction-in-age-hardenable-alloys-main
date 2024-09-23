var text;
const typeSpeed = 60;

var   matSelected = 1 ;
var timerId, typeTarget = $("#typer"),
    tWrapper = $("#toast-wrapper"),
    ti = 0,
    currentStep = 0,
    contrast = 0,
    brightness = 0,
    vac = 0,
    av = 0,
    on = false,
    dropped = false,
    imgs = [],
    mode = 1;

// typing function
function type(txt, cur = 0) {
    if (cur == txt.length) {
        timerId = -1;
        return;
    }
    if (cur == 0) {
        typeTarget.html("");
        clearTimeout(timerId);
    }
    typeTarget.append(txt.charAt(cur));
    timerId = setTimeout(type, typeSpeed, txt, cur + 1);
}

// text to speech function
function textToSpeech(text) {
    var available_voices = window.speechSynthesis.getVoices();
    var english_voice = '';
    // for (var i = 0; i < available_voices.length; i++) {
    //     if (available_voices[i].lang === 'en-US') {
    //         english_voice = available_voices[i];
    //         break;
    //     }
    // }
    for (var i = 0; i < available_voices.length; i++) {
        if (available_voices[i].name.includes('Female')) { // Look for a voice with "Female" in its name
            english_voice = available_voices[i];
            break;
        }
    }
    if (english_voice === '')
        english_voice = available_voices[0];
    var utter = new SpeechSynthesisUtterance();
    utter.rate = 1.1;
    utter.pitch = 0.9;
    utter.text = text;
    utter.voice = english_voice;
    window.speechSynthesis.speak(utter);
}
if (window.speechSynthesis.getVoices().length == 0) {
    window.speechSynthesis.addEventListener('voiceschanged', function() {
        textToSpeech(text);
    });
}
// text to speech fxn end

// switch on
function toggleSwitch(toggleElement) {
    if (toggleElement.checked) {
      // Switch is ON, trigger strt()
      strt();
    } else {
      // Switch is OFF, reload the page
      location.reload();
    }
  }

function strt() {
    $('#dropzone').css('display', 'block');
    $('#position').prop("disabled", false);
    $('#removeButton').prop("disabled", false);
    // $('#insertButton').prop("disabled", false);
    showToast("Remove the sample holder");
    type("Now remove the holder, drag and drop the material, and place it into the machine");
    textToSpeech("Now and remove and place the material on the holder and inser/place inside");
}

// toast message function
function showToast(msg, type = 0) {
    tWrapper.append(`<div id="t${ti++}" class="toast${type == 1 ? ' danger' : (type == 2 ? ' success' : '')}" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="toast-header">
        <svg class="bd-placeholder-img rounded mr-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img"><rect width="100%" height="100%" fill="${type == 1 ? '#ff0000' : (type == 2 ? '#31a66a' : '#007aff')}" /></svg>
        <strong class="mr-auto">Notification</strong>
    </div>
    <div class="toast-body">
        ${msg}
</div>
</div>`);
    $(`#t${ti - 1}`).toast({
        delay: 5500
    });
    $(`#t${ti - 1}`).toast('show');
}
// end of toast msg function

$(function() {
    type("Welcome to Advanced Imaging in TEM, Get started by switching on the machine");
    textToSpeech("Welcome, Get started by switching on the machine");

    var vhandle = $("#vslider").find(".custom-handle");
    var avhandle = $("#avslider").find(".custom-handle");
    var mhandle = $("#mslider").find(".custom-handle");

 // vaccum slider
    $("#vslider").slider({
        min: 0,
        max: 2,
        disabled: true,
        create: function () {
          vhandle.text("Off");
        },
        slide: function (event, ui) {
          var txt = "Off";
          switch (ui.value) {
            case 0:
              txt = "Off";
              break;
            case 1:
              txt = "LV";
              break;
            case 2:
              txt = "HV";
              break;
          }
          vhandle.text(txt);
        }
    });
  
//  acc voltage slider
    $("#avslider").slider({
        min: 100,
        max: 102,
        value: 100,
        animate: "slow",
        orientation: "horizontal",
        disabled: true,
        create: function() {
            avhandle.text($(this).slider("value"));
        },
        slide: function(event, ui) {
            if (ui.value == 100) {
                avhandle.text("100");
            }
            if (ui.value == 101) {
                avhandle.text("120");
            }
            if (ui.value == 102) {
                avhandle.text("200");
            }
        }
    });

    // magnification slider
     $("#mslider").slider({
        min: 0,
        max: 2,
        disabled: true,
        create: function () {
          mhandle.text("Off");
        },
        slide: function (event, ui) {
          var txt = "Off";
          switch (ui.value) {
            case 0:
              txt = "Off";
              break;
            case 1:
              txt = "low";
              break;
            case 2:
              txt = "high";
              break;
          }
          mhandle.text(txt);
        }
    });

    // beam on
    $("#on").one("click", function() {
        $('#on').css('backgroundColor', '#21e76e');
        // beam comes here
        clearInterval(beamTimer);
        clearInterval(beamTimer2);
        beamy = 0;
        ctx.clearRect(0, 0, beamCanvas.width, beamCanvas.height);
        ctx2.clearRect(0, 0, beam2W, beam2H);
        beamTimer = beamTimer2 = -1;
        beamTimer = setInterval(drawBeam, 10);
        // beam ends
        type("Now you can see the output image.");

        $("#avslider").slider("option", "disabled", false);
    });

    // vaccum
    $("#setvac").click(function() {
        type("Now set accelerating voltage");
        textToSpeech("Now set the accelerating voltage");

        vac = $("#vslider").slider("option", "value");

        $("#setav").prop("disabled", false);
        $("#avslider").slider("option", "disabled", false);
        showToast("Vaccum set");
        $("#vacImg").animate({
            fontSize: 220
        }, {
            step: function(now, fx) {
                $(this).css('clip', `rect(${Math.round(now)}px, 17rem, 300px, 0)`);
            },
            duration: 2500,
            easing: 'linear'
        });
    });

    // acc voltage
    $("#setav").click(function() {
        av = $("#avslider").slider("option", "value");
        type("Now switch on the beam.");
        textToSpeech("Try to switch on the beam now.");
        $("#on").prop("disabled", false);
        showToast("Switch on the beam");
    });

    $(".scenes button").click(function() {
        mode = parseInt($(this).attr("data-mode"));
        $(".scenes button").removeClass("active");
        $(this).addClass("active");
    });

    // insert 
    $("#removeButton").click(function() {

        $("#insertButton").prop("disabled", false);
        showToast("Insert the material");
        
        });

    $("#insertButton").click(function() {
        $("#vslider").slider("option", "disabled", false);
        $("#setvac").prop("disabled", false);
    });
});

// beam code start 
var beamCanvas = document.getElementById("beam");
var ctx = beamCanvas.getContext('2d');
var beamy = 0,
    beamx = parseInt(beamCanvas.width / 2),
    beamWidth, beamTimer = -1;
var beamCanvas2 = document.getElementById("beam2");
var ctx2 = beamCanvas2.getContext('2d');
var beam2H = beamCanvas2.height,
    beam2W = beamCanvas2.width,
    beamx2 = parseInt(beamCanvas2.width / 2),
    beamTimer2 = -1;

function randEx(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function drawBeam() {
    ctx.beginPath();

    beamWidth = Math.sin(beamy * 3.14 / 160) * 7;
    ctx.shadowBlur = 1;
    ctx.shadowColor = 'red';
    ctx.strokeStyle = "green";
    ctx.shadowOffsetY = 0;
    ctx.shadowOffsetX = beamWidth;
    ctx.moveTo(beamx, beamy);
    ctx.lineTo(beamx + 1, beamy);
    ctx.stroke();


    ctx.shadowOffsetX = -beamWidth / 2;
    ctx.moveTo(beamx, beamy);
    ctx.lineTo(beamx + 1, beamy);
    ctx.stroke();

    ctx.shadowOffsetX = beamWidth / 2;
    ctx.moveTo(beamx, beamy);
    ctx.lineTo(beamx + 1, beamy);
    ctx.stroke();

    ctx.shadowOffsetX = -beamWidth;
    ctx.moveTo(beamx, beamy);
    beamy += 1;
    ctx.lineTo(beamx, beamy);
    ctx.stroke();
    if (beamy >= beamCanvas.height) {
        clearInterval(beamTimer);
        beamTimer = -1;
        beamTimer2 = setInterval(drawBeam2, 100);

        var inp = $("#position :selected").val();
        if (inp == 1) {
            $('#outImage2').hide();
            $('#outImage1').show(500);
        } else {
            $('#outImage1').hide();
            $('#outImage2').show(500);
        }
    }
}

function drawBeam2() {
    ctx2.beginPath();
    ctx2.clearRect(0, 0, beam2W, beam2H);
    ctx2.strokeStyle = "#FFFFFFBB";
    ctx2.moveTo(beamx2, 23);
    ctx2.lineTo(beamx2 + 60 + randEx(-5, 5), randEx(-10, 5));
    ctx2.moveTo(beamx2 - 6, 23);
    ctx2.lineTo(beamx2 + 60 + randEx(-5, 5), randEx(-10, 5));
    ctx2.stroke();
}
// beam code end

// sample and holder move
const imageX = document.getElementById("image-x");
const imageY = document.getElementById("image-y");
const imageA = document.getElementById("image-a");
const imageB = document.getElementById("image-b");

const removeButton = document.getElementById("removeButton");
const insertButton = document.getElementById("insertButton");

let isImageYDropped = false; // Flag to track if image-y has been dropped

removeButton.addEventListener("click", () => {
  imageX.style.transform = "translateX(-100%)"; // Move image X from right to left
});

imageY.addEventListener("dragstart", (e) => {
  e.dataTransfer.setData("text/plain", "dragging-y"); // Allow image Y to be draggable
});

imageA.addEventListener("dragstart", (e) => {
  e.dataTransfer.setData("text/plain", "dragging-a"); // Allow image A to be draggable
});

imageB.addEventListener("dragstart", (e) => {
  e.dataTransfer.setData("text/plain", "dragging-b"); // Allow image B to be draggable
});

imageX.addEventListener("dragover", (e) => {
  e.preventDefault();
});

imageX.addEventListener("drop", (e) => {
  e.preventDefault();
  const draggedItem = e.dataTransfer.getData("text/plain");

    if (draggedItem === "dragging-y" && isImageYDropped=== false) {
        imageY.style.visibility = "hidden";
        isImageYDropped = true; // Set the flag when image-_ is dropped
        imageX.src = "../images/parts/sh-1.png"; // Replace image X with image Z when any image is dropped onto it
        $("#insertButton").prop("disabled", false);
    }
    else if (draggedItem === "dragging-a" && isImageYDropped=== false) {
        imageA.style.visibility = "hidden";
        isImageYDropped = true; // Set the flag when image-_ is dropped

        imageX.src = "../images/parts/sh-2.png"; // Replace image X with image Z when any image is dropped onto it
        $("#insertButton").prop("disabled", false);
    }
    else if (draggedItem === "dragging-b" && isImageYDropped=== false) {
        imageB.style.visibility = "hidden";
        isImageYDropped = true; // Set the flag when image-_ is dropped

        imageX.src = "../images/parts/sh-3.png"; // Replace image X with image Z when any image is dropped onto it
        $("#insertButton").prop("disabled", false);
    }
});

insertButton.addEventListener("click", () => {
  imageX.style.transform = "translateX(0%)"; // Move image X back to its original position
});
// sample and holder move end