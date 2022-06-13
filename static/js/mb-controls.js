
// mini controls
function n() {
  var e = document.documentElement;
  e.classList.toggle("notfullscreen"),
  e.classList.toggle("fullscreen")
}
function o() {
  var e = document.documentElement;
  e.classList.toggle("tiny"),
  e.classList.remove("fullscreen"),
  e.classList.add("notfullscreen")
}

document.querySelector(".toggle-full").addEventListener("click", n)
document.querySelector(".toggle-tiny").addEventListener("click", o)