from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# This allows your Vercel frontend to talk to this backend
origins = [
    "http://localhost:3000",
    "https://mcc-web.vercel.app" # We will update this later with your real Vercel URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello from the MCC Event Hub Backend!"}