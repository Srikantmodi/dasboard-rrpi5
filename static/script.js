document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('uploadBtn').addEventListener('click', uploadFile);
});

function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select a file!');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    fetch('/uploads', {
        method: 'POST',
        body: formData
    })
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
    })
    .then(data => {
        if (data.error) {
            document.getElementById('result').textContent = "❌ " + data.error;
        } else {
            document.getElementById('result').textContent = JSON.stringify(data, null, 2);
        }
    })
    .catch(err => {
        console.error(err);
        alert('Something went wrong: ' + err.message);
    });
}
