
from application import app

# from geventwebsocket.handler import WebSocketHandler
# from gevent.pywsgi import WSGIServer

if __name__ == "__main__":
    # http_server = WSGIServer((OPENSHIFT_INTERNAL_IP, OPENSHIFT_INTERNAL_PORT), app, handler_class=WebSocketHandler)
    
    app.run(host='localhost',port=8888) 