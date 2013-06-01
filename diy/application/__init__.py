
from flask import Flask
app = Flask(__name__)
app.debug = app.config['DEBUG']

import application.views.index
