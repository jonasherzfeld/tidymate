from datetime import datetime
from flask import Blueprint, render_template, request, flash, redirect, url_for
from models import User
from flask_login import login_user, login_required, logout_user, current_user
from config import fb_auth
from view_models import UserViewModel

auth = Blueprint('auth', __name__)


@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        try:
            user_data = fb_auth.sign_in_with_email_and_password(email, password)
            print(user_data)
        except Exception as e:
            print(e)
            flash(f'Incorrect credentials', category='error')
            return redirect(url_for('auth.login'))

        if user_data["registered"]:
            vm = UserViewModel()
            user_db = vm.get(user_data['localId'])
            user = User(id=user_data['localId'],
                    email=user_data['email'],
                    first_name=user_db.first_name,
                    joined_on=user_db.joined_on
                    )
            flash('Logged in successfully!', category='success')
            login_user(user, remember=True)
            return redirect(url_for('views.home'))
        else:
            flash('Email does not exist.', category='error')

    return render_template("login.html", user=current_user)


@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))


@auth.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        email = request.form.get('email')
        first_name = request.form.get('firstName')
        password1 = request.form.get('password1')
        password2 = request.form.get('password2')

        vm = UserViewModel()
        user = vm.filter(email)
        if user:
            flash('Email already exists.', category='error')
        elif len(email) < 4:
            flash('Email must be greater than 3 characters.', category='error')
        elif len(first_name) < 2:
            flash('First name must be greater than 1 character.', category='error')
        elif password1 != password2:
            flash('Passwords don\'t match.', category='error')
        elif len(password1) < 7:
            flash('Password must be at least 7 characters.', category='error')
        else:
            fb_user = fb_auth.create_user_with_email_and_password(email, password1)
            new_user = User(id=fb_user["localId"],
                            email=email,
                            first_name=first_name,
                            joined_on=datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
            vm.set(fb_user["localId"], new_user)
            login_user(new_user, remember=True)
            flash('Account created!', category='success')
            return redirect(url_for('views.home'))

    return render_template("register.html", user=current_user)
