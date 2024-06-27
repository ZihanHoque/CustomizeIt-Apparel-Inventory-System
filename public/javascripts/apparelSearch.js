var cursor;
var hitlist;
var pageNum = 0;
var pageSize = 3;
var apparelTemplate = {
  apparelName : "",
  code : "",
  lastModified : new Date(),
  items : []
}

function addApparel() {
  // rewrite buildMenu for a blank template with <input type="name">s for name and code
  // disable/reenable the addNewApparel button somewhere
  // rewrite event handlers for colour manipulation to create template item objects
  // rewrite deleteApparel into a container clear
  // add a save button to extract the template with inputted data, create an apparel object with appended item objects created from colour templates

  // i.e.
  // var newItemArray = [{
  //   colour : selectedColour,
  //   sizes : {
  //     XXS : getXXSInput,
  //     XS : getXSInput,
  //     .
  //     .
  //     .
  //   }
  // }, ...]
  // var newApparel = {
  //   name : getNameTextInputField,
  //   code : getCodeTextInputField,
  //   items : newItemArray
  // }
  var templateContainer = document.getElementById("templateContainer");
  var rowContainer = document.createElement("div");
  templateContainer.appendChild(rowContainer);
  rowContainer.classList.add("rowContainer");
  var topRow = document.createElement("div");
  topRow.classList.add("topRow");
  var nameIN = document.createElement("input");
  var codeIN = document.createElement("input");
  nameIN.type = "text";
  codeIN.type = "text";
  codeIN.style = "text-align:right";
  topRow.appendChild(nameIN);
  topRow.appendChild(codeIN);
  rowContainer.appendChild(topRow);
  var column1 = document.createElement("div");
  column1.classList.add("column1");
  var colourSelectPanel = document.createElement("div");
  colourSelectPanel.classList.add("colourSelectPanel");
  var CSlabel = document.createElement("label");
  CSlabel.append("Select Colour: ");
  colourSelectPanel.appendChild(CSlabel);
  var colourSelect = document.createElement("select");
  colourSelectPanel.appendChild(colourSelect);
  column1.appendChild(colourSelectPanel);
  var buttonPanel = document.createElement("div");
  buttonPanel.classList.add("buttonPanel");
  var colourIN = document.createElement("input");
  colourIN.type = "text";
  buttonPanel.appendChild(colourIN);
  var addColour = document.createElement("button");  
  addColour.append("Add New Colour");
  buttonPanel.appendChild(addColour);
  var deleteColour = document.createElement("button");
  deleteColour.append("Delete Selected Colour");
  buttonPanel.appendChild(deleteColour);
  var cancel = document.createElement("button");
  cancel.append("Cancel");
  buttonPanel.appendChild(cancel);
  var saveTemplate = document.createElement("button");
  saveTemplate.append("Create New Apparel");
  buttonPanel.appendChild(saveTemplate);
  column1.appendChild(buttonPanel);
  rowContainer.appendChild(column1);
  var column2 = document.createElement("table");
  column2.classList.add("column2");
  var XXSrow = document.createElement("tr");
  var XXSheader = document.createElement("th");
  XXSheader.append("XXS: ");
  XXSrow.appendChild(XXSheader);
  var XXSstock = document.createElement("td");
  var XXS = document.createElement("input");
  XXS.type = "number";
  XXS.oninput = (e) => {
    changeDetected(e);
  }
  XXSstock.appendChild(XXS);
  XXSrow.appendChild(XXSstock);
  column2.appendChild(XXSrow);

  var XSrow = document.createElement("tr");
  var XSheader = document.createElement("th");
  XSheader.append("XS: ");
  XSrow.appendChild(XSheader);
  var XSstock = document.createElement("td");
  var XS = document.createElement("input");
  XS.type = "number";
  XS.oninput = (e) => {
    changeDetected(e);
  }
  XSstock.appendChild(XS);
  XSrow.appendChild(XSstock);
  column2.appendChild(XSrow);

  var Srow = document.createElement("tr");
  var Sheader = document.createElement("th");
  Sheader.append("S: ");
  Srow.appendChild(Sheader);
  var Sstock = document.createElement("td");
  var S = document.createElement("input");
  S.type = "number";
  S.oninput = (e) => {
    changeDetected(e);
  }
  Sstock.appendChild(S);
  Srow.appendChild(Sstock);
  column2.appendChild(Srow);

  var Mrow = document.createElement("tr");
  var Mheader = document.createElement("th");
  Mheader.append("M: ");
  Mrow.appendChild(Mheader);
  var Mstock = document.createElement("td");
  var M = document.createElement("input");
  M.type = "number";
  M.oninput = (e) => {
    changeDetected(e);
  }
  Mstock.appendChild(M);
  Mrow.appendChild(Mstock);
  column2.appendChild(Mrow);

  var Lrow = document.createElement("tr");
  var Lheader = document.createElement("th");
  Lheader.append("L: ");
  Lrow.appendChild(Lheader);
  var Lstock = document.createElement("td");
  var L = document.createElement("input");
  L.type = "number";
  L.oninput = (e) => {
    changeDetected(e);
  }
  Lstock.appendChild(L);
  Lrow.appendChild(Lstock);
  column2.appendChild(Lrow);

  var XLrow = document.createElement("tr");
  var XLheader = document.createElement("th");
  XLheader.append("XL: ");
  XLrow.appendChild(XLheader);
  var XLstock = document.createElement("td");
  var XL = document.createElement("input");
  XL.type = "number";
  XL.oninput = (e) => {
    changeDetected(e);
  }
  XLstock.appendChild(XL);
  XLrow.appendChild(XLstock);
  column2.appendChild(XLrow);

  var XXLrow = document.createElement("tr");
  var XXLheader = document.createElement("th");
  XXLheader.append("XXL: ");
  XXLrow.appendChild(XXLheader);
  var XXLstock = document.createElement("td");
  var XXL = document.createElement("input");
  XXL.type = "number";
  XXL.oninput = (e) => {
    changeDetected(e);
  }
  XXLstock.appendChild(XXL);
  XXLrow.appendChild(XXLstock);
  column2.appendChild(XXLrow);

  var buttonRow = document.createElement("tr");
  var saveCell = document.createElement("th");
  var saveButton = document.createElement("button");
  saveButton.append("Save changes");
  saveButton.onclick = (e) => {
    apparelTemplate.items.find((item) => item.colour == colourSelect.value).sizes.XXS = (XXS.value != "") ? XXS.value : null;
    apparelTemplate.items.find((item) => item.colour == colourSelect.value).sizes.XS = (XS.value != "") ? XS.value : null;
    apparelTemplate.items.find((item) => item.colour == colourSelect.value).sizes.S = (S.value != "") ? S.value : null;
    apparelTemplate.items.find((item) => item.colour == colourSelect.value).sizes.M = (M.value != "") ? M.value : null;
    apparelTemplate.items.find((item) => item.colour == colourSelect.value).sizes.L = (L.value != "") ? L.value : null;
    apparelTemplate.items.find((item) => item.colour == colourSelect.value).sizes.XL = (XL.value != "") ? XL.value : null;
    apparelTemplate.items.find((item) => item.colour == colourSelect.value).sizes.XXL = (XXL.value != "") ? XXL.value : null;
    saveButton.disabled = true;
    undoButton.disabled = true;
  }
  saveButton.disabled = true;
  saveCell.appendChild(saveButton);
  buttonRow.appendChild(saveCell);
  var undoCell = document.createElement("td");
  var undoButton = document.createElement("button");
  undoButton.append("Undo changes");
  undoButton.onclick = () => {
    try {
      XXS.value = apparelTemplate.items.find((item) => item.colour == colourSelect.value).sizes.XXS;
    } catch (err) {
      XXS.value = 0;
    }
    try {
      XS.value = apparelTemplate.items.find((item) => item.colour == colourSelect.value).sizes.XS;
    } catch (err) {
      XS.value = 0;
    }
    try {
      S.value = apparelTemplate.items.find((item) => item.colour == colourSelect.value).sizes.S;
    } catch (err) {
      S.value = 0;
    }
    try {
      M.value = apparelTemplate.items.find((item) => item.colour == colourSelect.value).sizes.M;
    } catch (err) {
      M.value = 0;
    }
    try {
      L.value = apparelTemplate.items.find((item) => item.colour == colourSelect.value).sizes.L;
    } catch (err) {
      L.value = 0;
    }
    try {
      XL.value = apparelTemplate.items.find((item) => item.colour == colourSelect.value).sizes.XL;
    } catch (err) {
      XL.value = 0;
    }
    try {
      XXL.value = apparelTemplate.items.find((item) => item.colour == colourSelect.value).sizes.XXL;
    } catch (err) {
      XXL.value = 0;
    }
    undoButton.disabled = true;
    saveButton.disabled = true;
  }
  undoButton.disabled = true;
  undoCell.appendChild(undoButton);
  buttonRow.appendChild(undoCell);
  column2.appendChild(buttonRow);
  rowContainer.appendChild(column2);

  XXS.disabled = true;
  XS.disabled = true;
  S.disabled = true;
  M.disabled = true;
  L.disabled = true;
  XL.disabled = true;
  XXL.disabled = true;
  
  colourSelect.onchange = (e) => {
    try {
      XXS.value = apparelTemplate.items.find((item) => item.colour == colourSelect.value).sizes.XXS;
    } catch (err) {
      XXS.value = 0;
    }
    try {
      XS.value = apparelTemplate.items.find((item) => item.colour == colourSelect.value).sizes.XS;
    } catch (err) {
      XS.value = 0;
    }
    try {
      S.value = apparelTemplate.items.find((item) => item.colour == colourSelect.value).sizes.S;
    } catch (err) {
      S.value = 0;
    }
    try {
      M.value = apparelTemplate.items.find((item) => item.colour == colourSelect.value).sizes.M;
    } catch (err) {
      M.value = 0;
    }
    try {
      L.value = apparelTemplate.items.find((item) => item.colour == colourSelect.value).sizes.L;
    } catch (err) {
      L.value = 0;
    }
    try {
      XL.value = apparelTemplate.items.find((item) => item.colour == colourSelect.value).sizes.XL;
    } catch (err) {
      XL.value = 0;
    }
    try {
      XXL.value = apparelTemplate.items.find((item) => item.colour == colourSelect.value).sizes.XXL;
    } catch (err) {
      XXL.value = 0;
    }
  }
  addColour.onclick = (e) => {
    for (var option of colourSelect.children) {
      if (option.value = colourIN.value) {
        alert("Colour already exists");
        return;
      }
    }
    if (XXS.disabled = true) {
      XXS.disabled = false;
      XS.disabled = false;
      S.disabled = false;
      M.disabled = false;
      L.disabled = false;
      XL.disabled = false;
      XXL.disabled = false;
    }
    var newOpt = document.createElement("option");
    newOpt.value = colourIN.value;
    newOpt.append(colourIN.value);
    colourSelect.appendChild(newOpt);
    apparelTemplate.items.push({
      colour : colourIN.value,
      sizes : {
        XXS : null,
        XS : null,
        S : null,
        M : null,
        L : null,
        XL : null,
        XXL : null
      }
    });
    alert(JSON.stringify(apparelTemplate));
    colourIN.value = "";
  }
  deleteColour.onclick = (e) => {
    apparelTemplate.items.splice(apparelTemplate.items.findIndex((item) => item.colour == colourSelect.value), 1);
    for (var option of colourSelect.children) {
      if (option.value == colourSelect.value) {
        colourSelect.removeChild(option);
      }
    }
    if (colourSelect.children.length == 0) {
      XXS.value = 0;
      XXS.disabled = true;
      XS.value = 0;
      XS.disabled = true;
      S.value = 0;
      S.disabled = true;
      M.value = 0;
      M.disabled = true;
      L.value = 0;
      L.disabled = true;
      XL.value = 0;
      XL.disabled = true;
      XXL.value = 0;
      XXL.disabled = true;
    } else {
      try {
        XXS.value = apparelTemplate.items.find((item) => item.colour == colourSelect.value).sizes.XXS;
      } catch (err) {
        XXS.value = 0;
      }
      try {
        XS.value = apparelTemplate.items.find((item) => item.colour == colourSelect.value).sizes.XS;
      } catch (err) {
        XS.value = 0;
      }
      try {
        S.value = apparelTemplate.items.find((item) => item.colour == colourSelect.value).sizes.S;
      } catch (err) {
        S.value = 0;
      }
      try {
        M.value = apparelTemplate.items.find((item) => item.colour == colourSelect.value).sizes.M;
      } catch (err) {
        M.value = 0;
      }
      try {
        L.value = apparelTemplate.items.find((item) => item.colour == colourSelect.value).sizes.L;
      } catch (err) {
        L.value = 0;
      }
      try {
        XL.value = apparelTemplate.items.find((item) => item.colour == colourSelect.value).sizes.XL;
      } catch (err) {
        XL.value = 0;
      }
      try {
        XXL.value = apparelTemplate.items.find((item) => item.colour == colourSelect.value).sizes.XXL;
      } catch (err) {
        XXL.value = 0;
      }
    }
  }
  cancel.onclick = (e) => {
    document.getElementById("templateContainer").replaceChildren();
    apparelTemplate = {
      apparelName : "",
      code : "",
      lastModified : new Date(),
      items : []
    }
  }
  saveTemplate.onclick = (e) => {
    for (var apparel of cursor.apparel) {
      if (apparel.apparelName == nameIN.value || apparel.code == codeIN.value) {
        alert("Apparel already exists");
        return;
      }
    }
    saveButton.click();
    apparelTemplate.apparelName = nameIN.value;
    apparelTemplate.code = codeIN.value;
    apparelTemplate.lastModified = new Date();
    var req = new XMLHttpRequest();
    req.open("post", "/apparel/create");
    req.onload = () => {
      if (req.response != "success") {
        alert(req.response);
      } else {
        apparelTemplate = {
          apparelName : "",
          code : "",
          lastModified : new Date(),
          items : []
        };
        location.reload();
      }
    }
    req.send(JSON.stringify(apparelTemplate));
  }
}

