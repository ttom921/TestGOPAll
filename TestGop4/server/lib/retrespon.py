def resData(status, msg, tokendata=None):
    if tokendata:
        responseObject = {
            "status": status,
            "message": msg,
            "auth_token": tokendata
        }
        return responseObject
    else:
        responseObject = {
            "status": status,
            "message": msg,
        }
        return responseObject
