from flask import Flask
from flask_socketio import SocketIO

from api.example import example
from channel.server import *

app = Flask(__name__)
app.secret_key = "12345"
socketio = SocketIO(
    app, binary=True, http_compression=False, async_mode='gevent')

# 頻道server
ChannelServer.init_app(app, socketio)
# 注冊藍圖
app.register_blueprint(blueprint=example, url_prefix="/example")

# send CORS headers
# @app.after_request
# def after_request(response):
#     response.headers.add('Access-Control-Allow-Origin', '*')
#     if request.method == 'OPTIONS':
#         response.headers['Access-Control-Allow-Methods'] = 'DELETE, GET, POST, PUT'
#         headers = request.headers.get('Access-Control-Request-Headers')
#         if headers:
#             response.headers['Access-Control-Allow-Headers'] = headers
#     return response


if __name__ == "__main__":

    app.debug = False
    socketio.run(app, host='0.0.0.0', port=50001)
    # ChannelServer.run(host="0.0.0.0", port=3000)
    #app.run(host="0.0.0.0", port=3000, debug=False)
