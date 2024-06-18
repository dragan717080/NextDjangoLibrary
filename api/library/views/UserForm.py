from django.forms import *


class UserForm(Form):
    username = CharField(label="username", max_length=20)
    email = EmailField(label="email", max_length=30)
    password_hash = CharField(label="password")
    avatar = FileField(label="avatar", required=False)
