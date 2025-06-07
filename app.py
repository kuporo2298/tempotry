from flask import Flask, render_template, request, jsonify, redirect, url_for, session, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-here')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///course_planner.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# Database Models
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='teacher')
    approved = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class SignupRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class CoursePlan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    subject = db.Column(db.String(200), nullable=False)
    department = db.Column(db.String(100), nullable=False)
    course_code = db.Column(db.String(20))
    objectives = db.Column(db.Text)  # JSON string
    topics = db.Column(db.Text)  # JSON string
    assessment_methods = db.Column(db.Text)  # JSON string
    references = db.Column(db.Text)  # JSON string
    schedule = db.Column(db.Text)  # JSON string
    status = db.Column(db.String(20), default='pending')
    comments = db.Column(db.Text)
    revision_requests = db.Column(db.Text)  # JSON string
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    reviewed_by = db.Column(db.String(100))
    notification_read = db.Column(db.Boolean, default=False)
    version = db.Column(db.Integer, default=1)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Routes
@app.route('/')
@login_required
def index():
    if current_user.role == 'dean':
        return redirect(url_for('dean_dashboard'))
    elif current_user.role == 'admin':
        return redirect(url_for('admin_dashboard'))
    
    # Get user's course plans
    course_plans = CoursePlan.query.filter_by(created_by=current_user.id).all()
    
    # Convert JSON strings back to lists/dicts
    for plan in course_plans:
        plan.objectives = json.loads(plan.objectives) if plan.objectives else []
        plan.topics = json.loads(plan.topics) if plan.topics else []
        plan.assessment_methods = json.loads(plan.assessment_methods) if plan.assessment_methods else []
        plan.references = json.loads(plan.references) if plan.references else []
        plan.schedule = json.loads(plan.schedule) if plan.schedule else []
        plan.revision_requests = json.loads(plan.revision_requests) if plan.revision_requests else []
    
    return render_template('index.html', course_plans=course_plans)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        
        # Check for admin login
        if email == 'admin@gmail.com' and password == 'admin':
            # Create a temporary admin user for the session
            admin_user = User(id=0, name='Administrator', email=email, role='admin', approved=True)
            login_user(admin_user)
            return redirect(url_for('admin_dashboard'))
        
        user = User.query.filter_by(email=email, approved=True).first()
        
        if user and check_password_hash(user.password_hash, password):
            login_user(user)
            if user.role == 'dean':
                return redirect(url_for('dean_dashboard'))
            else:
                return redirect(url_for('index'))
        else:
            flash('Invalid credentials or your account has not been approved yet.', 'error')
    
    return render_template('login.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']
        confirm_password = request.form['confirm_password']
        role = request.form['role']
        
        # Validation
        if password != confirm_password:
            flash('Passwords do not match', 'error')
            return render_template('signup.html')
        
        # Check if email already exists
        if User.query.filter_by(email=email).first() or SignupRequest.query.filter_by(email=email).first():
            flash('An account with this email already exists or is pending approval', 'error')
            return render_template('signup.html')
        
        # Create signup request
        password_hash = generate_password_hash(password)
        signup_request = SignupRequest(
            name=name,
            email=email,
            password_hash=password_hash,
            role=role
        )
        
        db.session.add(signup_request)
        db.session.commit()
        
        flash('Your account request has been submitted and is pending approval', 'success')
        return redirect(url_for('login'))
    
    return render_template('signup.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/admin')
@login_required
def admin_dashboard():
    if current_user.role != 'admin' and current_user.id != 0:  # 0 is our temp admin ID
        return redirect(url_for('index'))
    
    signup_requests = SignupRequest.query.order_by(SignupRequest.created_at.desc()).all()
    users = User.query.order_by(User.created_at.desc()).all()
    
    return render_template('admin.html', signup_requests=signup_requests, users=users)

@app.route('/admin/approve/<int:request_id>', methods=['POST'])
@login_required
def approve_user(request_id):
    if current_user.role != 'admin' and current_user.id != 0:
        return redirect(url_for('index'))
    
    signup_request = SignupRequest.query.get_or_404(request_id)
    
    # Create new user
    new_user = User(
        name=signup_request.name,
        email=signup_request.email,
        password_hash=signup_request.password_hash,
        role=signup_request.role,
        approved=True
    )
    
    db.session.add(new_user)
    db.session.delete(signup_request)
    db.session.commit()
    
    flash(f'User {new_user.name} has been approved', 'success')
    return redirect(url_for('admin_dashboard'))

@app.route('/admin/reject/<int:request_id>', methods=['POST'])
@login_required
def reject_user(request_id):
    if current_user.role != 'admin' and current_user.id != 0:
        return redirect(url_for('index'))
    
    signup_request = SignupRequest.query.get_or_404(request_id)
    db.session.delete(signup_request)
    db.session.commit()
    
    flash('User request has been rejected', 'success')
    return redirect(url_for('admin_dashboard'))

