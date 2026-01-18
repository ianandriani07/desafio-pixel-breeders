from . import bp
from app.models import Rating
from flask import request, jsonify
from app.services.ratings_service import validate_json
from app.extensions import db
from sqlalchemy.exc import SQLAlchemyError, IntegrityError

@bp.get('/<int:movie_id>')
def get_rating(movie_id):

    user_id = 1

    rating = Rating.query.filter_by(
        user_id=user_id,
        tmdb_movie_id=movie_id
    ).first()

    if rating:
        return jsonify({
            "movie_id": rating.tmdb_movie_id,
            "rating": rating.rating, 
        }), 200

    return jsonify({
        "error": "Rating not found",
        "movie_id": movie_id
    }), 404

@bp.get('/')
def get_all_ratings():
    
    user_id = 1

    ratings = Rating.query.filter_by(
        user_id=user_id
    ).all()

    if not ratings:
        return jsonify({
            "error": "Ratings not found for this user"
        }), 404

    return jsonify([r.to_dict() for r in ratings]), 200



@bp.put("/<int:movie_id>", strict_slashes=False)
def upsert_rate(movie_id):

    data = request.get_json(silent=True)
    if data is None:
        return {"error": "Body must be JSON (Content-Type: application/json)"}, 400
    required_fields = ("rating",)
        
    error_fields = validate_json(data, required_fields)
        
    if error_fields:
        return error_fields

    rating_value = data["rating"]

    user_id = 1 

    if not isinstance(rating_value, (int, float)) or not (1 <= rating_value <= 5):
        return {"error": "Rating must be between 1 and 5"}, 400

    previous_rating = Rating.query.filter_by(
        user_id=user_id,
        tmdb_movie_id=movie_id
    ).first()

    try:
        if previous_rating:
            rating = previous_rating
            rating.rating = rating_value
            status = 200
        else:
            rating = Rating(
                user_id=user_id,
                tmdb_movie_id = movie_id,
                rating=rating_value
            )
            db.session.add(rating)
            status = 201

        db.session.commit()

    except IntegrityError:
        db.session.rollback()
        return {"error": "Conflict"}, 409
    except SQLAlchemyError:
        db.session.rollback()
        return {"error": "Database error"}, 500

    return jsonify(
        rating.to_dict()
    ), status

@bp.delete('/<int:movie_id>')
def delete_rating(movie_id):

    user_id = 1

    rating = Rating.query.filter_by(
        user_id=user_id,
        tmdb_movie_id=movie_id
    ).first()

    if rating:
        db.session.delete(rating)
        db.session.commit()
        return "", 204

    return "", 204


