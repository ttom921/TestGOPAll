from flask import Flask, request
from flask_socketio import SocketIO, Namespace, send, emit
import datetime
import time


class MyCustomNamespace(Namespace):
    ChatServer = None
    ServerNameSpace = None
    socketio = None
    # 客戶connect的事件

    def on_connect(self):
        sckns = request.namespace
        currentSocketId = request.sid
        remotip = request.remote_addr
        fmt = "[myns ns=%s]<connect> remote_addr=%s socket.id=%s" % (
            sckns, remotip, currentSocketId)

        print(fmt)
        self.sendUpdateNamespace()

    # 客戶disconnect的事件

    def on_disconnect(self):
        sckns = request.namespace
        currentSocketId = request.sid
        fmt = "[myns ns=%s]<disconnect> socket.id=%s" % (
            sckns, currentSocketId)
        print(fmt)
        # self.ChatServer.RemoveSidAccChn(currentSocketId)
        self.ChatServer.RemoveClient(currentSocketId)
        print("--------------------")

    # 客戶已連線connected的事件,送誰連線

    def on_connected(self, data):
        # socket id
        currentSocketId = request.sid
        sckns = request.namespace
        fmt = "[myns ns=%s]<connected> socket.id=%s msg=%s" % (
            sckns, currentSocketId, data)
        print(fmt)

        self.ChatServer.AddClient(
            data["type"], currentSocketId, sckns, data["username"])
        # 指令cmdmessage的事件

    def on_cmdmessage(self, data):
        currentSocketId = request.sid
        sckns = request.namespace
        cmdmsg = data["cmd"]
        params = data["params"]
        fmt = "[myns ns=%s]<cmdmessage>:cmd=%s params:%s" % (
            sckns, cmdmsg, params)
        print(fmt)
        self.ChatServer.RunCmdDVR(data, sckns)

    # 聊天chatmessage的事件

    def on_chatmessage(self, data):
        currentSocketId = request.sid
        sckns = request.namespace
        msg = data["msg"]
        curroom = data["channel"]
        fmt = "[myns ns=%s]<chatmessage>:curroom=%s msg:%s" % (
            sckns, curroom, msg)
        print(fmt)

        # curroomdata = self.socketio.server.rooms(currentSocketId, sckns)
        # fmt = "[myns ns=%s]<chatmessage>:currroom=%s" % (sckns, curroomdata)
        # print(fmt)
        # curroom = ""
        # if len(curroomdata) > 1:
        #     curroom = curroomdata[1]
        emit("chatmessage", data, broadcast=True, room=curroom, namspace=sckns)
        # # emit("chatmessage", data)
        # emit("chatmessage", data, broadcast=True)
        # # emit("chatmessage", data, broadcast=True, include_self=False)
    # 建立createNamespace的事件

    def on_createNamespace(self, data):
        currentSocketId = request.sid
        sckns = request.namespace
        print("[myns ns=%s]<createNamespace> socket.id=%s nsname=%s" %
              (sckns, currentSocketId, data["name"]))
        self.ChatServer.createNamespace(data["name"])

    def on_deleteNamespace(self, data):
        currentSocketId = request.sid
        sckns = request.namespace
        print("[myns ns=%s]<deleteNamespace> socket.id=%s nsname=%s" %
              (sckns, currentSocketId, data["name"]))
        self.ChatServer.deleteNamespace(data["name"])

    def on_getnamespacelst(self, data):
        currentSocketId = request.sid
        sckns = request.namespace
        # print("[myns ns=%s]<getnamespacelst> socket.id=%s data=%s" %
        #       (sckns, currentSocketId, data))
        self.sendUpdateNamespace()

    def on_getchannellst(self, data):
        currentSocketId = request.sid
        sckns = request.namespace
        # print("[myns ns=%s]<getchannellst> socket.id=%s data=%s" %
        #       (sckns, currentSocketId, data))
        self.sendUpdateChannel()
    # 傳送namespace列表

    # 加入到指定的namespace

    def on_joinNamespace(self, data):
        namespaceToConnect = self.ChatServer.searchObjectOnArray(
            data["namespace"])
        if namespaceToConnect != None:
            sendmsg = {"namespace": namespaceToConnect}
            emit('joinNamespace', sendmsg, json=True)
            currentSocketId = request.sid
            sckns = request.namespace
            print("[myns ns=%s]<joinNamespace> socket.id=%s nsname=%s" %
                  (sckns, currentSocketId, namespaceToConnect))
            self.ChatServer.sendUpdateChannel()
