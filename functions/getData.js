fetch('/.netlify/functions/getData')
    .then(response => response.json())
    .then(data => {
        console.log(data); // اینجا جواب Open Router رو می‌گیری
        // مثلاً DOM رو آپدیت کن
        document.getElementById('result').innerText = data.choices[0].message.content;
    })
    .catch(error => console.error('Error:', error));