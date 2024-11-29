let slideIndex = 0;
carousel();

function carousel() {
  let x = $("#slideshow").children();
  for (let i = 0; i < x.length; i++) {
    x[i].style.display = "none"; 
  }
  slideIndex++;
  if (slideIndex > x.length) {slideIndex = 1} 
  x[slideIndex-1].style.display = "block"; 
  setTimeout(carousel, 4000);
}
