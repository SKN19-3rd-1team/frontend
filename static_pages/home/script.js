// 梨꾪똿/?ㅼ젙 踰꾪듉
const settingBtn = document.getElementById("btn-setting"); 
const settingPage = fetch("./../page2/index.html");

if (settingBtn) {
    settingBtn.addEventListener("click", () => {
        settingPage.classList.add("show");
    });
}

// 硫붿씤 肄섑뀗痢?濡쒓렇???뚯썝媛??踰꾪듉
const signInBtn = document.getElementById("btn-signin");
const signUpBtn = document.getElementById("btn-signup");

// 濡쒓렇???앹뾽
const modalLogin = document.getElementById("login-modal");
const closeBtnLogin = document.getElementById("btn-login-close");
const overlayLogIn = document.getElementById("login-overlay");

const linkForgotPassword = document.getElementById("link-forgot-password");
const linkSignup = document.getElementById("link-signup");

if (signInBtn) {
    signInBtn.addEventListener("click", () => {
        modalLogin.classList.add("show");
    });
}

closeBtnLogin.addEventListener("click", () => modalLogin.classList.remove("show"));
overlayLogIn.addEventListener("click", () => modalLogin.classList.remove("show"));


// ?뚯썝媛???앹뾽
const modalSignup = document.getElementById("signup-modal");
const closeBtnSignup = document.getElementById("btn-signup-close");
const overlaySignup = document.getElementById("signup-overlay");

const emailConfirmBtn = document.getElementById("btn-email-confirm"); // ?대찓???몄쬆 ?꾩넚 踰꾪듉
const signUpConfirmBtn = document.getElementById("btn-signup-confirm");

const inputs = document.querySelectorAll("#signup-modal input[required]");
const passwordInput = document.getElementById("signup-password");
const passwordCheckInput = document.getElementById("signup-password-check");

if (linkSignup) {
    linkSignup.addEventListener("click", () => {
        modalSignup.classList.add("show");
    });
}

if (signUpBtn) {
    signUpBtn.addEventListener("click", () => {
        modalSignup.classList.add("show");
    });
}

closeBtnSignup.addEventListener("click", () => modalSignup.classList.remove("show"));
overlaySignup.addEventListener("click", () => modalSignup.classList.remove("show"));


// ?뚯썝媛??醫낅즺 ?앹뾽
const modalSignupComplete = document.getElementById("signup-complete-modal");
const closeBtnSignupComplete = document.getElementById("btn-signup-complete-close");
const overlaySignupComplete = document.getElementById("signup-complete-overlay");

if (signUpConfirmBtn) {
    signUpConfirmBtn.addEventListener("click", () => {
        // 紐⑤뱺 input 媛믪씠 梨꾩썙???덈뒗吏 ?뺤씤
        const allFilled = Array.from(inputs).every(input => input.value.trim() !== "");

        if (!allFilled) {
            alert("紐⑤뱺 ?꾩닔 ??ぉ???낅젰?댁＜?몄슂.");
            return;
        }

        // 鍮꾨?踰덊샇? 鍮꾨?踰덊샇 ?뺤씤??媛숈?吏 ?뺤씤
        if (passwordInput.value !== passwordCheckInput.value) {
            alert("鍮꾨?踰덊샇? 鍮꾨?踰덊샇 ?뺤씤???쇱튂?섏? ?딆뒿?덈떎.");
            return;
        }

        modalSignup.classList.remove("show");
        modalSignupComplete.classList.add("show");
    });
}

closeBtnSignupComplete.addEventListener("click", () => modalSignupComplete.classList.remove("show"));
overlaySignupComplete.addEventListener("click", () => modalSignupComplete.classList.remove("show"));

// 鍮꾨?踰덊샇 李얘린 ?앹뾽
const modalFindPassword = document.getElementById("find-password-modal");
const closeBtnFindPassword = document.getElementById("btn-find-password-close");
const overlayFindPassword = document.getElementById("find-password-overlay");

const tempPasswordBtn = document.getElementById("btn-temp-password"); // ?꾩떆 鍮꾨?踰덊샇 諛쏄린 踰꾪듉
const returnLoginBtn = document.getElementById("btn-return-login"); 

if (linkForgotPassword) {
    linkForgotPassword.addEventListener("click", () => {
        modalFindPassword.classList.add("show");
    });
}

closeBtnFindPassword.addEventListener("click", () => modalFindPassword.classList.remove("show"));
overlayFindPassword.addEventListener("click", () => modalFindPassword.classList.remove("show"));
returnLoginBtn.addEventListener("click", () => modalFindPassword.classList.remove("show"));

