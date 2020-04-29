from flask import Flask, render_template
from flask_bootstrap import Bootstrap
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from filtros import format_date

from flask import Flask
from flask_mail import Mail, Message


# from sqlalchemy.ext.automap import automap_base
# from sqlalchemy.orm import Session
# from sqlalchemy import create_engine


bootstrap = Bootstrap()
db = SQLAlchemy()
login_manager = LoginManager()
mail = Mail()

def create_app():
    app = Flask(__name__,
                template_folder='templates',
                static_folder='static'
                )
    # app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://daniel_santhiago:DWhouse130_@dolce-gusto-medium.czm3momztmix.sa-east-1.rds.amazonaws.com:5432/machines_crawler'
    app.config['SQLALCHEMY_BINDS']  = {
        'machines_old': 'sqlite:///pythonsqlite.db'
    }
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = "Chave_Secreta"
    app.jinja_env.filters['formatdate'] = format_date


    config = {
        "MAIL_SERVER": "smtp.ethereal.email",
        "MAIL_PORT": 587,
        "MAIL_USE_TLS": True,
        "MAIL_DEBUG": True,
        "MAIL_USERNAME": "randall.hudson@ethereal.email",
        "MAIL_PASSWORD": "Z2YAXZZwuxY2mp8BSx",
        "MAIL_DEFAULT_SENDER": "Daniel <danielsanth@hotmail.com>"
    }

    app.config.update(config)

    db.init_app(app)
    login_manager.init_app(app)
    bootstrap.init_app(app)
    mail.init_app(app)

    from app import routes
    routes.init_app(app)

    # @app.route("/sendmail")
    # def sendmail():
    #     msg = Message(
    #         subject="Bem-vindo",
    #         sender=app.config['MAIL_DEFAULT_SENDER'],
    #         # recipients=['daniel.santhiago@thrive-wmccann.com'],
    #         recipients=['danieldeveloper01@gmail.com'],
    #         body="E-mail de SMTP"
    #
    #     )
    #     mail.send(msg)
    #     return "E-mail enviado com sucesso"

    # @app.route('/test')
    # def base():
    #
    #     machines = db.session.query(t_price_crawler_evolution).all()
    #     print(machines)
    #     # return render_template('base.html', myusers=myusers)
    #     return "Teste"


    return app


