from . import db
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime 
from sqlalchemy.dialects.postgresql import ARRAY as Arr  

class User(db.Model):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(80), unique=True, nullable=False)
    password_hash = Column(String(128), nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    created_at = Column(DateTime, nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Memory(db.Model): 
    __tablename__ = 'memories'
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(12000), nullable=False) 
    summary = Column(String(500), nullable=True)    
    recall_questions = Column(Arr(JSON), nullable=True, default=[])   
    created_at = Column(DateTime, nullable=False)
    person = Column(String(100), nullable=True) 

    def __init__(self, title, summary=None, recall_questions=None, person=None):
        self.title = title
        self.created_at = datetime.now() 
        self.summary = summary
        self.recall_questions = recall_questions or []
        self.person = person 

class RecallResponse(db.Model):
    __tablename__ = 'recall_responses'
    id = Column(Integer, primary_key=True)
    question = Column(String, nullable=False)
    expected_answer = Column(String, nullable=False)
    user_answer = Column(String, nullable=False)
    accuracy_score = Column(Integer)
    confidence_score = Column(Integer)
    memory_id = Column(Integer, ForeignKey('memories.id'))
    memory = relationship('Memory', backref='responses')