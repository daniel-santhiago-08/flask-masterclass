from flask import Flask, request, Response, redirect, url_for, render_template
from flask_bootstrap import Bootstrap

app = Flask(__name__)
Bootstrap(app)

@app.route('/')
def index():
    return "<a href='/posts'>Posts</a>"

@app.route('/redirect')
def redirect_url():
    return redirect(url_for('response'))


@app.route('/response')
def response():
    return render_template('response.html')

@app.route('/posts')
@app.route('/posts/<int:id>')
def posts(id=0):
    titulo = request.args.get('titulo')
    data = dict(
        path=request.path,
        referrer=request.referrer,
        content_type=request.content_type,
        method=request.method,
        titulo = titulo,
        id = id
    )
    return data

if __name__ == '__main__':
    app.run(debug=True)