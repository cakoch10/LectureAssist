var feedEntry = Vue.component('feed-entry', {
  template: `<div class="feed-entry">
               <div class="upvote-count">{{ counter }}</div>
                  <button class="upvote-btn" 
                    v-on:click="thumbsUp" 
                    :disabled=disabled>
                      <i class="fa fa-thumbs-o-up" aria-hidden="true"></i>
                  </button>
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

var canAskAgain = true;
function wait() {
  setTimeout(function () {
    canAskAgain = true;
  }, 5000);
}

window.onload = function () {

  var socket = io.connect();
  socket.on('connect', function () {
    socket.emit('my event', {
      data: 'I\'m connected!'
    });
  });
  socket.on('new question', function (msg) {
    app.newQuestionText = '';
    app.newCounter = 0;
    app.questions.push({
      text: msg,
      counter: 0
    });
  });
  socket.on('upvoted_question', function (question) {
    console.log(question);
    question = question.replace('\n','').replace('\t','').trim();
    console.log(question);
    for (var i = 0; i < app.questions.length; i++) {
      if (app.questions[i].text == question) {
        app.questions[i].counter += 1;
      }
    }
    app.questions.sort(function (a, b) {
      return parseFloat(b.counter) - parseFloat(a.counter);
    });
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
        if (canAskAgain === false) {
          alert("Too many questions in such a short time. Please wait a moment.");
        } else if (this.newQuestionText.length > 140) {
          alert("Your question is too long! Try to ask in a more concise way.");
          app.newQuestionText = '';
          app.newCounter = 0;
        } else if (this.newQuestionText.length < 10) {
          alert("Your question is too short! Try to elaborate a little.");
          app.newQuestionText = '';
          app.newCounter = 0;
        } else {
          for (var i = 0; i < app.questions.length; i++) {
            if (app.questions[i].text == this.newQuestionText) {
              socket.emit('upvote', app.questions[i].text);
              canAskAgain = false;
              wait();
              return;
            }
          }
          socket.emit('message', this.newQuestionText);
          canAskAgain = false;
          wait();
        }
      },
      incrementCounter: function (index, newCounter) {
        socket.emit('upvote', this.questions[index].text);
      }
    }
  });
}
