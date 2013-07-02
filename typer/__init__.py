from flask import Flask

blueprints = ['server']

def create_app():
    app = Flask(__name__)
    for name in blueprints:
        app.register_blueprint(load_blueprint(name))
    return app

def load_blueprint(name):
    blueprint = getattr(__import__('typer.'+name, None, None, ['app']), 'app')
    return blueprint
