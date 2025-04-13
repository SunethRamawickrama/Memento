from flask import Blueprint, jsonify, request, send_file
import requests
from pathlib import Path
from io import BytesIO
from .models import Memory, RecallResponse, db
import json
from assistants.summarizer.summarizer import main as generate_summary
import random
import tempfile
import os
from assistants.transcriber import main as transcribe_audio
from assistants.evaluator import main as evaluate_recall


main = Blueprint('main', __name__)

@main.route('/api/memories', methods=['POST'])   
def add_memory():
    data = request.json
    title = data.get('title')
    person = data.get('person')

    if not title or not person:
        return jsonify({"message": "Missing required fields"}), 400
    
    gemini_response = generate_summary(title, person)  # This returns a list with one object
    print('Gemini response is getting correctly ' + gemini_response)

    rec_qs = gemini_response['recall_questions']

    new_memory = Memory(
        title=title, 
        person=person,
        recall_questions=rec_qs
    )
    
    # Add user to session and commit to database
    db.session.add(new_memory)
    db.session.commit()

    return jsonify({
        "memory": new_memory
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
    
@main.route('/api/submit-responses', methods=['POST'])
def submit_responses():
    try:
        questions = request.form.getlist('questions')
        files = request.files.getlist('audios')

        results = []

        for i, file in enumerate(files):
            q_data = json.loads(questions[i])
            question = q_data['question']
            expected_answer = q_data['answer']

            # Save audio temporarily
            with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp_audio:
                file.save(temp_audio.name)
                audio_path = temp_audio.name

            # Transcribe
            transcript = transcribe_audio(audio_path)

            # Evaluate with Gemini
            analysis = evaluate_recall(question, expected_answer, transcript)

            # Save to DB
            recall_response = RecallResponse(
                question=question,
                expected_answer=expected_answer,
                user_answer=transcript,
                accuracy_score=analysis['accuracy'],
                confidence_score=analysis.get('confidence', 0)
            )
            db.session.add(recall_response)

            results.append({
                "question": question,
                "expected_answer": expected_answer,
                "transcribed": transcript,
                "accuracy": analysis['accuracy']
            })

            os.remove(audio_path)  # Cleanup

        db.session.commit()

        return jsonify(results)

    except Exception as e:
        print("Error submitting responses:", e)
        return jsonify({"error": "Internal server error"}), 500