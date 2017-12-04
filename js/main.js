var n = [];
var j = [];
var lastMessage = "";
var numMessages = -1;

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

  function keyToChar(e){
    var keynum;

    if(window.event) { // IE                    
      keynum = e.keyCode;
    } else if(e.which){ // Netscape/Firefox/Opera                   
      keynum = e.which;
    }

    return String.fromCharCode(keynum);
  }

window.onload = function () {
	var canvas = document.getElementById("stats");
	canvas.width = window.innerWidth;
	canvas.height = 2*window.innerHeight/3;
  if (document.cookie.indexOf("spam_uid") == -1) {
    firebase.database().ref("uid").transaction(function (value) {
      value++;
      document.cookie = "spam_uid=" + value;
      uid = value;
      return value;
    });
    for (var i = 0; i < 65; i++) {
      n[i] = 0;
    }
  } else {
    uid = getCookie("spam_uid");
    firebase.database().ref("users/" + getCookie("spam_uid") + "/data").once('value').then(function (snapshot) {
	    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 *";
      n = snapshot.val();
      var canvas = document.getElementById("stats");
    	var ctx = canvas.getContext("2d");
    	ctx.fillStyle = "#000";
    	ctx.font = '20px "Lucida Console", Monaco, monospace';
    	var increment = ((canvas.height-20) / Math.max(...n));
    	ctx.clearRect(0, 0, canvas.width, canvas.height);
    	for (var i = 0; i < n.length; i++) {
     	 ctx.fillRect(i * canvas.width / n.length, (canvas.height - 25) - increment * n[i], canvas.width / n.length, increment * n[i]);
   	   ctx.fillText(string.substr(i,1), i * canvas.width / n.length, canvas.height);
  	  }
    });
  }
  document.getElementById("a").addEventListener("input", function (event) {
  	document.getElementById("a").value = document.getElementById("a").value.substr(0,100);

    if (document.getElementById("a").value.length < 100)
    {
    	j = [];
    	var string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 *";
    	var count = 0;
    	var a = document.getElementById("a").value + keyToChar(event);
    	for (var i = 0; i < 63; i++) {
        var re = new RegExp("[^" + string.substr(i, 1) + "]", "g");
        j[i] = n[i]+a.replace(re, "").length;
        count += a.replace(re, "").length;
      }
      j[63] = n[63] + (a.length -1) - count;
		var canvas = document.getElementById("stats");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000";
    ctx.font = '20px "Lucida Console", Monaco, monospace';
    var increment = ((canvas.height-20) / Math.max(...j));
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < j.length; i++) {
      ctx.fillRect(i * canvas.width / j.length, (canvas.height - 25) - increment * j[i], canvas.width / j.length, increment * j[i]);
      ctx.fillText(string.substr(i,1), i * canvas.width / j.length, canvas.height);
    }
    }
  });
  document.getElementById("a").addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      submitMessage();
    }
});
}

function submitMessage() {
  var a = document.getElementById('a').value;
  if (a != lastMessage) {
    lastMessage = a;
    if (a.length > 10 && a.length <= 100) {
      firebase.database().ref('spam').push(a);
      document.getElementById('a').value = '';
      var string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 *";
      var stats = document.getElementById("stats");
      stats.innerHTML = "<tr><th>Character</th><th>Quantity</th></tr>";
      var count = 0;
      for (var i = 0; i < 63; i++) {
        var re = new RegExp("[^" + string.substr(i, 1) + "]", "g");
        n[i] += a.replace(re, "").length;
        count += a.replace(re, "").length;
      }
      n[63] += a.length - count;
      numMessages++;
      if (numMessages % 10 == 0) {
        firebase.database().ref("users/" + getCookie("spam_uid") + "/data").set(n);
      }
	    document.getElementById('total').value = "Total characters: "+ n.reduce(add, 0);
    var canvas = document.getElementById("stats");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000";
    ctx.font = '20px "Lucida Console", Monaco, monospace';
    var increment = ((canvas.height-20) / Math.max(...n));
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < n.length; i++) {
      ctx.fillRect(i * canvas.width / n.length, (canvas.height - 25) - increment * n[i], canvas.width / n.length, increment * n[i]);
      ctx.fillText(string.substr(i,1), i * canvas.width / n.length, canvas.height);
    }
  }
}
}

function add(a, b) {
  return a + b;
}

window.onbeforeunload = function () {
  firebase.database().ref("users/" + getCookie("spam_uid") + "/data").set(n);
}
