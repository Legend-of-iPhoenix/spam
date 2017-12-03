var n = [];
var lastMessage = "";

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

window.onload = function() {
  if (document.cookie.indexOf("spam_uid") == -1)
  {
    firebase.database().ref("uid").transaction(function(value) {
    	value++;
      document.cookie = "spam_uid=" + value;
      uid = value;
      return value;
    });
    for (var i = 0; i < 64; i++)
		{
			n[i] = 0;
		}
  }
  else
  {
  	uid = getCookie("spam_uid");
  	firebase.database().ref("users/"+getCookie("spam_uid")+"/data").once('value').then(function(snapshot) {
  		n = snapshot.val();
  	});
  }
  document.getElementById("a").addEventListener("keydown", function(event) {
  //event.preventDefault();
  if (event.keyCode === 13) {
  	submitMessage();
  }
  if (document.getElementById("a").value.length >= 100 && event.keyCode != 8) {
  	event.preventDefault();
  }
  else
  {
  	return false;
  }
});
}

function submitMessage() {
  var a = document.getElementById('a').value;
  if (a != lastMessage)
  {
  	lastMessage = a;
  if (a.length > 10 && a.length <= 100) {
    firebase.database().ref('spam').push(a);
    document.getElementById('a').value='';
    var string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ";
    var stats = document.getElementById("stats");
    stats.innerHTML = "<tr><th>Character</th><th>Quantity</th></tr>";
    var count = 0;
    for (var i = 0; i < 63; i++)
    {
    	var node = document.createElement("tr");
    	var re = new RegExp("[^"+string.substr(i,1)+"]","g");
    	console.log(re);
    	console.log(a.replace(re, ""));
    	n[i] += a.replace(re, "").length;
    	count += a.replace(re, "").length;
    	var subNode1 = document.createElement("td");
    	subNode1.innerText = "'"+string.substr(i,1)+"'";
    	node.appendChild(subNode1);
    	var subNode2 = document.createElement("td");
    	subNode2.innerText = n[i];
    	node.appendChild(subNode2);
    	stats.appendChild(node);
    }
    n[64] = a.length - count;
    	var node = document.createElement("tr");
      var subNode1 = document.createElement("td");
    	subNode1.innerText = "Other";
    	node.appendChild(subNode1);
    	var subNode2 = document.createElement("td");
    	subNode2.innerText = n[64];
    	node.appendChild(subNode2);
    	stats.appendChild(node);
    	node = document.createElement("tr");
      subNode1 = document.createElement("td");
    	subNode1.innerHTML = "<strong>Total</strong>";
    	node.appendChild(subNode1);
    	subNode2 = document.createElement("td");
    	subNode2.innerText = n.reduce(add, 0);
    	node.appendChild(subNode2);
    	stats.appendChild(node);
  }
}
}

function add(a, b) {
    return a + b;
}

window.onbeforeunload = function() {
	firebase.database().ref("users/"+getCookie("spam_uid")+"/data").set(n);
}
