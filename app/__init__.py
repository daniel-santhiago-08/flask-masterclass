from flask import Flask
from flask_bootstrap import Bootstrap
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from filtros import format_date

bootstrap = Bootstrap()
db = SQLAlchemy()
login_manager = LoginManager()

def create_app():
    app = Flask(__name__,
                template_folder='templates',
                static_folder='static'
                )
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = "Chave_Secreta"
    app.jinja_env.filters['formatdate'] = format_date

    db.init_app(app)
    login_manager.init_app(app)
    bootstrap.init_app(app)

    from app import routes
    routes.init_app(app)

    return app