@app.route('/dean')
@login_required
def dean_dashboard():
    if current_user.role != 'dean':
        return redirect(url_for('index'))
    
    course_plans = CoursePlan.query.all()
    
    # Convert JSON strings back to lists/dicts
    for plan in course_plans:
        plan.objectives = json.loads(plan.objectives) if plan.objectives else []
        plan.topics = json.loads(plan.topics) if plan.topics else []
        plan.assessment_methods = json.loads(plan.assessment_methods) if plan.assessment_methods else []
        plan.references = json.loads(plan.references) if plan.references else []
        plan.schedule = json.loads(plan.schedule) if plan.schedule else []
        plan.revision_requests = json.loads(plan.revision_requests) if plan.revision_requests else []
    
    return render_template('dean.html', course_plans=course_plans)

@app.route('/api/generate-course-plan', methods=['POST'])
@login_required
def generate_course_plan():
    data = request.get_json()
    subject = data.get('subject')
    department = data.get('department')
    
    if not subject or not department:
        return jsonify({'error': 'Subject and department are required'}), 400
    
    # Generate course code
    course_code = f"{department[:3].upper()}{str(hash(subject) % 400 + 100)}"
    
    # Mock AI-generated content (you can integrate with actual AI service)
    generated_plan = {
        'subject': subject,
        'department': department,
        'courseCode': course_code,
        'objectives': [
            f'Understand key concepts and principles related to {subject}',
            f'Develop critical thinking and analytical skills in {department}',
            f'Apply theoretical knowledge of {subject} to practical scenarios',
            f'Evaluate current trends and developments in {subject}',
            f'Communicate effectively about {subject} using appropriate terminology'
        ],
        'topics': [
            f'Introduction to {subject} and its significance',
            f'Historical development and theoretical foundations of {subject}',
            f'Core principles and methodologies in {subject}',
            f'Contemporary issues and applications in {subject}',
            f'Research methods in {department} with focus on {subject}'
        ],
        'assessmentMethods': [
            'Written examinations (35%)',
            'Research papers and assignments (30%)',
            'Class participation and discussions (15%)',
            'Group projects and presentations (20%)'
        ],
        'references': [
            f'Core textbooks on {subject}',
            f'Academic journals and research papers in {department}',
            f'Case studies and practical examples related to {subject}',
            f'Online resources and databases for {subject}'
        ],
        'schedule': [
            {'week': 1, 'topic': f'Introduction to {subject}', 'activities': 'Lecture, Group Discussion'},
            {'week': 2, 'topic': 'Fundamental concepts', 'activities': 'Lecture, Case Studies'},
            {'week': 3, 'topic': 'Theoretical frameworks', 'activities': 'Lecture, Group Activities'}
        ]
    }
    
    return jsonify(generated_plan)

@app.route('/api/upload-course-plan', methods=['POST'])
@login_required
def upload_course_plan():
    data = request.get_json()
    
    course_plan = CoursePlan(
        subject=data['subject'],
        department=data['department'],
        course_code=data.get('courseCode'),
        objectives=json.dumps(data['objectives']),
        topics=json.dumps(data['topics']),
        assessment_methods=json.dumps(data['assessmentMethods']),
        references=json.dumps(data['references']),
        schedule=json.dumps(data.get('schedule', [])),
        created_by=current_user.id
    )
    
    db.session.add(course_plan)
    db.session.commit()
    
    return jsonify({'success': True, 'id': course_plan.id})

@app.route('/api/course-plan/<int:plan_id>/approve', methods=['POST'])
@login_required
def approve_course_plan(plan_id):
    if current_user.role != 'dean':
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    comments = data.get('comments', '')
    
    course_plan = CoursePlan.query.get_or_404(plan_id)
    course_plan.status = 'approved'
    course_plan.comments = comments
    course_plan.reviewed_by = current_user.name
    course_plan.notification_read = False
    
    db.session.commit()
    
    return jsonify({'success': True})

@app.route('/api/course-plan/<int:plan_id>/reject', methods=['POST'])
@login_required
def reject_course_plan(plan_id):
    if current_user.role != 'dean':
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    comments = data.get('comments', '')
    
    course_plan = CoursePlan.query.get_or_404(plan_id)
    course_plan.status = 'rejected'
    course_plan.comments = comments
    course_plan.reviewed_by = current_user.name
    course_plan.notification_read = False
    
    db.session.commit()
    
    return jsonify({'success': True})

@app.route('/api/course-plan/<int:plan_id>/request-revision', methods=['POST'])
@login_required
def request_revision(plan_id):
    if current_user.role != 'dean':
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    comments = data.get('comments', '')
    revision_requests = data.get('revisionRequests', [])
    
    course_plan = CoursePlan.query.get_or_404(plan_id)
    course_plan.status = 'revision'
    course_plan.comments = comments
    course_plan.revision_requests = json.dumps(revision_requests)
    course_plan.reviewed_by = current_user.name
    course_plan.notification_read = False
    
    db.session.commit()
    
    return jsonify({'success': True})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
