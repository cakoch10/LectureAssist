var feedEntry = Vue.component('feed-entry', {
  template: `<div class="feed-entry">
  <div class="upvote-count">{{ counter }}</div>
<button class="upvote-btn" v-on:click="thumbsUp" :disabled=disabled><i class="fa fa-thumbs-o-up" aria-hidden="true"></i></button>
  <div class="message">{{ question }}</div>
  </div>`,
  props: ['question','counter','index'],
  // props: ['counter','question'],
  data:
    function() {
      return {
        disabled: false
      };
    },
  methods: {
    thumbsUp: function() {
      this.disabled = true;
      this.$emit('increment', this.index, this.counter + 1);
    }
  }
});

window.onload = function () {

  var socket = io();
  socket.on('connect', function () {
    socket.emit('my event', {
      data: 'I\'m connected!'
    });
  });
  socket.on('message', function (msg) {
    app.questions.push({
      text: app.newQuestionText,
      counter: app.newCounter
    });
    this.newQuestionText = '';
    this.newCounter = 0;
  });

  var app = new Vue({
    el: '#app',
    components: {
      feedEntry
    },
    data: {
      newCounter: 0,
      questions: [],
      newQuestionText: ''
    },
    methods: {
      addNewQuestion: function () {
        socket.emit('message', this.newQuestionText);
      },
      incrementCounter: function (index, newCounter) {
        socket.emit('upvote',this.questions[index].text);
        this.questions[index].counter = newCounter;
      }
    },
    events: {
      
    }
  });
}