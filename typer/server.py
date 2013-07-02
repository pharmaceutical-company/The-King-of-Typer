from flask import Blueprint, render_template

app = Blueprint('server', __name__)

@app.route('/')
def main():
    return render_template('welcome.html')

@app.route('/edit')
def edit():
    return render_template('editor.html') 
