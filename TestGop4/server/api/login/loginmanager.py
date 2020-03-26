
from lib.user import *

# 測試用的


class LoginMagager():
    def __init__(self):
        self.__testuserdata()

    def __testuserdata(self):
        Users.append(User(1, 'ttom0', '1234'))
        Users.append(User(2, 'terry0', '1234'))
        Users.append(User(3, 'tommy0', '1234'))
        # print("Users=", Users)

    def CkeckUserIsExist(self, data):
        for x in Users:
            if x.username == data['username'] and x.password == data['password']:
                return x
        return None


LoginMgr = LoginMagager()
