document.addEventListener('DOMContentLoaded', () => {
    const signInBtn = document.getElementById('btn-signin');
    const signUpBtn = document.getElementById('btn-signup');

    if (signInBtn) {
        signInBtn.addEventListener('click', () => {
            console.log('Sign In clicked');
            alert('Sign In button clicked!');
        });
    }

    if (signUpBtn) {
        signUpBtn.addEventListener('click', () => {
            console.log('Sign Up clicked');
            alert('Sign Up button clicked!');
        });
    }
});
