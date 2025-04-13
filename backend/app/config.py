import os

class Config:
  SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://bit:root@localhost:5432/bitcamp')
  SQLALCHEMY_TRACK_MODIFICATIONS = False