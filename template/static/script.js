document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('uploadBtn').addEventListener('click', uploadFile);
});

function uploadFile() {
    const fileInput = document.querySelector('input[type="file"]');
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select a file!');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    fetch('http://127.0.0.1:5500/uploads', {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        if (response.ok) {
            console.log('File uploaded successfully!');
            document.getElementById('result').textContent = 'File uploaded successfully!';
        } else {
            console.error('Upload failed:', response.status);
            document.getElementById('result').textContent = `Upload failed: ${response.status}`;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Something went wrong: ' + error.message);
    });
}

const express = require('express');
const app = express();
const multer = require('multer'); // Middleware for handling file uploads.

const upload = multer({ dest: 'uploads/' }); // Destination folder for uploaded files.

app.post('/uploads', upload.single('file'), (req, res) => {
    res.status(200).send('File uploaded successfully!');
});

// Global error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(5500, () => console.log('Server running at http://127.0.0.1:5500'));
