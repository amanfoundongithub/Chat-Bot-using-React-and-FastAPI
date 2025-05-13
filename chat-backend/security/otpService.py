from pydantic import BaseModel

otp_store = {}

# Load SMTP credentials from environment
SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USER = "billygates124356@gmail.com"
SMTP_PASS = "fvly kegh myrn vroc"

# Pydantic Methods
class OTPRequest(BaseModel):
    email : str 
    
class OTPVerify(BaseModel):
    email : str 
    otp : str 
    