from flask import Blueprint

machines = Blueprint('machines', __name__)

from app.machines import views
