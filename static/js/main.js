var textBox = Vue.component('input-area', {
  template: '',
});
var sendBtn = Vue.component('send-btn', {
  template: '',
});
window.onload = function () {
  var socket = io();
  socket.on('connect', function () {
    socket.emit('my event', {
      data: 'I\'m connected!'
    });
  });
  var app = new Vue({
    el: '#app',
    components: {
      textBox,
      sendBtn
    },
    data: {
      question: ""
    },
    methods: {
      sendQuestion: function(question) {
        socket.emit('message', question);
      }
    }
  });


  
}