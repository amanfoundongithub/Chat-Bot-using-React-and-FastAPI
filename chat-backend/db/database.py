from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args = {
        "check_same_thread" : False 
    }
)

SessionLocal = sessionmaker(bind = engine, autoflush = False, autocommit = False) 