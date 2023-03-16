const ingredientsDiv = document.getElementById('jum-collapsible-0');

if (ingredientsDiv) {
  const ingredientList = ingredientsDiv.childNodes[0];
  for (i = 0; i < ingredientList.childNodes.length; i++) {
    console.log(ingredientList.childNodes[i].childNodes[0]);
  }
}
