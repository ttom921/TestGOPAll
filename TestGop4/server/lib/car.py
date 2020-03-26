import jwt
import datetime
from flask import current_app as app


class Car():
    def __init__(self, id, username, password):
        self.id = id
        self.username = username
        self.password = password

    def __str__(self):
        return "Car(id='%s')" % self.id


Cars = []
