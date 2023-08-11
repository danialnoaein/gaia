// Lang Changer
const state = {
  currentLang: "en-US",
  finalTranscript: "",
  recognizing: false,
};
let langChangerRadio = document.getElementsByName("lang");
const textInput = document.getElementById("descr-textarea");
const voiceTextPreview = document.getElementById("voice-text-preview");
// const finalSpan = document.getElementById("final-span");
const interimSpan = document.getElementById("interim-span");
const speechListeningText = document.getElementById("listening");

const langRadioChangeHandle = (event) => {
  state.currentLang = event.target.value;
  changeLanguage(event.target.value);
};
langChangerRadio.forEach((input) => {
  input.addEventListener("change", langRadioChangeHandle);
});

const languageTexts = {
  "en-US": {
    cardHeaderHello: "Hello",
    cardHeaderBrand: "Gaia Quicknotes",
    cardHeaderDescription: "Create a note/task/appointment in Gaia in a flash",
    accordionHeader: "Example of commands you can use here:",
    accordionList: [
      { label: "Buy bread until tomorrow 18:00", hasLink: false },
      { label: "Gray bin reminder Monday 6:00 p.m", hasLink: false },
      {
        label: "14.07. 11:15 meeting. Reminder 2 hours before.",
        hasLink: true,
        link: { text: "More...", ref: "http" },
      },
    ],
    micListeningLabel: "Listening...",
    textInputLabel: "Enter a note, task or appointment:",
    textInputPlaceholder: "For Example: Buy bread until tomorrow 18:00",
    sendBtn: "Send",
    sendBtnSendingState: "Sending...",
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
      { label: "Kaufen Sie Brot bis morgen 18:00 Uhr", hasLink: false },
      { label: "Graue-Tonne-Erinnerung Montag 18:00 Uhr", hasLink: false },
      {
        label: "14.07. 11:15 Uhr Treffen. Erinnerung 2 Stunden vorher.",
        hasLink: true,
        link: { text: "Mehr...", ref: "#" },
      },
    ],
    micListeningLabel: "Hören...",
    textInputLabel: "Geben Sie eine Notiz, Aufgabe oder einen Termin ein:",
    textInputPlaceholder: "Zum Beispiel: Kaufen Sie Brot bis morgen 18:00 Uhr",
    sendBtn: "Schicken",
    sendBtnSendingState: "Senden...",
    homeLink: "Heim",
    gaiaLogin: "Gaia Anmeldung",
  },
};
const changeElemetLang = (element, text) => {
  if (element) {
    element.innerHTML = text;
  }
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
  accordionList.innerHTML = "";
  currentLang.accordionList.forEach((item) => {
    let li = document.createElement("li");
    li.appendChild(document.createTextNode(item.label));
    if (item.hasLink) {
      let link = document.createElement("a");
      link.href = item.link.ref;
      link.innerHTML = item.link.text;
      li.appendChild(link);
    }
    accordionList.appendChild(li);
  });

  // MIC
  changeElemetLang(speechListeningText, currentLang.micListeningLabel);
  // TEXT INPUT
  changeElemetLang(
    document.getElementById("textInputLabel"),
    currentLang.textInputLabel
  );
  textInput.placeholder = currentLang.textInputPlaceholder;

  // BUTTONS
  changeElemetLang(document.getElementById("sendbutton"), currentLang.sendBtn);
  changeElemetLang(document.getElementById("homeLink"), currentLang.homeLink);
  changeElemetLang(document.getElementById("gaiaLogin"), currentLang.gaiaLogin);

  //AJAX STATUS LABELS
};
changeLanguage();

// Lang Changer [END]

const updateUIAfterStartRecognition = () => {
  speechRecorderButton.classList.add("pulser");
  speechListeningText.classList.add("show");
};

const updateUIAfterStopRecognition = () => {
  speechRecorderButton.classList.remove("pulser");
  speechListeningText.classList.remove("show");
  autoGrow(textInput);
};

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

const SUBMIT_BUTTON_READY_TO_SEND = "0";
const SUBMIT_BUTTON_SENDING_DATA = "1";
const changeSubmitButtonState = (state = SUBMIT_BUTTON_READY_TO_SEND) => {
  const btn = document.getElementById("sendbutton");
  if (state === SUBMIT_BUTTON_SENDING_DATA) {
    changeElemetLang(btn, languageTexts[state.currentLang].sendBtnSendingState);
    btn.disabled = true;
  } else {
    changeElemetLang(btn, languageTexts[state.currentLang].sendBtn);
    btn.disabled = false;
  }
};

