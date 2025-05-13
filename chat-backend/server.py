from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from sqlalchemy.orm import Session

# Import from LLM API
from llm.api import LLMRequest, generate_streaming_llm_response

# Import from DB
from db.database import engine, SessionLocal
from db.models   import Chat, ChatCreate, ChatUpdate, Base 
from db.models   import Message, MessageSend, MessageHistory
from db.models   import User, UserCreate

# Import from OTP service
from security.otpService import OTPRequest, OTPVerify, otp_store, SMTP_USER, SMTP_HOST, SMTP_PASS, SMTP_PORT

# Import other services 
from string import digits
from random import choices
from email.message import EmailMessage
from passlib.context import CryptContext

import aiosmtplib

# Bind base class to the engine 
Base.metadata.create_all(bind = engine) 

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
def hash_password(password: str) -> str:
    return pwd_context.hash(password)


# Create an FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



def get_db():
    db = SessionLocal()
    try:
        yield db 
    except:
        raise  
    finally:
        db.close() 
    
    
# Bind it to the controllers
@app.get("/hello")
async def hello_world():
    """
    A tester route to test the health of the server 
    """
    
    return {
        "message" : "Hello from server!"
    }
    
    
###########################################
@app.post("/otp/generate")
async def generate_otp_api(request : OTPRequest):
    email = request.email 
    
    # Generate 6 digit OTP
    otp = ''.join(choices(digits, k=6))
    otp_store[email] = otp 
    
    # Email message composition 
    message = EmailMessage()
    message["From"] = SMTP_USER
    message["To"] = email
    message["Subject"] = "Your Verification Code"
    message.set_content(f"Hello\nGreeting from LLM Co!\nYour OTP for Email verification is: {otp}")

    try:
        await aiosmtplib.send(
            message,
            hostname=SMTP_HOST,
            port=SMTP_PORT,
            start_tls=True,
            username=SMTP_USER,
            password=SMTP_PASS,
        )
        return {"success": True}
    except Exception as e:
        print(f"Error sending email: {e}")
        raise HTTPException(status_code=500, detail="Failed to send OTP")
    

@app.post("/otp/verify")
async def verify_otp_api(request : OTPVerify):
    email = request.email
    otp = request.otp
    valid = otp_store.get(email) == otp
    if valid:
        # Remove to prevent reuse
        otp_store.pop(email, None)
    return {"valid": valid}
###########################################

@app.post("/user/create")
async def create_user_api(details : UserCreate, db : Session = Depends(get_db)):
    # Check if user already exists
    db_user = db.query(User).filter(User.email == details.email).first()
    
    if db_user:
        raise HTTPException(
            status_code = 400,
            detail="Email already registered"
        )
    
    # Hash password
    hashed_password = hash_password(details.password)
    
    # Create user instance
    new_user = User(
        name = details.name,
        email = details.email,
        password = hashed_password,
        gender = details.gender,
        dob = details.dob
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user 
    


@app.post("/llm/generate")
async def generate_llm_response_api(request : LLMRequest):
    try:
        return StreamingResponse(
            generate_streaming_llm_response(request),
            media_type = "text/plain"
        )
    
    except Exception as e:
        raise HTTPException(status_code = 500,
                             detail = {
                                 "message" : str(e)
                             })
        
@app.post("/chat/create")
async def create_app_api(chat : ChatCreate, db : Session = Depends(get_db)):
    new_chat = Chat(title = chat.title, user_id = chat.user_id) 
    db.add(new_chat)
    db.commit() 
    db.refresh(new_chat)
    
    return new_chat

@app.get("/chat/{user_id}/all")
async def get_all_chats_api(user_id: str, db: Session = Depends(get_db)):
    chats = db.query(Chat).filter(Chat.user_id == int(user_id)).all()
    
    if not chats:
        raise HTTPException(status_code=404, detail="No chats found for this user")
    
    return chats


@app.put("/chat/{chat_id}/edit/name")
async def change_title_api(chat_id : str,request : ChatUpdate, db : Session = Depends(get_db)):
    chat = db.query(Chat).filter(Chat.id == int(chat_id)).first()
    
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    chat.title = request.title
    db.commit()
    db.refresh(chat) 
    
    return chat 

@app.post("/chat/{chat_id}/message/send")
async def send_message_api(chat_id : str, message : MessageSend, db : Session = Depends(get_db)):
    message = Message(chat_id = int(chat_id), is_user = message.is_user, content = message.content)
    db.add(message)
    db.commit()
    db.refresh(message)
    
    return message 

@app.get("/chat/{chat_id}/message/all", response_model = MessageHistory)
async def get_all_message_history(chat_id : str, db : Session = Depends(get_db)):
    chat = db.query(Chat).filter(Chat.id == int(chat_id)).first()
    if chat:
        return chat 
    
    raise HTTPException(status_code = 404, detail = "Chat not found")