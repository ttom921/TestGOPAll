# TestGop3
1. 主要是測試200個連線在python的Flask-SocketIO是否有什麼issue
2. 主要測試可以傳送到多少的client

### Server端

使用python **Flask-SocketIO** 使用port=50001

```mermaid

sequenceDiagram

DVR -> DVR:建立car的namespace
Note left of server: 先建立10台車子car-00~10
DVR -> DVR:建立頻道的channel-channel8

server -> server: 建立car的namespace 
Note right of server: 先建立10台車子car-00~10
server -> server: 建立頻道的channel-channel8


DVR -->> server:car-XX和
server -> server:加入car-XX namespace
DVR -->> server:選擇其中頻道1-8
server -> server:加入car-XX下的頻道
DVR -> server:選擇傳送檔案
server->server:傳送所有此car下的頻道不包括原來的發送端

```



### pytest

使用python的selenium來打開多個瀏覽器來測試同時傳送和發送資料

#### DVR

可同時扮演傳送和接收的角色，不顯示內容