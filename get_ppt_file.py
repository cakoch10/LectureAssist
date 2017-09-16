from flask import Flask, request
import os

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = '/pptfiles'


@app.route('/save_ppt', methods=['GET', 'POST'])
def main():
    if request.method == 'POST':
        ppt = request.files['pptFile']
        pptName = ppt.filename
        with open(ppt, 'w') as f:
            f.write(ppt)
        ppt.save(os.path.join(app.config['UPLOAD_FOLDER'], pptName))
