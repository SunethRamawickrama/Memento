from flask import Blueprint, jsonify, request, send_file
import requests
from pathlib import Path
from io import BytesIO
from .models import Memory, db

main = Blueprint('main', __name__)

@main.route('/api/test', methods=['POST'])   
def test():
    return('test')
    
