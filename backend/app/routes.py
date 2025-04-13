from flask import Blueprint, jsonify, request, send_file
import requests
from pathlib import Path
from io import BytesIO
from .models import Memory, db

main = Blueprint('main', __name__)

@main.route('/api/test', methods=['POST'])   
def test():
    return('test')
    
@main.route('/api/memories', methods=['POST'])   
def test():
    data = request.json
    title = data.get('title')
    person = data.get('person')

    if not title or not person:
        return jsonify({"message": "Missing required fields"}), 400

    new_memory = Memory(
        title=title, 
        person=person
    )
    
    # Add user to session and commit to database
    db.session.add(new_memory)
    db.session.commit()

    return jsonify({
        "message": "Memory added successfully"
    }), 201
