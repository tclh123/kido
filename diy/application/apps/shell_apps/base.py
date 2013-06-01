#coding=utf-8

from application import app
from flask import request
import json
import urllib2

import sys
reload(sys)
sys.setdefaultencoding("utf-8")

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
    if cmd == "None" and param == "None":
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
    elif cmd == "getweibo":
        with open("./application/data/weibo_token.json", 'r') as fi:
            token = json.load(fi)
            url = 'https://api.weibo.com/2/statuses/friends_timeline.json'
            access_token = token[0]['access_token']
            data = "?access_token=" + access_token
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
                    "status": str(param),
                    "access_token" : access_token,
                    }
            import requests
            requests.post(url, data = data)
            ret = {
                    "action": "output",
                    "type": "text",
                    "data": "success"
                    }
            return json.dumps(ret)


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
    if cmd == "None" and param == "None":
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
        )

        ret = {
                "action": "output",
                "type": "html",
                "data":chanel
                }
        return json.dumps(ret)
    else:
        print param
        return "sd"

