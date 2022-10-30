console.log("uslo");
/*if (document.getElementById("adm").innerHTML == '"admin@mailinator.com"') {
  console.log("provjera");
  document.getElementById("test").style.display = "none";
} else {
  console.log("else");
}*/

if (document.getElementById("adm").innerHTML == '"admin@mailinator.com"') {
  console.log("provjera");
} else if (
  document.getElementById("adm").innerHTML == '"user@mailinator.com"'
) {
  console.log("user je tu");
} else {
  console.log("else");
  document.getElementById("comment-section").style.display = "none";
}
