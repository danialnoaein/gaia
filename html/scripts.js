function toggleHelp(el) {
  var elements = el.getElementsByClassName("infotext");
  //	var elements2 = [].slice.call(elements, 0); // make a copy because of LIVE lists
  for (var i = elements.length - 1; i >= 0; --i) {
    if (elements[i].style.display === "none") {
      elements[i].style.display = "block";
    } else {
      elements[i].style.display = "none";
    }

    //elements[i].classList.toggle("show");
    //if(elements2[i].classList.contains("show"))	elements2[i].classList.remove("show");
    //else	elements2[i].classList.add("show");

    // elements[i] no longer exists past this point, in most browsers
  }
}

document.addEventListener(
  "click",
  function (event) {
    if (event.target.matches("label__UNUSED")) {
      var elements = event.target.getElementsByClassName("infotext");
      for (var i = elements.length - 1; i >= 0; --i) {
        if (elements[i].style.display === "none") {
          elements[i].style.display = "block";
        } else {
          elements[i].style.display = "none";
        }
      }
    } // end if label
    else if (event.target.id == "help") {
      // all .infotext on or off
      var elements = document.getElementsByClassName("infotext");
      var hide = true;
      for (var i = elements.length - 1; i >= 0; --i) {
        if (elements[i].style.display === "none" || !hide) {
          elements[i].style.display = "block";
          hide = false;
        } else {
          elements[i].style.display = "none";
          hide = true;
        }
      }
    } else if (event.target.id == "mic") {
      event.preventDefault();
    }
  },
  false
);

var host = "www.F2Fnetwork.com"; // default Gaia host

function findGetParameter(parameterName) {
  var result = "",
    tmp = [];
  var items = location.search.substr(1).split("&");
  for (var index = 0; index < items.length; index++) {
    tmp = items[index].split("=");
    if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
  }
  return result;
}

function parseForm(form) {
  let i,
    data = [];
  for (i = form.elements.length - 1; i >= 0; i = i - 1) {
    if (form.elements[i].name === "") continue;
    switch (form.elements[i].nodeName) {
      case "INPUT":
      case "TEXTAREA":
        form.elements[i].value = form.elements[i].value.trim();
        if (form.elements[i].value == "") {
          var getvalue = findGetParameter(form.elements[i].name);
          if (getvalue != "") form.elements[i].value = getvalue;
        }

        if (form.elements[i].value != "") {
          if (form.elements[i].name == "sendbutton") continue;
          if (form.elements[i].name == "host") host = form.elements[i].value;
          else
            data.push(
              form.elements[i].name +
                "=" +
                encodeURIComponent(form.elements[i].value)
            );
        }
        break;
    }
  }

  // a=msg.send&to=demo&payload=descr=testmsg%26z%22hi%22

  let q = ["a=msg.send"];
  //data.push("abc=0");
  q.push("to=" + findGetParameter("token"));
  //q.push("payload=" + JSON.stringify(data));
  //q.push("payload=\"" + data.join("&") + "\"");
  q.push("payload=" + data.join("%26")); // & == %26

  //let msg= {"to":findGetParameter("token"),"prio":"2","payload": encodeURIComponent(document.querySelector("[name='descr']").value)};
  //let msg= {"to":findGetParameter("token"),"prio":"2","payload": JSON.stringify(data)};
  //q.push("msgs="+JSON.stringify(msg));
  //q.push("msgs="+msg.toString());
  // a=msg.send&msgs=[{"to":"demo","prio":"2","payload":["descr","a%20vbvbb"]}]
  return q.join("&");
}

