from config.config import app, db
import auth.register as register


email= input("Email: ")
password= input("Password: ")
print(register.create_user(email, password ))