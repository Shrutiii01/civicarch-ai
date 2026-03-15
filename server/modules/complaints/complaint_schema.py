from pydantic import BaseModel

class ComplaintRequest(BaseModel):

    text: str
    location: str
    pincode: int
    category: str