function sendData() {
  let XHR = new XMLHttpRequest();
  let FD = parseForm(form);

  XHR.addEventListener("load", function (event) {
    btn.style.display = "block";
    var reply = event.target.response;
    if (
      typeof reply != "undefined" &&
      reply !== null &&
      reply != "" &&
      "statusCode" in reply
    ) {
      switch (reply.statusCode) {
        case 0:
          htmlreply.innerHTML = "OK. Die Daten wurden gesendet.";
          labelID.value = "";
          break;
        case 201:
        case 202:
        case 310:
          htmlreply.innerHTML =
            "FEHLER:\nfalsche Parameter.\nSind UserId und Text gefüllt ?\nIst die UserId korrekt ?";
          break;
        default:
          htmlreply.innerHTML = "FEHLER:\n" + JSON.stringify(reply);
          break;
      }
    } else htmlreply.innerHTML = "FEHLER: unbekannte Antwort vom Server";
  }); //load

  XHR.addEventListener("error", function (event) {
    htmlreply.innerHTML = "FEHLER: Host: " + host + "\nPOST data:\n" + FD;
    btn.style.display = "block";
  }); //error

  if (host.substr(0, 4) != "http") host = "https://" + host;
  XHR.open("POST", host + "/GaiaServer2.php");
  XHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  XHR.responseType = "json";
  console.log(FD);
  XHR.send(FD);
}

var form = document.getElementById("myform");
var btn = document.getElementById("sendbutton");
//var useridID = document.getElementById("to");
var labelID = document.getElementById("label");
var htmlreply = document.getElementById("reply");
parseForm(form); // set defaults from URI
//document.getElementById("label").focus();

form.addEventListener("submit", function (event) {
  event.preventDefault();
  htmlreply.innerHTML = "sende...";
  btn.style.display = "none";
  sendData();
});

const autoGrow = (element) => {
  element.style.height = 0;
  element.style.height = element.scrollHeight + "px";
};

var descrTextarea = document.getElementById("descr-textarea");
descrTextarea.style.height = descrTextarea.scrollHeight + "px";
descrTextarea.style.overflowY = "hidden";
descrTextarea.addEventListener(
  "input",
  function () {
    autoGrow(this);
  },
  false
);

// accordion
var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
}

// Speech API
// If you modify this array, also update default language / dialect below.

const speechRecorderButton = document.getElementById("speech-recorder");
const speechListeningText = document.getElementById("listening");
speechRecorderButton.addEventListener("click", function () {
  startButton();
});

select_dialect = ["en-US", "United States"];
// "de-DE"

var create_email = false;
var final_transcript = "";
var recognizing = false;
var ignore_onend;
var start_timestamp;
console.log("media" in window);
if (!("webkitSpeechRecognition" in window)) {
  upgrade();
} else {
  speechRecorderButton.style.display = "inline-block";
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = function () {
    speechRecorderButton.classList.add("pulser");
    speechListeningText.classList.add("show");

    recognizing = true;
  };

  recognition.onerror = function (event) {
    if (event.error == "no-speech") {
      ignore_onend = true;
    }
    if (event.error == "audio-capture") {
      ignore_onend = true;
    }
    if (event.error == "not-allowed") {
      if (event.timeStamp - start_timestamp < 100) {
        // showInfo("info_blocked");
        speechRecorderButton.classList.remove("pulser");
      } else {
        // showInfo("info_denied");
        speechRecorderButton.classList.remove("pulser");
      }
      ignore_onend = true;
    }
  };

  recognition.onend = function () {
    recognizing = false;
    if (ignore_onend) {
      return;
    }
    // start_img.src = "/intl/en/chrome/assets/common/images/content/mic.gif";
    if (!final_transcript) {
      showInfo("info_start");
      return;
    }
    showInfo("");
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
      var range = document.createRange();
      // range.selectNode(document.getElementById("final_span"));
      window.getSelection().addRange(range);
    }
    if (create_email) {
      create_email = false;
    }
  };

  recognition.onresult = function (event) {
    var interim_transcript = "";
    if (typeof event.results == "undefined") {
      recognition.onend = null;
      recognition.stop();
      upgrade();
      return;
    }
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
    final_transcript = capitalize(final_transcript);
    console.log("final_transcript", final_transcript);
    descrTextarea.value = final_transcript;

    autoGrow(descrTextarea);

    // final_span.innerHTML = linebreak(final_transcript);
    // interim_span.innerHTML = linebreak(interim_transcript);
    if (final_transcript || interim_transcript) {
      // showButtons("inline-block");
    }
  };
}

