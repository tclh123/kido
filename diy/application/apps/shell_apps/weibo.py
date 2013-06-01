from application import app

import json
import urllib, urllib2

@app.route("/api", methods = ["GET", "POST"])
def api():
    with open("/home/atupal/src/github/kido/diy/application/data/weibo_token.json", 'r') as fi:
        token = json.load(fi)
        url = 'https://api.weibo.com/2/statuses/user_timeline.json'
        access_token = token[0]['access_token']
        uid = token[0]['uid']
        data = "?access_token=" + access_token + "&uid=" + uid
        url += data
        ret = urllib2.urlopen(url).read()
        return ret

def weibo_auth_get_token(code):
    url = ('https://api.weibo.com/oauth2/access_token?',
    'client_id=1220535963&client_secret=a7be392d0966389630798eeafb51e400&grant_type=authorization_code',
    '&redirect_uri=http://atupal.org&code=',
    code)
    req = urllib2.Request(url)
    data = urllib.quote('client_id=1220535963&client_secret=a7be392d0966389630798eeafb51e400')
    req.add_data(data)
    ret = urllib2.urlopen(req).read()
    return ret
