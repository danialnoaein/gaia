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
              form.elements[i].name,
              encodeURIComponent(form.elements[i].value)
            );
        }
        break;
    }
  }

  // GaiaServer.php:  msgs=[{"to":"121212","prio":"2","payload":"xxZZxxxx"}, ...]
  // ?a=msg.send     &msgs=[{"to":"token","prio":"2","payload":"line%201%0Aline%202"}]
  let q = ["a=msg.send"];
  //q.push("to=" + findGetParameter("token"));
  //let msg= {"to":findGetParameter("token"),"prio":"2","payload": encodeURIComponent(document.querySelector("[name='descr']").value)};
  let msg = {
    to: findGetParameter("token"),
    prio: "2",
    payload: JSON.stringify(data),
  };
  q.push("msgs=" + JSON.stringify(msg));
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
