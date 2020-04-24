from flask_wtf import FlaskForm
from wtforms.fields.html5 import EmailField
from wtforms.fields import StringField, PasswordField, BooleanField, SubmitField, SelectField
from wtforms.validators import Length, Email, DataRequired
from app.models import Book

class LoginForm(FlaskForm):
    email = EmailField("E-mail", validators=[
        Email()
    ])
    password = PasswordField("Senha", validators=[
        Length(3,6,"O campo deve conter de 3 a 6 caracteres.")
    ])
    remember = BooleanField("Permanecer Conectado")
    submit = SubmitField("Logar")

class RegisterForm(FlaskForm):
    name = StringField("Nome Completo", validators=[
        DataRequired("O campo é obrigatório")
    ])
    email = EmailField("E-mail", validators=[
        Email()
    ])
    password = PasswordField("Senha", validators=[
        Length(3, 6, "O campo deve conter de 3 a 6 caracteres.")
    ])
    submit = SubmitField("Cadastrar")

class BookForm(FlaskForm):
    name = StringField("Nome do Livro", validators=[
        DataRequired("O campo é obrigatório")
    ])
    submit = SubmitField("Salvar")

class UserBookForm(FlaskForm):
    book = SelectField("Livro", coerce=int)
    submit = SubmitField("Salvar")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        books = Book.query.all()
        self.book.choices = [(book.id, book.name) for book in books]