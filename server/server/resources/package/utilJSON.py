from flask import json
from bson import ObjectId
import datetime

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)

class UTC2Local():
    def utc2local(utc_time_str, utc_format='%Y-%m-%dT %H:%M:%SZ'):
        utcTime = datetime.datetime.strptime(utc_time_str, utc_format)
        localtime = utcTime + datetime.timedelta(hours=8)
        return localtime.strftime('%Y-%m-%dT %H:%M:%SZ')

encoder = JSONEncoder()
utc2local = UTC2Local()