function updateColour(e) {
  var colour = e.target.value;
  var name = e.target.parentNode.parentNode.previousElementSibling.children[0].innerText;
  var sizes = e.target.parentNode.parentNode.nextElementSibling;

  var apparelChoice = hitlist.apparel.find((apparel) => apparel.apparelName == name);
  var itemChoice = apparelChoice.items.find((item) => item.colour == colour);
  try {
    sizes.children[0].children[1].children[0].value = itemChoice.sizes.XXS;
  } catch (err) {
    sizes.children[0].children[1].children[0].value = 0;
  }
  try {
    sizes.children[1].children[1].children[0].value = itemChoice.sizes.XS;
  } catch (err) {
    sizes.children[1].children[1].children[0].value = 0;
  }
  try {
    sizes.children[2].children[1].children[0].value = itemChoice.sizes.S;
  } catch (err) {
    sizes.children[2].children[1].children[0].value = 0;
  }
  try {
    sizes.children[3].children[1].children[0].value = itemChoice.sizes.M;
  } catch (err) {
    sizes.children[3].children[1].children[0].value = 0;
  }
  try {
    sizes.children[4].children[1].children[0].value = itemChoice.sizes.L;
  } catch (err) {
    sizes.children[4].children[1].children[0].value = 0;
  }
  try {
    sizes.children[5].children[1].children[0].value = itemChoice.sizes.XL;
  } catch (err) {
    sizes.children[5].children[1].children[0].value = 0;
  }
  try {
    sizes.children[6].children[1].children[0].value = itemChoice.sizes.XXL;
  } catch (err) {
    sizes.children[6].children[1].children[0].value = 0;
  }
}

