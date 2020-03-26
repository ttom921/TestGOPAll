from enum import Enum


# class ClientType(Enum):
#     DVR = 'DVR'   # 車機
#     LIVE = 'LIVE'  # 觀看者
#     MGR = 'MGR'   # 管理者


# 這是儲存client連線來的資料
class ClientData():
    def __init__(self, ClientType, sid, ns, ch, name="no"):
        self.type = ClientType  # cient類型
        self.sid = sid          # 連線sockid
        self.namespace = ns       # 連線的namespace
        self.channel = ch         # 連線的頻道
        self.name = name          # 連線的帳號

    def __str__(self):
        fmt = "ns=%s ch=%s name=%s type=%s sid=%s" % (
            self.namespace, self.channel, self.name, self.type, self.sid,)
        return fmt
# 連線的管理者


class ClientDataManager():
    socketio = None
    clients = []

    def __init__(self):
        pass

    def init_app(self, app, socketiosrv):
        #self.app = app
        self.socketio = socketiosrv

    # 加入管理
    def AddClient(self, ClientType, sid, ns, ch, name):
        item = self.FindClient(sid)
        if item == None:
            item = ClientData(ClientType, sid, ns, ch, name)
            self.clients.append(item)
        # fmt = "[server]<AddClient> lst=%s" % (*clients)
        # print(fmt)
        #print("[server]<AddClient> lst=", *self.clients)
        self.__printClients("AddClient")
    # 移除管理

    def RemoveClient(self, sid):
        item = self.FindClient(sid)
        if item != None:
            self.clients.remove(item)
        # fmt = "[server]<RemoveClient> item=%s" % (item)
        # print(fmt)
        #print("[server]<RemoveClient> lst=", *self.clients)
        self.__printClients("RemoveClient")
    # 找到client

    def FindClient(self, sid):
        for item in self.clients:
            if item.sid == sid:
                return item
        return None

    def FindDVRVlient(self, sid):
        for item in self.clients:
            if item.sid == sid and item.type == "DVR":
                return item
        return None
    # 設定頻道資料

    def SetDataChannel(self, sid, ch):
        item = self.FindClient(sid)
        if item != None:
            item.channel = ch
        self.__printClients("SetDataChannel")
    # 刪除頻道資料

    def DelDataChannem(self, sid):
        item = self.FindClient(sid)
        if item != None:
            item.channel = None

    def __printClients(self, fname):
        print("[server]"+fname+" lst=", *self.clients, sep='\n')


ClientDataManager = ClientDataManager()
