from modules.ai.department_service import detect_department

text = "There are potholes on the road in my area."

department = detect_department(text)

print(department)