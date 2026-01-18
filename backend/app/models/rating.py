from datetime import datetime
from app.extensions import db

class Rating(db.Model):
    __tablename__ = 'ratings'

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        default=1,  
    )
    
    tmdb_movie_id = db.Column(db.Integer, nullable=False, unique=False, index=True)
    rating = db.Column(db.SmallInteger, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.now(), nullable=False)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.now(),
        onupdate=datetime.now(),
        nullable=False,
    )

    __table_args__ = (
        db.CheckConstraint("rating >= 1 AND rating <= 5", name="ck_rating_range"),
        db.UniqueConstraint("user_id", "tmdb_movie_id", name="uq_user_movie_rating"),
    )

    def to_dict(self):
        return {
            "tmdb_movie_id": self.tmdb_movie_id,
            "rating": self.rating,
        }
    
