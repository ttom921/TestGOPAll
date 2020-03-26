### Server端

因為是用虛擬𤪹來安裝和執行，先放在win10的環境，之後在移到linux上，目前使用vscode編輯和測試，**注意**不使用vscode配置好的執行配置，而是使用原來執行python的配置，這樣才會和linux上的執行時的行為一樣。

先首啟動虛擬環境

Python PIP 使用 requirements.txt 管理套件相依性

```
//PIP 倒出現有環境套件
pip3 freeze > requirements.txt
//PIP 安裝 requirements.txt 的套件
pip3 install -r requirements.txt
```

安裝flask-restful

```
pip3 install flask-restful
```

安裝jwt
```
 pip3 install PyJWT

 ```
 ##### 參考資料
 [Flask + PyJWT 实现基于Json Web Token的用户认证授权](https://www.thatyou.cn/flask-pyjwt-%E5%AE%9E%E7%8E%B0%E5%9F%BA%E4%BA%8Ejson-web-token%E7%9A%84%E7%94%A8%E6%88%B7%E8%AE%A4%E8%AF%81%E6%8E%88%E6%9D%83/)


