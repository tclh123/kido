#coding=utf-8
import sys
reload(sys)
sys.setdefaultencoding('utf-8')

from flask import Flask, session, request
app = Flask(__name__)

if __name__ != "__main__":
    from application import app
    from flask import render_template

@app.route("/")
def index(name = None):
    return render_template('views/index.html')

@app.route("/scripts/<path:name>")
def scripts(name):
    return open('./application/static/scripts/' + name, 'r').read()

@app.route("/styles/<path:name>")
def styles(name):
    return open('./application/static/styles/' + name, 'r').read()

@app.route("/static/<path:name>")
def static(name):
    return open('./application/static/' + name, 'r').read()
