from flask import Blueprint, jsonify, request, send_file
import requests
from pathlib import Path
from io import BytesIO
from .models import Memory, db

from assistants.summarizer.summarizer import main as generate_summary
import random


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


@main.route('/api/relive', methods=['GET'])
def relive_memory():
    try:
        all_memories = Memory.query.all()
        if not all_memories:
            return jsonify({"error": "No memories available"}), 404

        random_memory = random.choice(all_memories)

        # Prepare journal_entry (adjust based on your actual field)
        journal_entry = f"{random_memory.title} with {random_memory.person}"

        # Call Gemini to generate recall questions
        gemini_response = generate_summary(journal_entry)  # This returns a list with one object

        if gemini_response and isinstance(gemini_response, list) and 'recall_questions' in gemini_response[0]:
            random_memory.recall_questions = gemini_response[0]['recall_questions']
            db.session.commit()

        result = {
            "title": random_memory.title,
            "person": random_memory.person,
            "created_at": str(random_memory.created_at),
            "recall_questions": random_memory.recall_questions
        }

        return jsonify(result)

    except Exception as e:
        print("Error in /api/relive-memory:", e)
        return jsonify({"error": "Internal Server Error"}), 500