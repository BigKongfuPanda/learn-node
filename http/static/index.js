
window.onload = function() {
  let $btn = document.getElementById('btn');

  $btn.addEventListener('click', function() {
    console.log(this);
    this.style.backgroundColor = 'red';
  });
}
