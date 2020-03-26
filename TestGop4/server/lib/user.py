
import jwt
import datetime
from flask import current_app as app


class User():
    def __init__(self, id, username, password):
        self.id = id
        self.username = username
        self.password = password

    def __str__(self):
        return "User(id='%s')" % self.id

    # def encode_auth_token(self, user_id):
    #     """
    #     Generates the Auth Token
    #     :return:string
    #     """
    #     try:
    #         payload = {
    #             'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, seconds=5),
    #             'iat': datetime.datetime.utcnow(),
    #             'iss': 'chsrv',
    #             'data': {
    #                 'id': user_id
    #             }
    #         }

    #         #restoken = jwt.encode(payload, app.secret_key)
    #         # print(restoken)
    #         return jwt.encode(
    #             payload,
    #             app.secret_key,
    #         )
    #     except Exception as e:
    #         return e

    # @staticmethod
    # def decode_auth_token(auth_token):
    #     """
    #     Validate the auth token
    #     :param auth_token:
    #     :return:integer|string
    #     """
    #     try:
    #         payload = jwt.decode(auth_token, app.secret_key)
    #         return payload['sub']
    #     except jwt.ExpiredSignatureError:
    #         return 'Signature expired. Please log in again.'
    #     except jwt.InvalidTokenError:
    #         return 'Invalid token. Please log in again.'


Users = []
