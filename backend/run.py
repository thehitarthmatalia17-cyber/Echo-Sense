import uvicorn
import os
import sys

# Ensure current directory is on python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    print("=====================================================")
    print(" Starting EchoSense AI Hearing Screening Backend")
    print(" Tagline: Listen Beyond the Silence.")
    print(" API URL: http://127.0.0.1:8000")
    print(" Docs URL: http://127.0.0.1:8000/docs")
    print("=====================================================")
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=False)
