from flask import Flask, requests, request
import json


app = Flask(__name__)


SIMILARITY_INDEX = 0.5


'''
Takes a list of keywords and
returns the similarity
'''


def similiarity(keywords1, keywords2):
    counter = 0
    for word in keywords1:
        if word in keywords2:
            counter += 2
    return 1.0*counter/(len(keywords1) + len(keywords2))



def getSentence(question):



'''
Takes a string of text that represents a question and store it
also compare the string to all existing strings
'''


@app.route('/getText', methods=['POST', 'GET'])
def getText():
    # compare text to all strings
    # questions.json stores all the questions
    # key is the question and value is the list of keywords
    if request.method == 'POST':
        question = json.dumps(request.json['question'])
        # EXTRACT KEYWORDS FROM question
        # keywords = entities_text(question)
        request_url = \
            "https://language.googleapis.com/" + \
            "v1/documents:analyzeSyntax?key=" \
            + "AIzaSyCchGgYUMgG5BYF1mLBxHad-Z6J4jrrVlw"
        string_request = {}
        string_request["encodingType"] = "UTF8"
        string_request["document"] = {}
        string_request["document"]["type"] = "PLAIN_TEXT"
        string_request["document"]["content"] = question
        r = requests.post(request_url, json=string_request)
        response = json.loads(r.text)
        # check if there at least one noun and a verb
        tags = []
        firstWord = response['tokens'][0]['lemma'].lower()
        for tok in response['tokens']:
            tag = tok['partOfSpeech']['tag'].lower()
            tags.append(tag)
        # make sure is a valid question
        interrogatives = ["which", "what", "whose", "who", "whom"]
        interrogatives += ["where", "how", "can", "why", "wait"]
        
        if firstWord in interrogatives and "noun" in tags and "verb" in tags:
            return true



        keywords = []
        for e in response["entities"]:
            keyword = e["name"]
            keywords.append(keyword)

        with open('questions.json') as f:
            quest = json.loads(f)
        for questionToCompare in quest:
            s = similiarity(keywords, quest[questionToCompare])
            if s > SIMILARITY_INDEX:
                # we need to return a positive count
                return {"count": 1}
        # at this point the question is new
        quest[question] = keywords
        with open('questions.json', 'w') as f:
            json.dump(quest, f)
        return {"count": 0}


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
