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
  s = s.toLowerCase();
  const forbiddenWords = ["rode", "saus", "ster", "groen", "water", "voor", "alle", "droog"]
  return ((s) && (s.length > 3) && (isNaN(s)) && !forbiddenWords.includes(s)) 
}

function createPopup(name, carbonEmmission){
  a = document.createElement("DIV");
  // const itemCategory = breadcrumbTrailItemList.item(1).childNodes.item(0).textContent.replace(/\s/g, '');
 // a.appendChild(document.createTextNode("Food Group: \n" + name +"\n\n"));

  b = document.createElement("DIV");
  formatPopup(a,b,carbonEmmission);

  // Add overlaying item
  
  a.appendChild(b)
  document.body.appendChild(a);
  document.body.style = "white-space: pre;"
}

function formatPopup(popup, overlay, carbonEmmission){
  const img = document.createElement("img");
  img.src = chrome.runtime.getURL("./images/Label1.png");
  popup.appendChild(img);
  img.style.height = "99%";

  popup.style.height = "20%";
  popup.style.position = "absolute";
  popup.style.top = "600px";
  popup.style.right = "150px";
  popup.style.zIndex = 9999999;
  popup.style.font = "italic bold 16px arial,serif";


  overlay.appendChild(document.createTextNode("\n"+carbonEmmission+ "g")) 

  overlay.style.backgroundColor = "lightblue";
  overlay.style.font = "italic bold 12px arial,serif"
  overlay.style.zIndex = 9999999;
  overlay.style.position = "absolute";
  overlay.style.width = "40px";
  overlay.style.height = "40px";
  overlay.style.borderRadius = "100px";
  overlay.style.borderStyle = "solid"
  overlay.style.textAlign = "center";
  if (carbonEmmission < 200) {
    overlay.style.right = "145px";
    overlay.style.top = "72px";
  } else if (carbonEmmission < 600) {
    overlay.style.right = "125px";
    overlay.style.top = "32px";
  } else if (carbonEmmission < 800) {
    overlay.style.right = "75px";
    overlay.style.top = "15px";
  } else if (carbonEmmission < 1200) {
    overlay.style.right = "25px";
    overlay.style.top = "30px";
  } else {
    overlay.style.right = "10px";
    overlay.style.top = "72px";
  }
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
        if (data[i].name.toLowerCase().includes(itemName.toLowerCase())) {
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
