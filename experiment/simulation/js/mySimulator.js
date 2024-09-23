var text;
const typeSpeed = 60;

var matSelected = 1;
var timerId,
  typeTarget = $("#typer"),
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

let english = true;
function toggleVoice(btn) {
  english = !english;
  if (english) btn.innerHTML = "हिंदी";
  else btn.innerHTML = "English";
}

function textToSpeech(text, lang) {
  // Check if the SpeechSynthesis API is available in the browser
  if ("speechSynthesis" in window) {
    // Create a new SpeechSynthesisUtterance object
    const utterance = new SpeechSynthesisUtterance();

    // Set the text to be spoken
    utterance.text = text;

    // Set the language
    if (lang) {
      utterance.lang = lang;
    }

    // Start the speech synthesis
    window.speechSynthesis.speak(utterance);
  } else {
    console.error("Speech synthesis is not supported in this browser.");
  }
}
// text to speech fxn end

// toast message function
function showToast(msg, type = 0) {
  tWrapper.append(`<div id="t${ti++}" class="toast${type == 1 ? " danger" : type == 2 ? " success" : ""
    }" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="toast-header">
        <svg class="bd-placeholder-img rounded mr-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img"><rect width="100%" height="100%" fill="${type == 1 ? "#ff0000" : type == 2 ? "#31a66a" : "#007aff"
    }" /></svg>
        <strong class="mr-auto">Notification</strong>
    </div>
    <div class="toast-body">
        ${msg}
</div>
</div>`);
  $(`#t${ti - 1}`).toast({
    delay: 5500,
  });
  $(`#t${ti - 1}`).toast("show");
}

// Page Message
$(function () {
  if (english) {
    type("Welcome, Get started by switching on the machine.");
    textToSpeech("Welcome, Get started by switching on the machine.");
  } else {
    type("मशीन को स्टार्ट बटन द्वारा चालू करके प्रारंभ करें।");
    textToSpeech("मशीन को स्टार्ट बटन द्वारा चालू करके प्रारंभ करें।", "hi-IN");
  }
});

var vhandle = $("#vslider").find(".custom-handle");
var avhandle = $("#avslider").find(".custom-handle");
var mhandle = $("#mslider").find(".custom-handle");

// Sliders
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
        av = "LV";
        break;
      case 2:
        txt = "HV";
        av = "HV";
        break;
    }
    vhandle.text(txt);
  },
});

$("#avslider").slider({
  min: 100,
  max: 102,
  value: 100,
  animate: "slow",
  orientation: "horizontal",
  disabled: true,
  create: function () {
    avhandle.text($(this).slider("value"));
  },
  slide: function (event, ui) {
    if (ui.value == 100) {
      avhandle.text("100");
      ac = "100";
    }
    if (ui.value == 101) {
      avhandle.text("120");
      ac = "120";
    }
    if (ui.value == 102) {
      avhandle.text("200");
      ac = "200";
    }
  },
});

$("#mslider").slider({
  min: 0,
  max: 10,
  disabled: true,
  create: function () {
    mhandle.text("0");
  },
  slide: function (event, ui) {
    var txt = "0";
    switch (ui.value) {
      case 0:
        txt = "0";
        mag = "0";
        break;
      case 1:
        txt = "1";
        mag = "1";
        break;
      case 2:
        txt = "2";
        mag = "2";
        break;
      case 3:
        txt = "5";
        mag = "5";
        break;
      case 4:
        txt = "10";
        mag = "10";
        break;
      case 5:
        txt = "20";
        mag = "20";
        break;
      case 6:
        txt = "50";
        mag = "50";
        break;
      case 7:
        txt = "80";
        mag = "80";
        break;
      case 8:
        txt = "100";
        mag = "100";
        break;
      case 9:
        txt = "150";
        mag = "150";
        break;
      case 10:
        txt = "200";
        mag = "200";
        break;
    }
    mhandle.text(txt);
  },
});

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
  showToast("Remove the sample holder");
  l = 1;
  removeHolder();
}

function removeHolder() {
  if (l) {
    if (english) {
      type(
        "Place the sample holder in the provided space."
      );
      textToSpeech(
        "Place the sample holder in the provided space."
      );
    } else {
      type("नमूना धारक को दिए गए स्थान पर रखें।");
      textToSpeech("नमूना धारक को दिए गए स्थान पर रखें।", "hi-IN");
    }
  }
  $(".move").on("dragstart", function (e) {
    var selected = e.target;
    $(".placeSampleHolder").on("dragover", function (e) {
      e.preventDefault();
    });
    $(".placeSampleHolder").on("drop", function (e) {
      $(".placeSampleHolder").append(selected);
      insertSample();
    });
  });
};

function insertSample() {
  if (l) {
    if (english) {
      type("Place the sample on the sample holder.");
      textToSpeech("Place the sample on the sample holder.");
    } else {
      type("नमूने को नमूना धारक पर रखें।");
      textToSpeech(
        "नमूने को नमूना धारक पर रखें।",
        "hi-IN"
      );
    }
  }
  l = 0;

  $("#image-y").on("dragstart", function (e) {
    e.originalEvent.dataTransfer.setData("text/plain", "dragging-y"); // Allow image Y to be draggable
  });

  $("#image-x").on("dragover", function (e) {
    e.preventDefault();
  });

  $("#image-x").on("drop", function (e) {
    e.preventDefault();
    const draggedItem = e.originalEvent.dataTransfer.getData("text/plain");

    if (draggedItem === "dragging-y") {
      $("#image-y").css("visibility", "hidden");
      $("#image-x").attr("src", "../images/parts/sh-1.png"); // Replace image X with image Z when any image is dropped onto it
    }

    insertHolder();
  });
};

