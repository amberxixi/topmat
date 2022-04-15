from flask import Flask
from pymongo import MongoClient
from pprint import pprint
from flask_restful import Api
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from pymodm import connect
from server.config import BaseConfig, DevelopmentConfig

# Initialize app and api
config = DevelopmentConfig
app = Flask(__name__)
api = Api(app)
app.config.from_object(config)
limiter = Limiter(app, key_func=get_remote_address)

# database configuration and initialization
client = MongoClient(config.DB_URI)
db = client.topmat
connect(config.DB_URI)

from server.resources import material
api.add_resource(material.Materials, '/materials/search')
api.add_resource(material.MaterialDetail, '/material')

