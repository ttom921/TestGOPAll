## 前言

這是為了測試在client端向server端要求時，server端會傳送client端需要的namespace，來讓client端來以websocket來連線，之後在DVR的模擬端會送連續圖片給server，收到之後轉給要求的client端

### DVRClient

專門傳送影像的client端

### LiveClient

是使用者操作的client端

### Server

是使用python來作為webapi

#### 控製DVR sequenceDiagram

```mermaid
%%觀看端看DVR的sequenceDiagram
sequenceDiagram
LiveShow ->> 服務端:我要看channel1
服務端 ->> 服務端:找到該namespace的頻道
服務端 ->> DVR端:傳送命令打開channel1
alt 使用控制頻道
DVR端 ->> DVR端:控制頻道找出控制那一個頻道
else 直托傳送到channel1
DVR端 ->> DVR端:直接打開channel1頻道
end
DVR端 ->> 服務端:傳送影像到channel1頻道
服務端 ->> LiveShow:接收影像到channel1頻道


```

