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
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        document.getElementById('result').textContent = "❌ " + data.error;
      } else {
        document.getElementById('result').textContent = JSON.stringify(data, null, 2);
      }
    })
    .catch(err => {
      console.error(err);
      alert('Something went wrong.');
    });
  }
  