import re
with open('modules/auth/auth_service.py', 'r') as f:
    text = f.read()

text = text.replace('from sqlalchemy.orm import Session', 'from sqlalchemy.orm import Session\nfrom fastapi import HTTPException')
text = re.sub(r'raise Exception\("(.*?)"\)', r'raise HTTPException(status_code=400, detail="\1")', text)

with open('modules/auth/auth_service.py', 'w') as f:
    f.write(text)
