from flask import Blueprint, request, current_app, jsonify
from flask_restful import Resource, Api
from lib.retrespon import *
from lib.auth import Auth
from channel.server import ChannelServer

nsserver = Blueprint(name="nsserver", import_name=__name__)


# class Servers(Resource):

#     def get(self):
#         # 返回所有數據
#         result = Auth.identify(Auth, request)
#         if(result['status'] == "success"):
#             result = resData("success", "資料成功", "this a data")
#             return jsonify(result), 200

#         return jsonify(result), 401

#     def post(self):
#         # 新增數據
#         data = request.get_json()
#         return 'add new data:%s' % data


# class Server(Resource):
#     def get(self, _id):
#         # 返回單條數據
#         return "this data id %s" % _id

#     def delete(self, _id):
#         # 刪除單條數據
#         return "delete data:%s" % _id

#     def put(self, _id):
#         # 修變單條數據
#         data = request.get_json()
#         return "put data %s:%s" % (_id, data)


# servers = Servers()


@nsserver.route('', methods=['GET'])
def _nsserver():
    # 取得namespace列表
    result = Auth.identify(Auth, request)
    if(result['status'] == "success"):
        user = result['message']
        resnamespace = ChannelServer.FindCarNameSpace(user.username)
        responseObject = {
            "status": "success",
            "data": resnamespace,
        }
        return jsonify(responseObject), 200
    else:
        return jsonify(result), 401

    # return servers.get()
