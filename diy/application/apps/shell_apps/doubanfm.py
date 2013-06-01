import requests


class Doubanfm:
    def __init__(self):
        pass

    def new_captcha(self):
        url = 'http://douban.fm/j/new_captcha'
        code = requests.get(url)
        self.code = code

    def getimg(self):
        url = 'http://douban.fm/misc/captcha?size=m&id=' + self.code
        self.img = requests.get(url)

    def login(self):
        url = 'http://douban.fm/j/login'
        data = {
                "source": "radio",
                "alias": self.username,
                "form_password": self.passwd,
                "captcha_solution": self.verify_code,
                "captcha_id":self.code,
                "remember":"on",
                "task": "sync_channel_list",
                }


