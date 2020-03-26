from flask import Blueprint, request, current_app, jsonify
from flask_restful import Resource, Api
from lib.retrespon import *
from channel.server import ChannelServer
import json

nsserver = Blueprint(name="nsserver", import_name=__name__)


@nsserver.route('', methods=['GET'])
def _nsserver():
    # 取得namespace列表
    #resnamespace = ChannelServer.FindCarNameSpace(user.username)
    resnamespace = ChannelServer.FindAllCarNameSpace()
    responseObject = {
        "status": "success",
        "data": resnamespace,
    }
    return jsonify(responseObject), 200


@nsserver.route('getchannellistdetail', methods=['GET'])
def _getchannellistdetail():
    carnum = request.values.get('carnum')
    lstdvr = []
    channelst = ChannelServer.GetAllChannelList()
    for chan in channelst:
        dvrlist = ChannelServer.getDVRClient(chan, '/'+carnum)
        for item in dvrlist:
            myojb = item.getjson()
            lstdvr.append(myojb)
    #dvrlist = ChannelServer.getDVRClient("channel1", '/'+carnum)

    # print(lstdvr)
    responseObject = {
        "status": "success",
        "data": lstdvr,
    }
    return jsonify(responseObject), 200


@nsserver.route('DVRDisconnect', methods=['POST'])
def _DVRDisconnect():
    # get the post data
    post_data = request.get_json()
    print(post_data)
    try:
        ret = ChannelServer.DisconnectDVR(post_data['sid'])
        if ret:
            responseObject = resData("success", "斷線成功")
        else:
            responseObject = resData("fail", "車子不存在")
        return jsonify(responseObject), 200

    except Exception as e:
        print(e)
        responseObject = resData("fail", "Try agsin")
        return jsonify(responseObject), 500
