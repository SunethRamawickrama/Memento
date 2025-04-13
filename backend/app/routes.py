from flask import Blueprint, jsonify, request, send_file
import requests
from pathlib import Path
from io import BytesIO

main = Blueprint('main', __name__)

@main.route('/api/test', methods=['POST'])   
def test():
    return('test')

import os
from supabase import create_client, Client

@main.route('/api/test1', methods=['GET'])   
def get_user():
    url: str = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    key: str = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    supabase: Client = create_client(url, key)

    response = (
        supabase.table("profiles")
        .select("*")
        .execute()
    )
    return jsonify(response.data)