function addNewColour(e) {
  // get input from above text box by id
  // path to Name 
  // send an XMLHttpRequest with Name and newColour in a FormData
  // on backend side, update apparel with given Name to have a new item entry with given newColour
  // back on frontend side in the onload, append newColour as an option in the colour selector
  
  var newColour = e.target.previousElementSibling;
  var colourSelect = e.target.parentNode.previousElementSibling.children[1];
  for (var option of colourSelect.children) {
    if (option.value == newColour.value) {
      alert("Colour already exists");
      return;
    }
  }
  var name = e.target.parentNode.parentNode.previousElementSibling.children[0].innerText;
  var table = e.target.parentNode.parentNode.nextElementSibling;
  var form = new FormData();
  form.append("newColour", newColour.value);
  form.append("name", name);
  var req = new XMLHttpRequest();
  req.open("post", "/apparel/addColour");
  req.onload = () => {
    if (req.response != "success") {
      alert(req.response);
    } else {
      location.reload();
    }
  }
  req.send(form);
}

function deleteSelectedColour(e) {
  // path to Name
  // send an XMLHttpRequest with Name and selectedColour in a FormData
  // on backend side, remove item with given selectedColour from an apparel with given Name's items array
  // on frontend, call an empty replaceChild on colour selector to remove the element from the list
  var colourSelect = e.target.parentNode.previousElementSibling.children[1];
  var name = e.target.parentNode.parentNode.previousElementSibling.children[0].innerText;
  var table = e.target.parentNode.parentNode.nextElementSibling;
  var form = new FormData();
  form.append("selectedColour", colourSelect.value);
  form.append("name", name);
  var req = new XMLHttpRequest();
  req.open("post", "/apparel/deleteColour");
  req.onload = () => {
    if (req.response != "success") {
      alert(req.response);
    } else {
      location.reload();
    }
  }
  req.send(form);
}

