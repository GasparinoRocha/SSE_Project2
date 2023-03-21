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


