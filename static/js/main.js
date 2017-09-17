var feedEntry = Vue.component('feed-entry', {
  template: `<div class="feed-entry">
  <div class="upvote-count">{{ counter }}</div>
<button class="upvote-btn" v-on:click="thumbsUp" :disabled=disabled><i class="fa fa-thumbs-o-up" aria-hidden="true"></i></button>
  <div class="message">{{ message }}</div>
  </div>`,
  data: 
    function() {
    return {
      counter: 0,
      message: "",
      disabled: false, 
    }
  },
  methods: {
    thumbsUp: function(message) {
      this.counter += 1;
      this.disabled = true;
    }
  },
  computed: {
  }
});

window.onload = function () {
  var socket = io();

  var app = new Vue({
    el: '#app',
    components: {
      feedEntry
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
  socket.on('connect', function () {
    socket.emit('my event', {
      data: 'I\'m connected!'
    });
  });
  socket.on('message', function (msg) {

  });

  
}