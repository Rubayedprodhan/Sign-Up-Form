const form = document.getElementById('signupForm');
const darkModeToggle = document.getElementById('darkModeToggle');
const userInput = document.getElementById('user');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmInput = document.getElementById('confirmPassword');

const togglePassword = document.getElementById('togglePassword');
const toggleConfirm = document.getElementById('toggleConfirmPassword');
const passwordStrength = document.getElementById('passwordStrength');

const successMessageDiv = document.getElementById('successMessage');
const submissionsList = document.getElementById('submissionsList');


const userError = document.getElementById('userError');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const confirmError = document.getElementById('confirmError');




if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark');
    darkModeToggle.checked = true;
}



darkModeToggle.addEventListener('change', () => {
    if (darkModeToggle.checked) {
        document.body.classList.add('dark');
        localStorage.setItem('darkMode', 'enabled');
    } else {
        document.body.classList.remove('dark');
        localStorage.setItem('darkMode', 'disabled');
    }
});




passwordInput.addEventListener('input', () => {
    const val = passwordInput.value;
    let strength = '';
    if (val.length === 0) {
        strength = '';
    } else if (val.length < 6) {
        strength = 'Weak - at least 6 characters';
        passwordStrength.style.color = 'var(--error-color)';
    } else if (val.length >= 6 && !/[A-Z]/.test(val) && !/[0-9]/.test(val)) {
        strength = 'Medium - add uppercase or numbers';
        passwordStrength.style.color = '#f59e0b';
    } else {
        strength = 'Strong!';
        passwordStrength.style.color = 'var(--success-color)';
    }
    passwordStrength.textContent = strength;
});




function togglePasswordVisibility(input, toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        toggleBtn.textContent = type === 'password' ? '👁️' : '🙈';
    });
}
togglePasswordVisibility(passwordInput, togglePassword);
togglePasswordVisibility(confirmInput, toggleConfirm);




function validateName() {
    const name = userInput.value.trim();
    if (name === '') {
        userError.textContent = 'Full name is required';
        return false;
    } else if (name.length < 3) {
        userError.textContent = 'Name must be at least 3 characters';
        return false;
    } else {
        userError.textContent = '';
        return true;
    }
}








function validateEmail() {
    const email = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    if (email === '') {
        emailError.textContent = 'Email is required';
        return false;
    } else if (!emailPattern.test(email)) {
        emailError.textContent = 'Enter a valid email';
        return false;
    } else {
        emailError.textContent = '';
        return true;
    }
}




function validatePassword() {
    const password = passwordInput.value;
    if (password === '') {
        passwordError.textContent = 'Password is required';
        return false;
    } else if (password.length < 6) {
        passwordError.textContent = 'Password must be at least 6 characters';
        return false;
    } else {
        passwordError.textContent = '';
        return true;
    }
}









function validateConfirm() {
    const password = passwordInput.value;
    const confirm = confirmInput.value;
    if (confirm === '') {
        confirmError.textContent = 'Please confirm your password';
        return false;
    } else if (password !== confirm) {
        confirmError.textContent = 'Passwords do not match';
        return false;
    } else {
        confirmError.textContent = '';
        return true;
    }
}





userInput.addEventListener('input', validateName);
emailInput.addEventListener('input', validateEmail);
passwordInput.addEventListener('input', () => {
    validatePassword();
    validateConfirm();
});
confirmInput.addEventListener('input', validateConfirm);











function loadSubmissions() {
    const submissions = JSON.parse(localStorage.getItem('signups')) || [];
    if (submissions.length === 0) {
        submissionsList.innerHTML = '<p class="empty-msg">No submissions yet. Fill out the form above!</p>';
        return;
    }
    let html = '';
    submissions.reverse().forEach(sub => {
        html += `
            <div class="submission-card">
                <p><strong>${sub.user}</strong> | ${sub.email}</p>
                <p>📞 ${sub.phone || 'No phone'} | ${sub.country}</p>
                <p>🎨 Favorite color: <span style="color:${sub.color}; font-weight:bold;">${sub.color}</span></p>
                <small>📅 ${new Date(sub.date).toLocaleString()}</small>
            </div>
        `;
    });
    submissionsList.innerHTML = html;
}






function saveSubmission(formData) {
    const submissions = JSON.parse(localStorage.getItem('signups')) || [];
    const newEntry = {
        id: Date.now(),
        user: formData.user,
        email: formData.email,
        phone: formData.countryCode + formData.phoneNumber,
        country: formData.country,
        color: formData.color,
        date: new Date().toISOString()
    };
    submissions.push(newEntry);
    localStorage.setItem('signups', JSON.stringify(submissions));
    loadSubmissions();
}




form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmValid = validateConfirm();
    const agreeCheck = document.getElementById('agree').checked;

    if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmValid) {
        successMessageDiv.style.display = 'block';
        successMessageDiv.textContent = '❌ Please fix the errors above.';
        successMessageDiv.style.background = 'var(--error-color)';
        setTimeout(() => {
            successMessageDiv.style.display = 'none';
        }, 3000);
        return;
    }

    if (!agreeCheck) {
        successMessageDiv.style.display = 'block';
        successMessageDiv.textContent = '⚠️ You must agree to the Terms & Conditions.';
        successMessageDiv.style.background = 'var(--error-color)';
        setTimeout(() => {
            successMessageDiv.style.display = 'none';
        }, 3000);
        return;
    }

    

    const formData = {
        user: userInput.value.trim(),
        email: emailInput.value.trim(),
        countryCode: document.getElementById('countryCode').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        country: document.getElementById('country').value,
        gender: document.querySelector('input[name="gender"]:checked')?.value || 'Not specified',
        date: document.getElementById('date').value,
        color: document.getElementById('color').value,
        comment: document.getElementById('comment').value
    };



    saveSubmission(formData);

    // Show success message
    successMessageDiv.style.display = 'block';
    successMessageDiv.textContent = `🎉 Welcome ${formData.user}! Your account has been created.`;
    successMessageDiv.style.background = 'var(--success-color)';
    
    // Optionally reset form (except keep some fields if desired)
    // form.reset(); // uncomment if you want full reset
    passwordStrength.textContent = '';
    userError.textContent = '';
    emailError.textContent = '';
    passwordError.textContent = '';
    confirmError.textContent = '';

    setTimeout(() => {
        successMessageDiv.style.display = 'none';
    }, 5000);
});



loadSubmissions();