function addLocation() {
  var req = new XMLHttpRequest();
  req.open("post", "/addLocation");
  req.onload = () => {
    if (req.response != "success") {
      alert(req.response);
    } else {
      location.reload();
    }
  }
  req.send(document.getElementById("newLocation").value);
}

function deleteLocation(e) {
  var req = new XMLHttpRequest();
  req.open("post", "/deleteLocation");
  req.onload = () => {
    if (req.response != "success") {
      alert(req.response);
    } else {
      location.reload();
    }
  }
  req.send(e.target.parentNode.children[0].innerText);
}

function selectLocation(e) {
  var req = new XMLHttpRequest();
  req.open("post", "/selectLocation");
  req.onload = () => {
    if (req.response != "success") {
      alert(req.response);
    } else {
      var params = new URLSearchParams({location : e.target.innerText});
      location = "/apparelSearch?"+params.toString();
    }
  }
  req.send(e.target.innerText);
}