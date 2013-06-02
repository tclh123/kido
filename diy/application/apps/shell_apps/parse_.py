
from pyquery import PyQuery as pyq

def test():
    with open("/tmp/ts.html") as fi:
        d = pyq(fi.read())
        p = d('.song_info')
        print p


if __name__ == "__main__":
    test()
