import click
from flask import Blueprint
from app.extensions import db
from app.models import User

bp = Blueprint("commands", __name__)

@bp.cli.command("seed")
def seed():
    user = db.session.get(User, 1)
    if user is None:
        db.session.add(User(id=1))
        db.session.commit()
    click.echo("Seed OK")
