
import urllib, urllib2

def douban_auth_get_token(code):
    url = 'https://www.douban.com/service/auth2/token'
    url += '?client_id=' + '0771b82c98b0cfb416552885ca126f1c'
    url += '&client_secret=' + '57aea205ec9f6b8a'
    url += '&redirect_uri=' + 'http://atupal.org'
    url += '&grant_type=' + 'authorization_code'
    url += '&code=' + str(code)
    data = urllib.quote('code=' + str(code))
    req = urllib2.Request(url)
    req.add_data(data)
    ret = urllib2.urlopen(req).read()
    return ret

if __name__ == "__main__":
    print douban_auth_get_token('2c6b5c395ecfacd5')