function upgrade() {
  speechRecorderButton.parentElement.style.display = "none";
  // showInfo("info_upgrade");
}

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
  return s.replace(two_line, "<p></p>").replace(one_line, "<br>");
}

var first_char = /\S/;
function capitalize(s) {
  return s.replace(first_char, function (m) {
    return m.toUpperCase();
  });
}

function startButton(event) {
  if (recognizing) {
    speechRecorderButton.classList.remove("pulser");
    speechListeningText.classList.remove("show");
    recognition.stop();
    return;
  }

  final_transcript = "";
  recognition.lang = select_dialect.value;
  recognition.start();
  ignore_onend = false;
}

// Lang Changer

let langChangerRadio = document.getElementsByName("lang");
function myfunction(event) {
  console.log("Checked radio with ID = " + event.target.value);
  changeLanguage(event.target.value);
}
langChangerRadio.forEach((input) => {
  input.addEventListener("change", myfunction);
});

const languageTexts = {
  "en-US": {
    cardHeaderHello: "Hello",
    cardHeaderBrand: "Gaia Quicknotes",
    cardHeaderDescription: "Create a note/task/appointment in Gaia in a flash",
    accordionHeader: "Example of commands you can use here:",
    accordionList: [
      { label: "", hasLink: false },
      { label: "", hasLink: true, link: { text: "More...", ref: "http" } },
    ],
    micListeningLabel: "Listening...",
    textInputLabel: "Enter a note, task or appointment:",
    textInputPlaceholder: "For Example: Buy bread until tomorrow 18:00",
    sendBtn: "Send",
    homeLink: "Home",
    gaiaLogin: "Gaia Login",
  },

  "de-DE": {
    cardHeaderHello: "Hallo",
    cardHeaderBrand: "Gaia Quicknotes",
    cardHeaderDescription:
      "Erstelle blitzschnell eine Notiz/Aufgabe/einen Termin in Gaia",
    accordionHeader: "Beispiele für Befehle, die Sie hier verwenden können:",
    accordionList: [
      { label: "", hasLink: false },
      { label: "", hasLink: true, link: { text: "More...", ref: "http" } },
    ],
    micListeningLabel: "Hören...",
    textInputLabel: "Geben Sie eine Notiz, Aufgabe oder einen Termin ein:",
    textInputPlaceholder: "Zum Beispiel: Kaufen Sie Brot bis morgen 18:00 Uhr",
    sendBtn: "Schicken",
    homeLink: "Heim",
    gaiaLogin: "Gaia Anmeldung",
  },
};
const changeElemetLang = (element, text) => {
  element.innerHTML = text;
};
const changeLanguage = (lang = "en-US") => {
  const currentLang = languageTexts[lang];
  //HTML
  document.documentElement.lang = lang;
  // HEADER
  changeElemetLang(
    document.getElementById("cardHeaderHello"),
    currentLang.cardHeaderHello
  );
  changeElemetLang(
    document.getElementById("cardHeaderBrand"),
    currentLang.cardHeaderBrand
  );
  changeElemetLang(
    document.getElementById("cardHeaderDescription"),
    currentLang.cardHeaderDescription
  );

  // ACCORDION
  changeElemetLang(
    document.getElementById("accordionHeader"),
    currentLang.accordionHeader
  );
  const accordionList = document.getElementById("accordionList");

  // MIC
  changeElemetLang(
    document.getElementById("listening"),
    currentLang.micListeningLabel
  );
  // TEXT INPUT
  const textInputLabel = document.getElementById("textInputLabel");
  changeElemetLang(
    document.getElementById("textInputLabel"),
    currentLang.textInputLabel
  );
  const textInput = document.getElementById("descr-textarea");
  textInput.placeholder = currentLang.textInputPlaceholder;

  // BUTTONS
  changeElemetLang(document.getElementById("sendBtn"), currentLang.sendBtn);
  changeElemetLang(document.getElementById("homeLink"), currentLang.homeLink);
  changeElemetLang(document.getElementById("gaiaLogin"), currentLang.gaiaLogin);

  //AJAX STATUS LABELS
};
changeLanguage();
