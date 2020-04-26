from flask import Blueprint
auth = Blueprint('auth', __name__)


# db.create_all()
# db.session.commit()

from . import views