function insertHolder() {
  if (english) {
    type("Place the sample holder inside TEM.");
    textToSpeech("Place the sample holder inside TEM.");
  } else {
    type("नमूना धारक को TEM के अंदर रखें।|");
    textToSpeech("नमूना धारक को TEM के अंदर रखें।", "hi-IN");
  }

  $(".placeSampleHolder").on("dragstart", function (e) {
    var selected = e.target;
    $(".placed").on("dragover", function (e) {
      e.preventDefault();
    });
    $(".placed").on("drop", function (e) {
      $(".placed").append(selected);
      setVaccum();
    });
  })
};

function setVaccum() {
  $(".placeSampleHolder").off("dragstart");

  $("#vslider").slider("option", "disabled", false);
  $("#setvac").prop("disabled", false);

  if (english) {
    type("Set the vaccum.");
    textToSpeech("Set the vaccum.");
  } else {
    type("वैक्यूम सेट करे।");
    textToSpeech("वैक्यूम सेट करे।", "hi-IN");
  }

  // vac = $("#vslider").slider("option", "value");

  $("#setvac").click(function () {
    showToast("Vaccum set");
    $("#vacImg").animate(
      {
        fontSize: 220,
      },
      {
        step: function (now, fx) {
          $(this).css("clip", `rect(${Math.round(now)}px, 17rem, 300px, 0)`);
        },
        duration: 2500,
        easing: "linear",
      }
    );
    setVoltage();
  });
};

function setVoltage() {
  $("#vslider").slider("option", "disabled", true);
  $("#setvac").prop("disabled", true);

  $("#setav").prop("disabled", false);
  $("#avslider").slider("option", "disabled", false);

  if (english) {
    type("Set accelerating voltage.");
    textToSpeech("Set the accelerating voltage.");
  } else {
    type("त्वरित वोल्टेज सेट करें।");
    textToSpeech("त्वरित वोल्टेज सेट करें।", "hi-IN");
  }

  // av = $("#avslider").slider("option", "value");
  $("#setav").click(function () {
    showToast("Accelerating Voltage Set");
    beamOn();
  });
};

function beamOn() {
  $("#setav").prop("disabled", true);
  $("#avslider").slider("option", "disabled", true);

  if (english) {
    type("Switch on the beam.");
    textToSpeech("Switch on the beam now.");
  } else {
    type("बीम को चालू करें।");
    textToSpeech("बीम को चालू करें।", "hi-IN");
  }
  $("#on").prop("disabled", false);
  showToast("Switch on the beam");

  $("#on").one("click", function () {
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
    setTimeout(function () {
      imagingMode()}, 5000);
  });
};

function setMagnigication() {
  $("#setmag").prop("disabled", false);
  $("#mslider").slider("option", "disabled", false);

  if (english) {
    type("Set the magnification.");
    textToSpeech("Set the magnification.");
  } else {
    type("आवर्धन सेट करें।");
    textToSpeech("आवर्धन सेट करें।", "hi-IN");
  }

  $("#setmag").click(function () {
    showToast("Magnification set");

    output();
  });
};

function imagingMode() {

  if (english) {
    type("Select the imaging mode.");
    textToSpeech("Select the imaging mode.");
  } else {
    type("इमेजिंग मोड का चयन करें।");
    textToSpeech("इमेजिंग मोड का चयन करें।", "hi-IN");
  }

  $("#setmag").prop("disabled", true);
  $("#mslider").slider("option", "disabled", true);

  $("#position").prop("disabled", false);

  $(".imgMode").change(function () {
    imode = $(".imgMode option:selected").text();

    $("#position").prop("disabled", true);

    setMagnigication();
  });
};

function output() {
  if (english) {
    type("The output image is displaying on the right side of the screen.");
    textToSpeech("The output image is displaying on the right side of the screen.");
  } else {
    type("आउटपुट छवि स्क्रीन के दाईं ओर प्रदर्शित हो रही है।");
    textToSpeech("आउटपुट छवि स्क्रीन के दाईं ओर प्रदर्शित हो रही है।", "hi-IN");
  }

  url = "../images/outputs/" + av + ac + mag + imode + ".png";

   $("#output").html(
     "<br><img id='image' class='fluid-container' src='" +
       url +
       "' style='width: 100%' alt=' " +
       url +
       " ' /><br><br><div class='alert alert-success d-flex align-items-center' role='alert'><svg class='bi flex-shrink-0 me-2' style='height: 2rem; width: 2rem' role='img' aria-label='Info:'><use xlink:href='#info-fill' /></svg><div>Follow the instructions carefully.</div></div><br><div><a alt=' " +
       url +
       " ' class='btn btn-success col-sm-5' download href=' " +
       url +
       " '>Download Image</a><a class='btn btn-success col-sm-5' href='calculations.html' id='download'>Proceed to Calculate</a></div>"
   );
    console.log(url)
}


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