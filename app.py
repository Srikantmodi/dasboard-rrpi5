from flask import Flask, request, render_template, jsonify
from werkzeug.utils import secure_filename
from flask_cors import CORS  # Import CORS
import os
import pandas as pd
import re
import plotly.express as px  

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Define the permanent upload folder
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Allowed extensions (optional)
ALLOWED_EXTENSIONS = {'csv', 'xlsx', 'txt', 'json'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/uploads', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        return jsonify({'message': f'File uploaded and saved to {filepath}'}), 200
    else:
        return jsonify({'error': 'Invalid file type'}), 400

@app.route('/chart', methods=['POST'])
def chart():
    data = request.json
    df = pd.DataFrame(data['data'])
    fig = px.bar(df, x=data['x'], y=data['y'], title='AI Chart')
    return jsonify(fig.to_dict())

def extract_table_from_text(text):
    lines = text.strip().split('\n')
    rows = []
    for line in lines:
        match = re.match(r'Date: (.*), Category: (.*), Amount: \$([0-9\.]+)', line)
        if match:
            rows.append({
                'Date': match.group(1),
                'Category': match.group(2),
                'Amount': float(match.group(3))
            })
    return pd.DataFrame(rows)

def generate_summary(df):
    summary = {}
    for col in df.select_dtypes(include='number').columns:
        summary[col] = {
            'mean': df[col].mean(),
            'max': df[col].max(),
            'min': df[col].min()
        }
    return summary

if __name__ == '__main__':
    app.run(debug=True)
