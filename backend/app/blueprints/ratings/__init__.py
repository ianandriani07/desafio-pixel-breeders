from flask import Blueprint

bp = Blueprint("ratings", __name__)

from . import routes