function deleteApparel(e) {
  var req = new XMLHttpRequest();
  req.open("post", "/apparel/delete");
  req.onload = () => {
    if (req.response != "success") {
      alert(req.response);
    } else {
      location.reload();
    }  
  }
  req.send(e.target.parentNode.parentNode.previousElementSibling.children[0].innerText);
} 
   
function saveStock(e) {
  var form = new FormData();
  var sizeTable = e.target.parentNode.parentNode.parentNode;
  form.append("XXS", sizeTable.children[0].children[1].children[0].value);
  form.append("XS", sizeTable.children[1].children[1].children[0].value);
  form.append("S", sizeTable.children[2].children[1].children[0].value);
  form.append("M", sizeTable.children[3].children[1].children[0].value);
  form.append("L", sizeTable.children[4].children[1].children[0].value);
  form.append("XL", sizeTable.children[5].children[1].children[0].value);
  form.append("XXL", sizeTable.children[6].children[1].children[0].value);
  form.append("name", sizeTable.parentNode.children[0].children[0].innerText);
  form.append("selectedColour", sizeTable.parentNode.children[1].children[0].children[1].value);
  var req = new XMLHttpRequest();
  req.open("post", "/apparel/update");
  req.onload = () => {
    if (req.response != "success") {
      alert(req.response);
    } else {
      location.reload();
    }
  }
  req.send(form);
}

