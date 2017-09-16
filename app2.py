from flask import Flask, render_template
from flask_socketio import SocketIO


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)


@app.route('/prof')
def prof():
    return render_template('prof.html')


@app.route('/student')
def student():
    return render_template('student.html')

@app.route('/')
def main():
    return render_template ('index.html')


@socketio.on('my event')
def handle_my_custom_event(json):
    print('received json: ' + str(json))

@socketio.on('message')
def handle_message(message):
    print('received message: ' + message)

@socketio.on('Upvote Feed Item')
def upvote(feedItem):
    print('Feed Item Upvoted')

@socketio.on('Submit Feed Item')
def submit_item_to_feed(feedItem):
    print('Feed Item Submitted: ' + feedItem)

if __name__ == '__main__':
    socketio.run(app, debug=True)
