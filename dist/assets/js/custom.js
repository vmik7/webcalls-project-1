function updateInput_old(val){
    document.getElementById('input_old').value=val; 
}

function updateRange_old(val){
    document.getElementById('range_for_old').value=val; 
}

function updateInput_weight(val){
    document.getElementById('input_weight').value=val; 
}

function updateRange_weight(val){
    document.getElementById('range_for_weight').value=val; 
}

function updateInput_growth(val){
    document.getElementById('input_growth').value=val; 
}

function updateRange_growth(val){
    document.getElementById('range_for_growth').value=val; 
}

var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById("navbar").classList.remove("offset_navbar");
    document.getElementById("breadcrumb").classList.remove("offset_navbar");
    document.getElementById("sidebar-wrapper").classList.remove("offset_navbar");
    
  } else {
    document.getElementById("navbar").classList.add("offset_navbar");
    document.getElementById("breadcrumb").classList.add("offset_navbar");
    document.getElementById("sidebar-wrapper").classList.add("offset_navbar");
  }
  prevScrollpos = currentScrollPos;
}

function showListGroup(number) {
  document.getElementById("list-group-referal-"+number).classList.toggle("fade");
  document.getElementById("list-group-referal-"+number).classList.toggle("d-none");
}
