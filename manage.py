#!/usr/bin/env python
from flask.ext.script import Manager
from typer import create_app

app = create_app()
manager = Manager(app)

@manager.command
def run():
    app.run(debug=True, use_reloader=True)

@manager.command
def run_public(port=7000):
    app.run(debug=True, use_reloader=True, host='0.0.0.0', port=int(port))

@manager.command
def initdb():
    linkle.model.Base.metadata.create_all(linkle.model.engine)

@manager.command
def dropdb():
    linkle.model.Base.metadata.drop_all(linkle.model.engine)

if __name__ == '__main__':
    manager.run()