function changeDetected(e) {
  e.target.parentNode.parentNode.parentNode.children[7].children[0].children[0].disabled = false;
  e.target.parentNode.parentNode.parentNode.children[7].children[1].children[0].disabled = false;
}

function buildMenu(page) {
  var pageDisplay = document.getElementById("pageDisplay");
  pageDisplay.innerHTML = "Showing "+((pageNum+1 < hitlist.apparel.length) ? pageNum+1 : hitlist.apparel.length)+" - "+((pageNum + pageSize < hitlist.apparel.length) ? pageNum + pageSize : hitlist.apparel.length)+" out of "+hitlist.apparel.length+" items.";

  var container = document.getElementById("apparelContainer");
  container.replaceChildren();
  for (var apparel of page) {
    var rowContainer = document.createElement("div");
    rowContainer.classList.add("rowContainer");
    var topRow = document.createElement("div");
    topRow.classList.add("topRow");
    var nameSpan = document.createElement("span");
    var codeSpan = document.createElement("span");
    nameSpan.append(apparel.apparelName);
    codeSpan.append(apparel.code);
    topRow.appendChild(nameSpan);
    topRow.appendChild(codeSpan);
    rowContainer.appendChild(topRow);
    var column1 = document.createElement("div");
    column1.classList.add("column1");
    var colourSelectPanel = document.createElement("div");
    colourSelectPanel.classList.add("colourSelectPanel");
    var CSlabel = document.createElement("label");
    CSlabel.append("Select Colour: ");
    colourSelectPanel.appendChild(CSlabel);
    var colourSelect = document.createElement("select");
    for (var item of apparel.items) {
      var option = document.createElement("option");
      option.value = item.colour;
      option.append(item.colour);
      colourSelect.appendChild(option);
    }
    colourSelect.onchange = (e) => {
      updateColour(e);
    }
    colourSelectPanel.appendChild(colourSelect);
    column1.appendChild(colourSelectPanel);
    var buttonPanel = document.createElement("div");
    buttonPanel.classList.add("buttonPanel");
    var colourIN = document.createElement("input");
    colourIN.type = "text";
    buttonPanel.appendChild(colourIN);
    var addColour = document.createElement("button");
    addColour.onclick = (e) => {
      addNewColour(e);
    }
    addColour.append("Add New Colour");
    buttonPanel.appendChild(addColour);
    var deleteColour = document.createElement("button");
    deleteColour.onclick = (e) => {
      deleteSelectedColour(e);
    }
    deleteColour.append("Delete Selected Colour");
    buttonPanel.appendChild(deleteColour);
    var deleteApp = document.createElement("button");
    deleteApp.onclick = (e) => {
      deleteApparel(e);
    }
    deleteApp.append("Delete Apparel");
    buttonPanel.appendChild(deleteApp);
    column1.appendChild(buttonPanel);
    rowContainer.appendChild(column1);
    var column2 = document.createElement("table");
    column2.classList.add("column2");
    var XXSrow = document.createElement("tr");
    var XXSheader = document.createElement("th");
    XXSheader.append("XXS: ");
    XXSrow.appendChild(XXSheader);
    var XXSstock = document.createElement("td");
    var XXS = document.createElement("input");
    XXS.type = "number";
    try {
      XXS.value = apparel.items[0].sizes.XXS;
    } catch (err) {
      XXS.value = 0;
    }
    XXS.oninput = (e) => {
      changeDetected(e);
    }
    XXSstock.appendChild(XXS);
    XXSrow.appendChild(XXSstock);
    column2.appendChild(XXSrow);

    var XSrow = document.createElement("tr");
    var XSheader = document.createElement("th");
    XSheader.append("XS: ");
    XSrow.appendChild(XSheader);
    var XSstock = document.createElement("td");
    var XS = document.createElement("input");
    XS.type = "number";
    try {
      XS.value = apparel.items[0].sizes.XS;
    } catch (err) {
      XS.value = 0;
    }
    XS.oninput = (e) => {
      changeDetected(e);
    }
    XSstock.appendChild(XS);
    XSrow.appendChild(XSstock);
    column2.appendChild(XSrow);
    
    var Srow = document.createElement("tr");
    var Sheader = document.createElement("th");
    Sheader.append("S: ");
    Srow.appendChild(Sheader);
    var Sstock = document.createElement("td");
    var S = document.createElement("input");
    S.type = "number";
    try {
      S.value = apparel.items[0].sizes.S;
    } catch (err) {
      S.value = 0;
    }
    S.oninput = (e) => {
      changeDetected(e);
    }
    Sstock.appendChild(S);
    Srow.appendChild(Sstock);
    column2.appendChild(Srow);
    
    var Mrow = document.createElement("tr");
    var Mheader = document.createElement("th");
    Mheader.append("M: ");
    Mrow.appendChild(Mheader);
    var Mstock = document.createElement("td");
    var M = document.createElement("input");
    M.type = "number";
    try {
      M.value = apparel.items[0].sizes.M;
    } catch (err) {
      M.value = 0;
    }
    M.oninput = (e) => {
      changeDetected(e);
    }
    Mstock.appendChild(M);
    Mrow.appendChild(Mstock);
    column2.appendChild(Mrow);
    
    var Lrow = document.createElement("tr");
    var Lheader = document.createElement("th");
    Lheader.append("L: ");
    Lrow.appendChild(Lheader);
    var Lstock = document.createElement("td");
    var L = document.createElement("input");
    L.type = "number";
    try {
      L.value = apparel.items[0].sizes.L;
    } catch (err) {
      L.value = 0;
    }
    L.oninput = (e) => {
      changeDetected(e);
    }
    Lstock.appendChild(L);
    Lrow.appendChild(Lstock);
    column2.appendChild(Lrow);
    
    var XLrow = document.createElement("tr");
    var XLheader = document.createElement("th");
    XLheader.append("XL: ");
    XLrow.appendChild(XLheader);
    var XLstock = document.createElement("td");
    var XL = document.createElement("input");
    XL.type = "number";
    try {
      XL.value = apparel.items[0].sizes.XL;
    } catch (err) {
      XL.value = 0;
    }
    XL.oninput = (e) => {
      changeDetected(e);
    }
    XLstock.appendChild(XL);
    XLrow.appendChild(XLstock);
    column2.appendChild(XLrow);
    
    var XXLrow = document.createElement("tr");
    var XXLheader = document.createElement("th");
    XXLheader.append("XXL: ");
    XXLrow.appendChild(XXLheader);
    var XXLstock = document.createElement("td");
    var XXL = document.createElement("input");
    XXL.type = "number";
    try {
      XXL.value = apparel.items[0].sizes.XXL;
    } catch (err) {
      XXL.value = 0;
    }
    XXL.oninput = (e) => {
      changeDetected(e);
    }
    XXLstock.appendChild(XXL);
    XXLrow.appendChild(XXLstock);
    column2.appendChild(XXLrow);

    var buttonRow = document.createElement("tr");
    var saveCell = document.createElement("th");
    var saveButton = document.createElement("button");
    saveButton.append("Save changes");
    saveButton.onclick = (e) => {
      saveStock(e);
    }
    saveButton.disabled = true;
    saveCell.appendChild(saveButton);
    buttonRow.appendChild(saveCell);
    var undoCell = document.createElement("td");
    var undoButton = document.createElement("button");
    undoButton.append("Undo changes");
    undoButton.onclick = () => {
      buildMenu(hitlist.apparel.slice(pageNum, pageNum + pageSize));
      undoButton.disabled = true;
      saveButton.disabled = true;
    }
    undoButton.disabled = true;
    undoCell.appendChild(undoButton);
    buttonRow.appendChild(undoCell);
    column2.appendChild(buttonRow);

    if (!colourSelect.value) {
      XXS.disabled = true;
      XS.disabled = true;
      S.disabled = true;
      M.disabled = true;
      L.disabled = true;
      XL.disabled = true;
      XXL.disabled = true;
    }
    
    rowContainer.appendChild(column2);
    container.appendChild(rowContainer);
  }
}

