from gevent import monkey  # nopep8
monkey.patch_all()  # nopep8

from celery import Celery
from controllers.user import bp_c_user
from controllers.setting import bp_c_setting
from controllers.participate import bp_c_participate
from controllers.chat_log import bp_c_chat_log
from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='../front-end/build', static_url_path='/')
CORS(app, origins=[os.getenv('DEV_ORIGIN'), os.getenv('PROD_ORIGIN')])

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['JWT_ALG'] = os.getenv('JWT_ALG')


@app.route('/')
def index():
  return app.send_static_file('index.html')


@app.errorhandler(400)
def bad_request(e):
  return app.send_static_file('index.html')


@app.errorhandler(500)
def internal_error(e):
  return app.send_static_file('index.html')


app.register_blueprint(bp_c_user, url_prefix='/api')
app.register_blueprint(bp_c_setting, url_prefix='/api')
app.register_blueprint(bp_c_participate, url_prefix='/api')
app.register_blueprint(bp_c_chat_log, url_prefix='/api')

socket_io = SocketIO(app, cors_allowed_origins=[os.getenv('DEV_ORIGIN'), os.getenv(
    'PROD_ORIGIN')], async_mode='gevent', logger=True, message_queue=os.getenv('REDIS_URL_DEV'))

celery_app = Celery(os.getenv('CELERY_APP_NAME'), broker=os.getenv('REDIS_URL_DEV'))

from controllers import socket_events  # nopep8
