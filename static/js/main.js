var feedEntry = Vue.component('feed-entry', {
  template: `<div class="feed-entry">
  <div class="upvote-count">{{ counter }}</div>
<button class="upvote-btn" v-on:click="thumbsUp" :disabled=disabled><i class="fa fa-thumbs-o-up" aria-hidden="true"></i></button>
  <div class="message">{{ question }}</div>
  </div>`,
  props: ['question','counter','index'],
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

  var socket = io.connect();
  socket.on('connect', function () {
    socket.emit('my event', {
      data: 'I\'m connected!'
    });
  });
  socket.on('new question', function (msg) {
    console.log(msg);
    app.questions.push({
      text: msg,
      counter: 0
    });
    app.newQuestionText = '';
    app.newCounter = 0;
  });
  socket.on('upvoted_question', function (question) {
    console.log(question);
    for (var i = 0; i < app.questions.length; i++) {
      if (app.questions[i].text == question) {
        app.questions[i].counter += 1;
      }
    }
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
        socket.emit('upvote', this.questions[index].text);
      }
    }
  });
}
