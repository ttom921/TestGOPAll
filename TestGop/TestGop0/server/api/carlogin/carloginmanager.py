from lib.car import *
# 測試用的


class CarLoginManager():
    def __init__(self):
        self.__testcardata()

    def __testcardata(self):
        Cars.append(Car(1, 'car-888', '1234'))
        Cars.append(Car(2, 'car-999', '1234'))
        Cars.append(Car(3, 'car-777', '1234'))

    def CkeckCarIsExist(self, data):
        for x in Cars:
            if x.username == data['username'] and x.password == data['password']:
                return x
        return None


CarLoginMgr = CarLoginManager()
