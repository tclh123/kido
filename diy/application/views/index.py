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
<<<<<<< HEAD
    #return open('/Users/tclh123/Programming/Source Control/kido/diy/application/static/scripts/' + name, 'r').read()
    return open('/home/lee/Documents/Projects/Web_Shell/kido/diy/application/static/scripts/' + name, 'r').read()

@app.route("/styles/<path:name>")
def styles(name):
    #return open('/Users/tclh123/Programming/Source Control/kido/diy/application/static/styles/' + name, 'r').read()
    return open('/home/lee/Documents/Projects/Web_Shell/kido/diy/application/static/styles/' + name, 'r').read()
=======
    return open('./application/static/scripts/' + name, 'r').read()

@app.route("/styles/<path:name>")
def styles(name):
    return open('./application/static/styles/' + name, 'r').read()
<<<<<<< HEAD
>>>>>>> dfa3fa431d1a7a0ee26f73f7f4cc7a52ab26eef1
=======

@app.route("/static/<path:name>")
def static(name):
    return open('./application/static/' + name, 'r').read()
>>>>>>> e5b6447b6348adf8992fb700036aca7f499928b7
