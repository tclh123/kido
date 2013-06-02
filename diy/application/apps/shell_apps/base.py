#coding=utf-8

from application import app
from flask import request, session, redirect
import json
import urllib2
import requests
import application.apps.shell_apps.doubanfm as dbfm
from pyquery import PyQuery as pyq

from application.apps.shell_apps.weibo_ import APIClient
APP_KEY = '185639834'
APP_SECRET = '8c9aa1623e8126dd5eec680f930bda8b'
CALLBACK_URL = 'http://127.0.0.1:8888/callback'
ACCESS_TOKEN = ''

import sys
reload(sys)
sys.setdefaultencoding("utf-8")

@app.route("/test", methods = ["GET", "POST"])
def test():
    return "test"

@app.route("/post", methods = ["POST"])
def cmd():
#    value = session['key']
    if request.method == 'GET':
        ret = {"result":"invalid method: get!"}
        return json.dumps(ret)
    elif request.method == 'POST':
        all_args = request.form.get('json')
        all_args = json.loads(all_args)
        app_name = all_args.get('name')
        cmd = all_args.get('cmd')
        param = json.dumps(all_args.get('args'))
        return eval(app_name + "( cmd = '" + str(cmd) + "' , param = '" + str(param) + "')")

@app.route("/callback", methods = ["GET", "POST"])
def callback():
    client = APIClient(app_key=APP_KEY, app_secret=APP_SECRET, redirect_uri=CALLBACK_URL)
    r = client.request_access_token(request.args['code'])
    ACCESS_TOKEN = r.access_token  # access token，e.g., abc123xyz456
    expires_in = r.expires_in      # token expires in
    client.set_access_token(ACCESS_TOKEN, expires_in)

    # TODO: ACCESS_TOKEN 存到文件
    print ACCESS_TOKEN

#    test
#    print client.statuses.user_timeline.get()
#    print client.statuses.update.post(status=u'test plain weibo')

#    client.statuses.update.post(status=u'test plain weibo 2')

    return redirect("/")

###############

tab = "&nbsp;"  * 4
def ls(cmd = None, param = None):
    content = (
            "apps:" + "</br>"
            + tab + "weibo" + "</br>"
            + tab + "doubanfm" + "</br>"
            "..."
            )
    ret = {}
    ret['action'] = "output"
    ret['type'] = 'text'
    ret['data'] = content
    return json.dumps(ret)

def weibo(cmd = None, param = None):
    if cmd == "None" and param == "[]":
        ret = ("sendweibo:" + "</br>"
                + tab
                + "explain: send a weibo message!"  + "</br>"
                + tab
                + "args1: the content want to post" + "</br>"
                + "getweibo" + "</br>"
                + tab
                + "expain: get weibo message of all friends" + "</br>"
                + tab
                + "args1: the index of page for all weibo messages" + "</br>"
                + tab
                + "args2: the number of weibo message view"
            )
        ret = {
                "action": "output",
                "type": "html",
                "data": json.dumps(ret),
                }
        return json.dumps(ret)

#    elif cmd == 'timeline':
#        client = APIClient(app_key=APP_KEY, app_secret=APP_SECRET, redirect_uri=CALLBACK_URL)
#        ret = client.statuses.home_timeline.get()


    elif cmd == "getweibo" or cmd == "timeline":
        #TODO:

#        with open("./application/data/weibo_token.json", 'r') as fi:
#        client = APIClient(app_key=APP_KEY, app_secret=APP_SECRET, redirect_uri=CALLBACK_URL)
#        client.statuses.update.post(status=u'test plain weibo 2')

        if ACCESS_TOKEN is None or ACCESS_TOKEN == '':
            ret = {}
            ret['action'] = 'output'
            ret['type'] = 'text'
            ret['data'] = 'error: please login first. CALL weibo login'
            return json.dumps(ret)

        param = json.loads(param)
        page = "1"
        count = "20"
        if len(param) == 1:
            page = param[0]
        elif len(param) == 2:
            page = param[0]
            count = param[1]

