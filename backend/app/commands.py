import click
from flask.cli import AppGroup
from app.extensions import db
from app.models import User

commands = AppGroup("commands")

@commands.command("seed")
def seed():
    user = db.session.get(User, 1)
    if user is None:
        db.session.add(User(id=1))
        db.session.commit()
    click.echo("Seed OK")
