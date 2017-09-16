Vue.component('input-area', {
  template: '<textarea class="question-input pane" rows="4"></textarea>'
});
window.onload = function () {
  var app = new Vue({
    el: '#app'
  });
}