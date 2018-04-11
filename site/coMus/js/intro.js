var title;


document.getElementById("title-finish").addEventListener("click", function(e) {
  document.getElementById("title-finish").style.display = "none";

  title = document.getElementById("title").value;
  if(title){
    document.getElementById("song-title").innerHTML = title;
  }
  else {
    document.getElementById("song-title").innerHTML = '무제';
  }
  unsetTitleStyle();
  document.getElementById("load").style.display = "block";
  document.getElementById("factor").style.display = "block";
});


function unsetTitleStyle() {
  document.getElementById("title").style.width= '490px';
  document.getElementById("title").style.fontSize = "25px";
  document.getElementById("title").style.margin = "14% auto 0 auto";
  document.getElementById("title-select").style.left = "calc(50% - 245px)";
  document.getElementById("title-select").style.width = "unset";
  document.getElementById("title-select").style.height = "unset";
}
