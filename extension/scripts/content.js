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
  a = document.createElement("DIV");
  const breadcrumbTrailItemList = breadcrumbTrail.childNodes;
  // Print food groups to console
  console.log("FOOD GROUPS:\n");
  for (i = 0; i < breadcrumbTrailItemList.length; i++) {
    console.log(breadcrumbTrailItemList.item(i).childNodes.item(0).textContent);
  }
  const itemCategory = breadcrumbTrailItemList.item(1).childNodes.item(0).textContent.replace(/\s/g, '');
  a.appendChild(document.createTextNode("Food Group: \n" + itemCategory+"\n\n"));

  // Simple switch statement to check for food groups
  a.appendChild(document.createTextNode("Total CO2:")) 
  switch(itemCategory) {
    case 'Chocolade':
      a.appendChild(document.createTextNode("3.97"))
      break;
    default:
      console.log(itemCategory)
      break;
  }

  a.style.width = "15%";
  a.style.height = "10%";
  a.style.position = "absolute";
  a.style.top = "10px";
  a.style.left = "10px";
  a.style.backgroundColor = "lightblue";
  a.style.zIndex = 9999999;
  a.style.font = "italic bold 16px arial,serif";

  document.body.appendChild(a);
  document.body.style = "white-space: pre;"
}

const url = chrome.runtime.getURL('../data/database.csv');

fetch(url)
    .then((response) => response.text())
    .then((text) => doTheThing(text));

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

function doTheThing(text) {
  var data = csvToArray(text, ";");
  for (var i = 0; i < data.length; i++) {
    console.log("Product " + data[i].Name + " has " + data[i].CO2 + "kg of CO2 equivalent");
  }
}