from application import app
from flask import request
import json
import urllib, urllib2

@app.route("/test", methods = ["GET", "POST"])
def test():
    return "test"

@app.route("/post", methods = ["POST"])
def cmd():
    if request.method == 'GET':
        ret = {"result":"invalid method: get!"}
        return json.dumps(ret)
    elif request.method == 'POST':
        app_name = request.form.get('name')
        cmd = request.form.get('cmd')
        param = request.form.get('args')
        return eval(app_name + "( cmd = '" + str(cmd) + "' , param = '" + str(param) + "')")

def ls(cmd = None, param = None):
    tab = "&nbsp;"  * 4
    content ='''
            apps:</br>
            '''+tab+'''weibo</br>
    '''
    ret = {}
    ret['action'] = "output"
    ret['type'] = 'text'
    ret['data'] = content
    return json.dumps(ret)

def weibo(cmd = None, param = None):
    if not cmd and not param:
        ret = {
                "sendweibo": {
                    "explain":"send a weibo message",
                    "option": {
                        "-m": "weibo message content"
                        },
                    },
                "getweibo": {
                    "explain": "view weibo ",
                    "option": {
                        "-n": "the number of weibo message you want view a time",
                        },
                    },
                }
        return json.dumps(ret)
    elif cmd == "getweibo":
        with open("/home/atupal/src/github/kido/diy/application/data/weibo_token.json", 'r') as fi:
            token = json.load(fi)
            url = 'https://api.weibo.com/2/statuses/friends_timeline.json'
            access_token = token[0]['access_token']
            data = "?access_token=" + access_token
            url += data
            ret = urllib2.urlopen(url)
            ret = json.load(ret)
            content = "<ul>"
            for w in ret.get('statuses'):
                content += "<li>"  + w.get('text') + "</li>"  + "</p>" + "<li>" +w.get('user').get('screen_name') + "</li>"
            content += "</ul>"
            ret = {}

            ret['action'] = 'output'
            ret['type'] = 'html'
            ret['data'] = content
            return json.dumps(ret)


    url = ('https://api.weibo.com/oauth2/authorize?client_id=',
            '1220535963',
            '&response_type=code&redirect_uri=',
            'http://atupal.org')
    ret = {"retcode": "1", "url": url}
    return  json.dumps(ret)

def doubanfm(cmd = None, param = None):
    return 'douban'
