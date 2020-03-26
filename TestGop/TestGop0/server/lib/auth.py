import jwt
import datetime
import time
from flask import current_app, jsonify
from lib.retrespon import *
from lib.user import *


class Auth():
    @staticmethod
    def encode_auth_token(user_id,username=None):
        """
        生成認証Token
        :param user_int: int
        :return: string
        """
        try:
            payload = {
                'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, seconds=10),
                'iat': datetime.datetime.utcnow(),
                'iss': 'chnsrv',
                'data': {
                    'id': user_id,
                    'username':username,
                    'test_data': "testdata"
                }
            }
            return jwt.encode(
                payload,
                current_app.secret_key,
                algorithm='HS256'
            )
        except Exception as e:
            return e

    @staticmethod
    def decode_auth_token(auth_token):
        """
        驗証Token
        :param auth_token:
        :return: integer | string
        """
        try:
            # payload = jwt.decode(auth_token, app.config.get('SECRET_KEY'), leeway=datetime.timedelta(seconds=10))
            # 取消過期時間驗証
            payload = jwt.decode(auth_token, current_app.secret_key, options={
                                 'verify_exp': False})
            if('data' in payload and 'id' in payload['data']):
                return payload
            else:
                raise jwt.InvalidTokenError

        except jwt.ExpiredSignatureError:
            return "Token 過期"
        except jwt.InvalidTokenError:
            return "無效Token"

    def identify(self, request):
        """
        檢查用戶是否合法
        """
        auth_header = request.headers.get('Authorization')
        if(auth_header):
            auth_tokenArr = auth_header.split(" ")
            if (not auth_tokenArr or auth_tokenArr[0] != 'Bearer' or len(auth_tokenArr) != 2):
                result = resData("fail", "請提供正砲的驗証頭信息")
            else:
                auth_token = auth_tokenArr[1]
                payload = self.decode_auth_token(auth_token)
                if not isinstance(payload, str):
                    userid = payload['data']['id']
                    # print(type(userid))
                    user = self.finduser(userid)
                    if(user is None):
                        result = resData("fail", "找不到該用戶")
                    else:
                        result = resData("success", user)
                else:
                    result = resData("fail", payload)
        else:
            result = resData("fail", "沒有提供認証token")
        return result

    @staticmethod
    def finduser(user_id):
        for x in Users:
            if x.id == user_id:
                return x
        return None
