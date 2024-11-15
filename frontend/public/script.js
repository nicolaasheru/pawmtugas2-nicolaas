// Select the elements needed
const themeToggleButton = document.getElementById('theme-toggle');
const bodyElement = document.body;
const quizCard = document.getElementById('quiz-card');
const flipcardInner = quizCard.querySelector('.flipcard-inner');
const submitButton = document.getElementById('submit-answer');
const resultMessage = document.getElementById('result-message');
const nextQuestionButton = document.getElementById('next-question');
const userAnswerInput = document.getElementById('user-answer');

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Mencegah form dari refresh halaman otomatis
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    // Mengirim data login ke server menggunakan POST request
    fetch('https://github.com/nicolaasheru/pawm2-nicolaas/tree/e498a2cdbf04efd40856ee53ff8586abc1900260/backend/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Login sukses!');
      } else {
        alert('Login gagal, periksa username atau password!');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat login!');
    });
  });
