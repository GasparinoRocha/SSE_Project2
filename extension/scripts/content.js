const ingredientsDiv = document.getElementById('jum-collapsible-0');

if (ingredientsDiv) {
  const ingredientList = ingredientsDiv.childNodes[0];
  console.log("INGREDIENTS:\n");
  for (i = 0; i < ingredientList.childNodes.length; i++) {
    console.log(ingredientList.childNodes[i].childNodes[0]);
  }
}

const breadcrumbTrail = document.getElementsByClassName("breadcrumb-trail").item(0);

if (breadcrumbTrail) {
  const breadcrumbTrailItemList = breadcrumbTrail.childNodes;
  console.log("FOOD GROUPS:\n");
  for (i = 0; i < breadcrumbTrailItemList.length; i++) {
    console.log(breadcrumbTrailItemList.item(i).childNodes.item(0).childNodes.item(0));
  }
}