# -------------------------------------------------------

    def sendUpdateNamespace(self):
        self.ChatServer.sendUpdateNamespace()
        # currentSocketId = request.sid
        # sckns = request.namespace
        # senddata = {'result': self.ChatServer.namespace_queue}
        # print("[myns ns=%s]<updateNamespaceList> socket.id=%s result=%s" %
        #       (sckns, currentSocketId, senddata))
        # emit('updateNamespaceList', senddata, broadcast=True, json=True)
    # 加入JoinToApp事件加入某個namespace

    def sendUpdateChannel(self):
        self.ChatServer.sendUpdateChannel()
    # def on_JoinToApp(self, data):
    #     namespaceToConnect = self.ChatServer.searchObjectOnArray(
    #         data["namespace"])
    #     if namespaceToConnect != None:
    #         sendmsg = {"namespace": namespaceToConnect}
    #         emit('JoinToApp', sendmsg, json=True)
# -------------------------------------------------------
    # 有關bytemessage

    def on_bytemessage(self, data):
        currentSocketId = request.sid
        sckns = request.namespace
        curroom = data["channel"]
        # fmt = "[myns ns=%s]<bytemessage>:%s" % (sckns, data)
        # print(fmt)
        # emit("chatmessage", data)
        # emit("bytemessage", data, broadcast=True, json=True)
        # t1 = datetime.datetime.now().microsecond
        # t3 = time.mktime(datetime.datetime.now().timetuple())

        emit("bytemessage", data, room=curroom, namspace=sckns,
             broadcast=True, include_self=False)

        # t2 = datetime.datetime.now().microsecond
        # t4 = time.mktime(datetime.datetime.now().timetuple())
        # strTime = 'on_bytemessage time use:%dms' % (
        #     (t4 - t3) * 1000 + (t2 - t1) / 1000)
        # print(strTime)

# -------------------------------------------------------
    # 有關加入頻道

    def on_join(self, data):
        username = data['username']
        channel = data['channel']
        sid = request.sid
        sckns = request.namespace
        # 取得有加入的房間
        rooms = self.__getjoinrooms(sid, sckns)
        # fmt = "[myns ns=%s]__getjoinrooms:rooms=%s" % (sckns, rooms)
        # print(fmt)
        # 移除所有房間
        for x in rooms:
            self.__leaveroom(sid, sckns, x)

        self.socketio.server.enter_room(sid, channel, namespace=sckns)
        # 設定頻道資料
        self.ChatServer.SetDataChannel(sid, channel)
        # 顯示目前加入的房間
        rooms = self.socketio.server.rooms(sid, sckns)
        fmt = "[myns ns=%s]<join>:rooms=%s" % (sckns, rooms)
        print(fmt)
        # self.socketio.join_room(channel, namespace=sckns)
        emit("join", data, broadcast=True, room=channel, namespace=sckns)
        fmt = "[myns ns=%s]<join>:channel=%s socket.id=%s" % (
            sckns, channel, sid)
        print(fmt)
        # 檢查是否有此key
        if 'channel1' in self.socketio.server.manager.rooms["/car-00"]:
            fmt = "[/car-00][channel1] list=%s" % (
                self.socketio.server.manager.rooms["/car-00"]["channel1"])
            print(fmt)

    def __getjoinrooms(self, sid, sckns):
        rooms = self.socketio.server.rooms(sid, sckns)
        joinrooms = [x for x in rooms if x != sid]
        return joinrooms

    def __leaveroom(self, sid, sckns, channel):
        data = {channel: channel}
        self.socketio.server.leave_room(sid, channel, namespace=sckns)
        emit("leave", data, broadcast=True, room=channel, namespace=sckns)
        # 設定頻道資料
        self.ChatServer.DelDataChannem(sid)

    def on_leave(self, data):
        # username = data['username']
        channel = data['channel']
        sid = request.sid
        sckns = request.namespace
        # self.socketio.leave_room(channel, namespace=sckns)
        self.socketio.server.leave_room(sid, channel, namespace=sckns)
        emit("leave", data, broadcast=True, room=channel, namespace=sckns)