#        token = json.load(fi)
        url = 'https://api.weibo.com/2/statuses/friends_timeline.json'
#        access_token = token[0]['access_token']
        data = "?access_token=" + ACCESS_TOKEN
        data += "&page=" + page
        data += "&count=" + count
        url += data
        ret = urllib2.urlopen(url)
        ret = json.load(ret)
        content = "<ul>"
        for w in ret.get('statuses'):
            content += "<li>"  + w.get('user').get('screen_name') + "</li>"  + "<li>" +w.get('text') + "</li>" + "</br>"
        content += "</ul>"

        ret = {}
        ret['action'] = 'output'
        ret['type'] = 'html'
        ret['data'] = content
        return json.dumps(ret)
    elif cmd == "sendweibo":
        with open("./application/data/weibo_token.json", 'r') as fi:
            token = json.load(fi)
            url = 'https://api.weibo.com/2/statuses/update.json'
            access_token = token[0]['access_token']
            data = {
                    "status": str(param).strip('[').strip(']'),
                    "access_token" : access_token,
                    }
            requests.post(url, data = data)
            ret = {
                    "action": "output",
                    "type": "text",
                    "data": "success"
                    }
            return json.dumps(ret)

    elif cmd == 'login':
        client = APIClient(app_key=APP_KEY, app_secret=APP_SECRET, redirect_uri=CALLBACK_URL)
        url = client.get_authorize_url()
        ret = {
                "action": "needauth",
                "type": "text",
                "data": url,
                }
        return  json.dumps(ret)

    url = ('https://api.weibo.com/oauth2/authorize?client_id='+
            '1220535963' +
            '&response_type=code&redirect_uri=' +
            'http://atupal.org')
    ret = {
            "action": "needauth",
            "type": "text",
            "data": url,
            }
    return  json.dumps(ret)