const SEND_DATA_SUCCEED = "0";
const SEND_DATA_FAILED = "1";
const showSendDataResult = (state = SEND_DATA_SUCCEED, message = "") => {
  const reply = document.getElementById("reply");
  reply.innerHTML = message;
  if (state === SEND_DATA_SUCCEED) {
    reply.style.color = "#0EAF00";
  } else {
    reply.style.color = "#E30000";
  }
};

function sendData() {
  let XHR = new XMLHttpRequest();
  let FD = parseForm(form);

  XHR.addEventListener("load", function (event) {
    changeSubmitButtonState(SUBMIT_BUTTON_READY_TO_SEND);
    var reply = event.target.response;
    if (
      typeof reply != "undefined" &&
      reply !== null &&
      reply != "" &&
      "statusCode" in reply
    ) {
      switch (reply.statusCode) {
        case 0:
          showSendDataResult(
            SEND_DATA_SUCCEED,
            "OK. Die Daten wurden gesendet."
          );
          state.finalTranscript = "";
          labelID.value = "";
          break;
        case 201:
        case 202:
        case 310:
          showSendDataResult(
            SEND_DATA_FAILED,
            "FEHLER:\nfalsche Parameter.\nSind UserId und Text gefüllt ?\nIst die UserId korrekt ?"
          );
          break;
        default:
          showSendDataResult(
            SEND_DATA_FAILED,
            "FEHLER:\n" + JSON.stringify(reply)
          );
          break;
      }
    } else {
      showSendDataResult(
        SEND_DATA_FAILED,
        "FEHLER: unbekannte Antwort vom Server"
      );
    }
  }); //load

  XHR.addEventListener("error", function (event) {
    showSendDataResult(
      SEND_DATA_FAILED,
      "FEHLER: Host: " + host + "\nPOST data:\n" + FD
    );
    changeSubmitButtonState(SUBMIT_BUTTON_READY_TO_SEND);
  }); //error

  if (host.substr(0, 4) != "http") host = "https://" + host;
  XHR.open("POST", host + "/GaiaServer2.php");
  XHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  XHR.responseType = "json";
  console.log(FD);
  XHR.send(FD);
}

var form = document.getElementById("myform");
//var useridID = document.getElementById("to");
var labelID = document.getElementById("label");
parseForm(form); // set defaults from URI
//document.getElementById("label").focus();

form.addEventListener("submit", function (event) {
  event.preventDefault();
  changeSubmitButtonState(SUBMIT_BUTTON_SENDING_DATA);
  sendData();
});

const autoGrow = (element) => {
  element.style.height = 0;
  element.style.height = element.scrollHeight + "px";
};

textInput.style.height = textInput.scrollHeight + "px";
textInput.style.overflowY = "hidden";
textInput.addEventListener(
  "input",
  function () {
    autoGrow(this);
  },
  false
);

// accordion
const acc = document.getElementsByClassName("accordion");
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

const startButton = () => {
  recognition.lang = state.currentLang;
  if (state.recognizing) {
    updateUIAfterStopRecognition();
    recognition.stop();
    state.recognizing = false;
    return;
  }
  recognition.start();
  ignore_onend = false;
};
const speechRecorderButton = document.getElementById("speech-recorder");
speechRecorderButton.addEventListener("click", function () {
  startButton();
});

var ignore_onend;
var start_timestamp;
if (!("webkitSpeechRecognition" in window)) {
  upgrade();
} else {
  speechRecorderButton.style.display = "inline-block";

  window.SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition || null;

  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = function () {
    updateUIAfterStartRecognition();
    state.recognizing = true;
  };

  recognition.onerror = function (event) {
    speechRecorderButton.classList.remove("pulser");
    ignore_onend = true;
    updateUIAfterStopRecognition();
    state.recognizing = false;
  };

  recognition.onresult = (event) => {
    speechListeningText.textContent = "";
    // if (typeof event.results == "undefined") {
    //   recognition.onend = null;
    //   recognition.stop();
    //   upgrade();
    //   return;
    // }

    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        if (state.finalTranscript.length > 0) {
          state.finalTranscript += " ";
        }
        state.finalTranscript += event.results[i][0].transcript;
        speechListeningText.textContent = "Listening...";
        // state.finalTranscript = capitalize(state.finalTranscript);
        textInput.value = state.finalTranscript;
        autoGrow(textInput);
      } else {
        speechListeningText.textContent += event.results[i][0].transcript;
      }
    }
  };
}

function upgrade() {
  speechRecorderButton.parentElement.style.display = "none";
}

var first_char = /\S/;
function capitalize(s) {
  return s.replace(first_char, function (m) {
    return m.toUpperCase();
  });
}
