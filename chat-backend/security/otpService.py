from pydantic import BaseModel

otp_store = {}

# Load SMTP credentials from environment

# Pydantic Methods
class OTPRequest(BaseModel):
    email : str 
    
class OTPVerify(BaseModel):
    email : str 
    otp : str 
    