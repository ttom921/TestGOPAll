from flask import Blueprint, request, current_app, jsonify
from api.login.loginmanager import LoginMgr
from lib.auth import Auth
from lib.retrespon import *

login = Blueprint(name="login", import_name=__name__)


@login.route('', methods=['POST', 'DELETE'])
def post():
    # get the post data
    post_data = request.get_json()
    print(post_data)
    try:
        user = LoginMgr.CkeckUserIsExist(post_data)
        if user:
            auth_token = Auth.encode_auth_token(user.id, user.username)
            responseObject = resData("success", "登錄成功", auth_token.decode())
            # responseObject = {
            #     "status": "success",
            #     "message": "Successfully logged in.",
            #     "auth_token": auth_token
            # }
            return jsonify(responseObject), 200
        else:
            responseObject = resData("fail", "使用者不存在")
            # responseObject = {
            #     'status': 'fail',
            #     'message': 'User does not exist.'
            # }
            return jsonify(responseObject), 404
    except Exception as e:
        print(e)
        responseObject = resData("fail", "Try agsin")
        # responseObject = {
        #     "status": "fail",
        #     "message": "Try agsin",
        # }
        return jsonify(responseObject), 500
    # responseObject = {
    #     "status": "fail",
    #     "message": "name or password error",
    # }
    # return jsonify(responseObject), 401
    # return "auth/login"
