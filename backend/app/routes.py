from flask import Blueprint, jsonify, request, send_file
import requests
from pathlib import Path
from io import BytesIO
from .models import Memory, db

main = Blueprint('main', __name__)

@main.route('/api/memories', methods=['POST'])   
def add_memory():
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

@main.route('/api/get-all-memories', methods=['GET'])  
def get_all_memories():
    try:
        all_memories = Memory.query.all()
        if not all_memories:
            return jsonify([])
        
        result = [
            {
                "title": memory.title,
                "person": memory.person,
                "created_at": memory.created_at.isoformat()  
            }
            for memory in all_memories
        ]
        return jsonify(result)
    except Exception as e:
        print("Error fetching memories:", e)
        return jsonify({"error": "Internal server error"}), 500  
