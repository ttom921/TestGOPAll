from flask import Blueprint, request, current_app, jsonify
from api.carlogin.carloginmanager import CarLoginMgr
from lib.auth import Auth
from lib.retrespon import *
from channel.server import ChannelServer


carlogin = Blueprint(name="carlogin", import_name=__name__)


@carlogin.route('', methods=['POST'])
def post():
    # get the post data
    post_data = request.get_json()
    print(post_data)
    try:
        car = CarLoginMgr.CkeckCarIsExist(post_data)
        if car:
            auth_token = Auth.encode_auth_token(car.id, car.username)
            responseObject = resData("success", "車子登錄成功", auth_token.decode())
            # 建立namespace
            ChannelServer.createNamespace(car.username, True)
            return jsonify(responseObject), 200
        else:
            responseObject = resData("fail", "車子不存在")
            return jsonify(responseObject), 404
    except Exception as e:
        print(e)
        responseObject = resData("fail", "Try agsin")
        return jsonify(responseObject), 500
