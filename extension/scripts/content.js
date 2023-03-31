// Print ingredient list to console
const ingredientsDiv = document.getElementById('jum-collapsible-0');

if (ingredientsDiv) {
  const ingredientList = ingredientsDiv.childNodes[0];
  console.log("INGREDIENTS:\n");
  for (i = 0; i < ingredientList.childNodes.length; i++) {
    console.log(ingredientList.childNodes[i].childNodes[0]);
  }
}
addItemEvaluator()
function addItemEvaluator() {
  let dataDiv = document.createElement("DIV");

  formatPopup(dataDiv, "500px");
  appendRandomPageFunction(dataDiv);
  appendRandomItemFunction(dataDiv);
  document.body.appendChild(dataDiv);

  function goToRandomItem() {
    const itemOptions = document.getElementsByClassName("image-container");
    const itemOption = itemOptions.item(getRandomInt(0, itemOptions.length));
    if (itemOption) {
      const randomItem = itemOption.childNodes[0];
      console.log(randomItem);
      console.log("Link -> " + randomItem.href);
      window.location.href = randomItem.href;
    } else {
      console.log("Error Can not find.")
    }
  }

  function goToRandomPage() {
    let newPage = getRandomInt(0, 778) * 24;
    window.location.href = "https://www.jumbo.com/producten/?offSet=" + newPage;
  }

  function appendRandomItemFunction(parentDiv) {
    var x = document.createElement("BUTTON");
    var t = document.createTextNode("Random Item");
    x.appendChild(t);
    x.addEventListener("click", goToRandomItem);
    parentDiv.appendChild(x);
  }

  function appendRandomPageFunction(parentDiv) {
    var x = document.createElement("BUTTON");
    var t = document.createTextNode("Random Page");
    x.appendChild(t);
    x.addEventListener("click", goToRandomPage);
    parentDiv.appendChild(x);
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min)
  }
}
// Create div item to display label

const breadcrumbTrail = document.getElementsByClassName("breadcrumb-trail").item(0);
 
if (breadcrumbTrail) {
  const breadcrumbTrailItemList = breadcrumbTrail.childNodes;
  // Print food groups to console
  console.log("FOOD GROUPS:\n");
  let itemNames = []
  for (i = 0; i < breadcrumbTrailItemList.length; i++) {
    console.log(breadcrumbTrailItemList.item(i).childNodes.item(0).textContent);
    itemNames[i] = stringToArray(breadcrumbTrailItemList.item(i).childNodes.item(0).textContent);
  }
  console.log(itemNames);
  showC02Information(itemNames);
}

function stringToArray(string){
  return string.split(/,?\s+/).filter(sanitizeArray);
}

function sanitizeArray(s){
  s = s.toLowerCase();
  const forbiddenWords = ["rode", "saus", "ster", "groen", "water", "voor", "alle", "droog"]
  return ((s) && (s.length > 3) && (isNaN(s)) && !forbiddenWords.includes(s)) 
}
// && (s != "las") && (s != "met")

function createPopup(name, carbonEmmission, info){
  a = document.createElement("DIV");
  // const itemCategory = breadcrumbTrailItemList.item(1).childNodes.item(0).textContent.replace(/\s/g, '');
  a.appendChild(document.createTextNode("Food Group: \n" + name +"\n\n"));

  // Simple switch statement to check for food groups
  a.appendChild(document.createTextNode("Total CO2: " + carbonEmmission +"\n")) 

  formatPopup(a, "10px");

  appendReview(a, "correct", info);
  appendReview(a, "incorrect info", info);
  appendReview(a, "missing in database", info);
  appendReview(a, "not found in database", info);

  document.body.appendChild(a);
  document.body.style = "white-space: pre;"
}

function formatPopup(popup, pos){
  popup.style.width = "15%";
  popup.style.height = "10%";
  popup.style.position = "absolute";
  popup.style.top = "10px";
  popup.style.left = pos;
  popup.style.backgroundColor = "lightblue";
  popup.style.zIndex = 9999999;
  popup.style.font = "italic bold 16px arial,serif";
}


function appendReview(parentDiv, result, info) {
  let x = document.createElement("BUTTON");
  let t = document.createTextNode(result);
  x.appendChild(t);
  x.addEventListener("click", function () {navigator.clipboard.writeText(info.replaceAll("\n", " ").replaceAll(/\s+/g, " ") + result + "\n");} );
  parentDiv.appendChild(x);
}

function showC02Information(itemNames){
  fetch(chrome.runtime.getURL('../data/database_nl.csv'))
      .then((response) => response.text())
      .then((text) => findCarbonInfo(csvToArray(text, ";"), itemNames))
      .then((data) => createPopup(data.name, data.carbon, data.info));
}

function csvToArray(str, delimiter = ",") {
  // slice from start of text to the first \n index
  // use split to create an array from string by delimiter
  const headers = str.slice(0, str.indexOf("\n")).split(delimiter);

  // slice from \n index + 1 to the end of the text
  // use split to create an array of each csv value row
  const rows = str.slice(str.indexOf("\n") + 1).split("\n");

  // Map the rows
  // split values from each row into an array
  // use headers.reduce to create an object
  // object properties derived from headers:values
  // the object passed as an element of the array
  const arr = rows.map(function (row) {
    const values = row.split(delimiter);
    const el = headers.reduce(function (object, header, index) {
      object[header] = values[index];
      return object;
    }, {});
    return el;
  });

  // return the array
  return arr;
}

function getItemInfo(databaseName){
  const breadcrumbTrailItemList = document.getElementsByClassName("breadcrumb-trail").item(0).childNodes;
  let retString = window.location.href + ", " + databaseName.replaceAll(",", "/") + ", ";
  for (i = 0; i < breadcrumbTrailItemList.length; i++) {
    retString += breadcrumbTrailItemList.item(i).childNodes.item(0).textContent + "/";
  }
  return retString + ", ";
}

function findCarbonInfo(data, itemNames) { 
  let ret;
  console.log("Looking for group: " + itemNames);
  for (var itemTypeIndex = itemNames.length - 1; itemTypeIndex >= 0; itemTypeIndex--){
    for (var i in data) {
      // console.log("Product " + data[i].name + " has " + data[i].carbon + "kg of CO2 equivalent");
      for(const itemName of itemNames[itemTypeIndex]) {
        if (data[i].name.toLowerCase().includes(itemName.toLowerCase())) {
        // if (data[i].name.includes(itemName)) {
          console.log("WOOOOO Found it! '" + itemName +  "' within: " + data[i].name);
          if (!ret) ret = {
            'name' : data[i].name, 
            'carbon' : data[i].carbon,
            'info' : getItemInfo(data[i].name)
          };
        }
      }
    }
  }
  if (ret) return ret;
  return {
    'name' : "food group not found", 
    'carbon' : 0,
    'info' : getItemInfo("not found")
  };
}