def doubanfm(cmd = None, param = None):
    if cmd == "None" and param == "[]":
        chanel =  (
                "explain: " + "</br>"
                + tab + "调用豆瓣fm播放音乐" + "</br>"
                "args1:" + "</br>"
                + tab + "选择一个频道" + "</br>"
                +  "fm频道:" + "</br>"
                + tab + "channel=0 私人兆赫  type=s" + "</br>"
                + tab + "channel=1 公共兆赫【地区 语言】：华语MHZ" + "</br>"
                + tab + "channel=2 公共兆赫【地区 语言】：欧美MHZ" + "</br>"
                + tab + "channel=3  公共兆赫【年代】：70年代MHZ" + "</br>"
                + tab + "channel=4  公共兆赫【年代】：80年代MHZ" + "</br>"
                + tab + "channel=5  公共兆赫【年代】： 90年代MHZ" + "</br>"
                + tab + "channel=6 公共兆赫【地区 语言】：粤语MHZ" + "</br>"
                + tab + "channel=22 公共兆赫【地区 语言】：法语MHZ" + "</br>"
                + tab + "channel=17 公共兆赫【地区 语言】：日语MHZ" + "</br>"
                + tab + "channel=18 公共兆赫【地区 语言】：韩语MHZ" + "</br>"
                + tab + "channel=8 公共兆赫【流派】：民谣MHZ" + "</br>"
                + tab + "channel=7 公共兆赫【流派】：摇滚MHZ" + "</br>"
                + tab + "channel=13 公共兆赫【流派】：爵士MHZ" + "</br>"
                + tab + "channel=27 公共兆赫【流派】：古典MHZ" + "</br>"
                + tab + "channel=14 公共兆赫【流派】：电子MHZ" + "</br>"
                + tab + "channel=16 公共兆赫【流派】：R&BMHZ" + "</br>"
                + tab + "channel=15 公共兆赫【流派】：说唱MHZ" + "</br>"
                + tab + "channel=10 公共兆赫【流派】：电影原声MHZ" + "</br>"
                + tab + "channel=26 公共兆赫：豆瓣音乐人MHZ" + "</br>"
                + tab + "channel=20 公共兆赫【特辑】：女声MHZ" + "</br>"
                + tab + "channel=dj DJ兆赫" + "</br>"
                + tab + "channel=28 公共兆赫【特辑】：动漫MHZ" + "</br>"
                + tab + "channel=32 公共兆赫【特辑】：咖啡MHZ" + "</br>"
                + tab + "channel=67 公共兆赫【特辑】：东京事变MHZ" + "</br>"
                + tab + "channel=52 公共兆赫【品牌】：乐混翻唱MHZ" + "</br>"
                + tab + "channel=58 公共兆赫【品牌】：路虎揽胜运动MHZ" + "</br>"
                + "login1:" + "</br>"
                + tab + "获取登录的验证码" + "</br>"
                + "login2:" + "</br>"
                + tab + "登录豆瓣fm，3个参数依次为用户名，密码，验证码" + "</br>"
                + "get_list" + "</br>"
                + tab + "获取收藏的歌曲" + "</br>"
                + "logout:" + "</br>"
                + tab + "登出" + "</br>"
        )
        ret = {
                "action": "output",
                "type": "html",
                "data":chanel
                }
        return json.dumps(ret)
    elif cmd.isdigit():
        url = 'http://douban.fm/j/mine/playlist?channel=' + cmd
        req = requests.get(url).content
        req = json.loads(req)
        content = req.get('song')[0].get('url')
        #content = '<video controls="" autoplay="" name="media"><source src="'+content+'" type="audio/mpeg"></video>' \

        content = ('<audio controls>' +
          '<source src="horse.ogg" type="audio/ogg">'+
            '<source src="'+'/static/test.mp3'+'" type="audio/mpeg">'+
              'Your browser does not support the audio tag.'+
              '</audio>'
                + req.get('song')[0].get('title') + "</br>")

        ret = {
                "action": "output",
                "type": "html",
                "data":content
                }
        return json.dumps(ret)
    elif cmd == "login1":
        D = dbfm.Doubanfm()
        D.new_captcha()
        D.getimg()
        content = '<img src="/static/verify_code.jpg" />'
        ret = {
                "action":"output",
                "type": "html",
                "data": content,
                }
        return json.dumps(ret)
        #verify_code = raw_input()
        #D.verify_code = verify_code
        #D.login()
#        D.get_list()
    elif cmd == "login2":
        param = json.loads(param)
        D = dbfm.Doubanfm()
        D.username = param[0]
        D.passwd = param[1]
        D.verify_code = param[2]
        D.login()
        return json.dumps({
            "action": "output",
            "type": "html",
            "data": "login success",
            })
    elif cmd == "logout":
        D = dbfm.Doubanfm()
        D.logout()
        return json.dumps({
            "action": "output",
            "type": "html",
            "data": "logout success",
            })

    elif cmd == 'get_list':
        D = dbfm.Doubanfm()
        content = D.get_list()
        d = pyq(content)
        p = d('.song_info')
        content = str(p)
        return json.dumps({
            "action": "output",
            "type": "html",
            "data": content,
            })

    elif cmd == 'get_fav_src':
        D = dbfm.Doubanfm()
        content = D.get_fav_src()
        return json.dumps({
            "action": "output",
            "type": "html",
            "data": content,
            })

    else:
        return "sd"


def renren(cmd = None, param = None):
    fi = open('./application/data/renren_token.json', 'r')
    token = json.load(fi)
    fi.close()
    if cmd == "getmes":
        url = 'https://api.renren.com/restserver.do'
        data = {
                "v": "1.0",
                "access_token": token[0].get("access_token"),
                "method" : "feed.get",
                "type":"",
                }
