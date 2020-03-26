from flask import request
from flask_socketio import SocketIO, Namespace, send, emit
from .clsns import MyCustomNamespace
from lib.clientdata import ClientDataManager


class ChannelServer:
    app = None
    socketio = None
    clientmgr = None
    # namspace的列表
    namespace_queue = []
    # 不同的namespace處理物件的列表
    CustomNamespace = []
    channellst = ["channel1", "channel2", "channel3", "channel4",
                  "channel5", "channel6", "channel7", "channel8"]
    # 車牌對映使用者
    dicCarUser = {}
    # # Sid->類型,帳號,頻道
    # dicSidAccountChn = {}

    def __init__(self):
        pass

    def init_app(self, app, socketiosrv):
        self.app = app
        self.socketio = socketiosrv
        self.clientmgr = ClientDataManager
        self.clientmgr.init_app(app, socketiosrv)
        # self.createNamespace("", True)
        # 產生測試資料
        self.TestGenerateCarUserData()
        self.GenerateNameSpace()
        # self.socketio = SocketIO(
        #     self.app, binary=True, http_compression=False, async_mode='gevent')

    # def run(self, host='0.0.0.0', port='3000'):
    #     self.socketio.run(self.app, host, port)

    # def Test(self):
    #     print("ChannelServer")

    def createNamespace(self, data, startup=False):
        # print("createNamespace->socketio id="+str(id(self.socketio)))
        if startup == False:
            currentSocketId = request.sid
            print("[server]<createNamespace> socket.id=%s nsname=%s" %
                  (currentSocketId, data))
        # 檢查是否有重覆的namespace
        if not data in self.namespace_queue:
            self.namespace_queue.append(data)
            self.__createClassNamepace(data)
        if startup == False:
            self.sendUpdateNamespace()

    def deleteNamespace(self, data, startup=False):
        if startup == False:
            currentSocketId = request.sid
            print("[server]<deleteNamespace> socket.id=%s nsname=%s" %
                  (currentSocketId, data))
        self.namespace_queue = [x for x in self.namespace_queue if x != data]
        # if startup == False:
        #     self.sendUpdateNamespace()
        self.__deleteClassNamepace(data)
    # 傳送namespace列表

    def sendUpdateNamespace(self):
        currentSocketId = request.sid
        # test_queue = []
        # test_queue.append("aaaa")
        # test_queue.append("bbb")
        # test_queue.append("ccc")
        # senddata = {'result': test_queue}
        senddata = {'result': self.namespace_queue}
        # print("[server]<updateNamespaceList> socket.id=%s result=%s" %
        #       (currentSocketId, senddata))
        emit('updateNamespaceList', senddata, broadcast=True, json=True)

    def sendUpdateChannel(self):
        currentSocketId = request.sid
        senddata = {'result': self.channellst}
        # print("[server]<updateChannelList> socket.id=%s result=%s" %
        #       (currentSocketId, senddata))
        emit('updateChannelList', senddata, broadcast=True, json=True)
    # 檢查是否有namespace

    def searchObjectOnArray(self, namekey):
        for item in self.namespace_queue:
            if item == namekey:
                return item
        return None
    # 建立namespace的物件來處理網路事件

    def __createClassNamepace(self, nsname, startup=False):
        myclsns = MyCustomNamespace("/"+nsname)
        myclsns.ChatServer = self
        myclsns.ServerNameSpace = nsname
        myclsns.socketio = self.socketio
        self.CustomNamespace.append(myclsns)
        # socketio.on_namespace(myclsns)
        self.socketio.on_namespace(myclsns)
        # print("__createClassNamepace->socketio id="+str(id(self.socketio)))
        print("[server]<createClassNamepace> myclsns.ServerNameSpace=%s CustomNamespace=%s" %
              (myclsns.ServerNameSpace, self.CustomNamespace))

    def __deleteClassNamepace(self, nsname, startup=False):
        self.CustomNamespace = [
            x for x in self.CustomNamespace if x.ServerNameSpace != nsname]
        print("[server]<deleteClassNamepace> CustomNamespace=%s" %
              (self.CustomNamespace))
        if startup == False:
            self.sendUpdateNamespace()

    def GenerateNameSpace(self):
        for key in self.dicCarUser:
            # print(key)
            self.createNamespace(key, True)
    # 取得DVR的列表

    def getDVRClient(self, chan, sckns):
        # 此namespace的所有room的列表
        dvrsidlst = []
        if chan in self.socketio.server.manager.rooms[sckns].keys():
            chdata = self.socketio.server.manager.rooms[sckns][chan]
            print("channeldata->"+str(chdata))
            for item in chdata:
                myclient = self.clientmgr.FindDVRVlient(item)
                if myclient != None:
                    dvrsidlst.append(myclient)
        return dvrsidlst
        #dvrsidlst = [x for x in chdata if x != ssid]
    # def getDVRClient(self, ssid, chan, sckns):
    #     # 此namespace的所有room的列表
    #     if chan in self.socketio.server.manager.rooms[sckns].keys():
    #         chdata = self.socketio.server.manager.rooms[sckns][chan]
    #         # fmt = "getDVRClient->ns=%s->channel=%s->data=%s" % (
    #         #     sckns, chan, chdata)
    #         # print(fmt)
    #         dvrsidlst = [x for x in chdata if x != ssid]
    #         # fmt = "getDVRClient->ns=%s->channel=%s->dvrsid=%s" % (
    #         #     sckns, chan, dvrsidlst)
    #         # print(fmt)
    #         return dvrsidlst

    def AddClient(self, ClientType, sid, ns, name=None, ch=None):
        self.clientmgr.AddClient(ClientType, sid, ns, ch, name)

    def RemoveClient(self, sid):
        self.clientmgr.RemoveClient(sid)

    # def FindClient(self, sid):
    #     return clientmgr.FindClient(sid)
    # 設定頻道資料
    def SetDataChannel(self, sid, ch):
        self.clientmgr.SetDataChannel(sid, ch)
    # 刪除頻道資料

    def DelDataChannem(self, sid):
        self.clientmgr.DelDataChannem(sid)

    # 執行命令
    def RunCmdDVR(self, data, ns):
        cmdmsg = data["cmd"]
        params = data["params"]
        # print(data)
        destch = params["dest"]
        act = params["act"]

        print(destch+"->"+act)
        dvrclientlst = self.getDVRClient(destch, ns)
        if len(dvrclientlst) > 0:
            item = dvrclientlst[0]
            emit("cmdmessage", data, room=item.sid, namspace=item.namespace)
        # dvrclientlst = self.ChatServer.getDVRClient(
        #     currentSocketId, channel, sckns)
        # if len(dvrclientlst) > 0:
        #     sid = dvrclientlst[0]
        #     emit("cmdmessage", data, room=sid, namspace=sckns)
    # 以下測試資料

    def TestGenerateCarUserData(self):
        tcarnum = ["car-888", "car-999", "car-777"]
        tusername = ["ttom", "terry", "tommy"]
        index = 0
        for x in tcarnum:
            lst = []
            for z in range(3):
                lst.append(tusername[index]+str(z))
            self.dicCarUser[x] = lst
            index = index+1

        # print(self.dicCarUser)
        # user = "ttom0"
        # rest = self.FindCarNameSpace(user)
        # print(rest)

    def FindCarNameSpace(self, user):
        for k, v in self.dicCarUser.items():
            # print(k, 'corresponds to', v)
            if user in v:
                return k


ChannelServer = ChannelServer()
print("###########################################################")
print("ChannelServer id=", id(ChannelServer))
