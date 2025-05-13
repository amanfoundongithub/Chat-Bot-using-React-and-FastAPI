from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime

from pydantic import BaseModel
from typing import List, Optional

Base = declarative_base()


# User Chat Meta data
class Chat(Base):
    
    __tablename__ = "chats" 
    
    id         = Column(Integer, primary_key = True, index = True) 
    title      = Column(String, nullable = False) 
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user_id    = Column(Integer, ForeignKey("users.id"))
    
    # Relationship to messages
    messages = relationship("Message", back_populates="chat", cascade="all, delete-orphan")
    
    # Relationship
    user = relationship("User", back_populates="chats")
    

# User Chats
class Message(Base):
    
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key = True, index = True)
    chat_id = Column(String, ForeignKey('chats.id'), nullable=False)  
    is_user = Column(Boolean, nullable=False)  
    content = Column(Text, nullable=False)  
    created_at = Column(DateTime, default=datetime.utcnow)  
    
    # Relationship to Chat
    chat = relationship("Chat", back_populates="messages")
    

    

# User Data 
class User(Base):
    
    __tablename__ = "users" 
    
    id       = Column(Integer, primary_key = True, index = True) 
    name     = Column(String, nullable = False)
    email    = Column(String, nullable = False, unique = True) 
    password = Column(String, nullable = False) 
    gender   = Column(String, nullable = False)
    
    dob      = Column(DateTime, nullable = False) 
    
    # Relationship to chat
    chats    = relationship("Chat", back_populates="user", cascade="all, delete-orphan")
    
    
    
    


## API request models
class ChatCreate(BaseModel):
    title : str 
    user_id : str 
        
class ChatUpdate(BaseModel):
    title : str 

class MessageSend(BaseModel):
    is_user : bool  
    content : str 

class MessageHistory(BaseModel):
    id: int 
    title: str
    created_at: datetime
    updated_at: datetime
    messages: List[MessageSend]  
    

## API request user
class UserCreate(BaseModel):
    name : str
    email :str 
    password : str
    gender : str
    
    dob : datetime
