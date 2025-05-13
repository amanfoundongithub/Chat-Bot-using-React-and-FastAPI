from pydantic import BaseModel

from ollama import ResponseError, Client

# Define the model 
model = "gemma3:4b"

# Initialize the model
client = Client()

class LLMRequest(BaseModel):
    query : str


def generate_streaming_llm_response(request : LLMRequest):
    try: 
        # Get question
        question = request.query 
    
        # Initialize a prompt
        prompt = f"""
        You are an agent designed by Aman Raj, who is a generous person and your name is Jack. 
        Answer the following question: 
        {question}
        """
    
        # Ask the LLM for its response 
        response = client.chat(model = model, 
                           messages = [
                               {
                                   "role" : "user",
                                   "content" : prompt,
                               }
                           ],
                           stream = True)

        # Print each stream of response chunk
        for chunk in response: 
            yield chunk['message']['content']
    
    except ResponseError as e: 
        yield f"FATAL : LLM Response Error. Details:\n{e}"
    
    except Exception as e:
        yield f"FATAL : SERVER Error. Details:\n{e}"
        

