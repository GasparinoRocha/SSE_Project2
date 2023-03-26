// Print ingredient list to console
const ingredientsDiv = document.getElementById('jum-collapsible-0');

if (ingredientsDiv) {
  const ingredientList = ingredientsDiv.childNodes[0];
  console.log("INGREDIENTS:\n");
  for (i = 0; i < ingredientList.childNodes.length; i++) {
    console.log(ingredientList.childNodes[i].childNodes[0]);
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
  return ((s) && (s != "en") && (isNaN(s)))
}

function createPopup(name, carbonEmmission){
  a = document.createElement("DIV");
  // const itemCategory = breadcrumbTrailItemList.item(1).childNodes.item(0).textContent.replace(/\s/g, '');
  a.appendChild(document.createTextNode("Food Group: \n" + name +"\n\n"));

  // Simple switch statement to check for food groups
  a.appendChild(document.createTextNode("Total CO2: " + carbonEmmission)) 
  // switch(itemCategory) {
  //   case 'Chocolade':
  //     a.appendChild(document.createTextNode("3.97"))
  //     break;
  //   default:
  //     console.log(itemCategory)
  //     break;
  // }

  formatPopup(a);

  document.body.appendChild(a);
  document.body.style = "white-space: pre;"
}

function formatPopup(popup){
  popup.style.width = "15%";
  popup.style.height = "10%";
  popup.style.position = "absolute";
  popup.style.top = "10px";
  popup.style.left = "10px";
  popup.style.backgroundColor = "lightblue";
  popup.style.zIndex = 9999999;
  popup.style.font = "italic bold 16px arial,serif";
}

function showC02Information(itemNames){
  fetch(chrome.runtime.getURL('../data/database_nl.csv'))
      .then((response) => response.text())
      .then((text) => findCarbonInfo(csvToArray(text, ";"), itemNames))
      .then((data) => createPopup(data.name, data.carbon));
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

function findCarbonInfo(data, itemNames) { 
  let ret;
  console.log("Looking for group: " + itemNames);
  for (var itemTypeIndex = itemNames.length - 1; itemTypeIndex >= 0; itemTypeIndex--){
    for (var i in data) {
      // console.log("Product " + data[i].name + " has " + data[i].carbon + "kg of CO2 equivalent");
      for(const itemName of itemNames[itemTypeIndex]) {
        if (data[i].name.includes(itemName)) {
          console.log("WOOOOO Found it! " + itemName +  " within: " + data[i].name);
          if (!ret) ret = {
            'name' : data[i].name, 
            'carbon' : data[i].carbon
          };
        }
      }
    }
  }
  if (ret) return ret;
  return {
    'name' : "food group not found", 
    'carbon' : 0
  };
}