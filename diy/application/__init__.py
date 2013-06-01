
from flask import Flask
app = Flask(__name__)
app.debug = app.config['DEBUG']

#import os
#print os.getcwd()

import application.views.index
import application.apps.shell_apps.base
import application.apps.shell_apps.weibo