function populateContainers() {
  var req = new XMLHttpRequest();
  req.open("post", "/loadCursor");
  req.responseType = "json";
  req.onload = () => {
    protected = req.response;
    cursor = req.response;
    hitlist = structuredClone(cursor);
    if (hitlist.apparel) {
      buildMenu(hitlist.apparel.slice(pageNum, pageNum + pageSize));
    }
    if (hitlist.apparel.length < pageSize) {
      document.getElementById("previous").disabled = true;
      document.getElementById("next").disabled = true;
    }
  }
  req.send();
}

function nextPage() { console.log("nextPage()");
  pageNum += pageSize;
  buildMenu(hitlist.apparel.slice(pageNum, pageNum + pageSize));
}

function previousPage() { console.log("previousPage()");
  pageNum -= pageSize;
  buildMenu(hitlist.apparel.slice(pageNum, pageNum + pageSize));
}

function searchApparel() { 
  if (document.getElementById("searchBar").value) {
    var query = new RegExp(document.getElementById("searchBar").value, "i");
    hitlist.apparel = [];
    for (var apparel of cursor.apparel) {
      if (query.test(apparel.apparelName) || query.test(apparel.code)) {
        hitlist.apparel.push(apparel);
      } 
    }
  } else {
    hitlist = structuredClone(cursor);
  }
  if (hitlist.apparel) {
    buildMenu(hitlist.apparel.slice(pageNum, pageNum + pageSize));
  }
}