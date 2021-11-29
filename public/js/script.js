import $ from 'jquery';
window.jQuery = window.$ = $;
$(selector).hide();

$(document).ready(function () {
  $('#sidebarCollapse').on('click', function () {
      $('#sidebar').toggleClass('active');
      $('.logo').toggleClass('active');
  });
  $('#sidebarCollapse').on('click', function showImage(){
      $(".logo").toggle();
  });
});

// function checkForm() {
//   // TODO: Perform input validation 
//   const fname = document.querySelector('#fname');
//   const lname = document.querySelector('#lname');
//   const email = document.querySelector('#email');
//   const password = document.querySelector('#passw');
//   const passConfirm = document.querySelector('#repassw');
//   const errorMessage = document.querySelector('#formErrors');
//   errorMessage.classList.add("hide")
//   let errorsFound = false;
//   let reEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
//   const errors = document.createElement("ul");
//   errorMessage.appendChild(errors);
//   if(fname.value == "" || lname.value == ""){
//      errorsFound = true;
//      fname.classList.add("error");
//      lname.classList.add("error");
//      const nameError = document.createElement("li");
//      nameError.innerHTML = "Missing full name.";
//      errors.appendChild(nameError);
//   }
//   if(email.value == "" || !reEmail.test(email.value)){
//      console.log("error")
//      errorsFound = true;
//      email.classList.add("error");
//      const emailError = document.createElement("li");
//      emailError.innerHTML = "Invalid or missing email address.";
//      errors.appendChild(emailError);
//   }
//   if(password.value.length < 10 || password.value.length > 20){
//      errorsFound = true;
//      password.classList.add("error");
//      const passwordError = document.createElement("li");
//      passwordError.innerHTML = "Password must be between 10 and 20 characters.";
//      errors.appendChild(passwordError);
//   }
//   if(password.value == "" || !/[a-z]/.test(password.value)){
//      errorsFound = true;
//      password.classList.add("error");
//      const passwordError = document.createElement("li");
//      passwordError.innerHTML = "Password must contain at least one lowercase character.";
//      errors.appendChild(passwordError);
//   }
//   if(password.value == "" || !/[A-Z]/.test(password.value)){
//      errorsFound = true;
//      password.classList.add("error");
//      const passwordError = document.createElement("li");
//      passwordError.innerHTML = "Password must contain at least one uppercase character.";
//      errors.appendChild(passwordError);
//   }
//   if(password.value == "" || !/[0-9]/.test(password.value)){
//      errorsFound = true;
//      password.classList.add("error");
//      const passwordError = document.createElement("li");
//      passwordError.innerHTML = "Password must contain at least one digit.";
//      errors.appendChild(passwordError);
//   }
//   if(passConfirm == "" || passConfirm.value !== password.value){
//      errorsFound = true;
//      passConfirm.classList.add("error");
//      const passConfirmError = document.createElement("li");
//      passConfirmError.innerHTML = "Password and confirmation password don't match.";
//      errors.appendChild(passConfirmError);
//   }
//   if(errorsFound){
//      errorMessage.classList.remove("hide")
//   }
//   if(!errorsFound){
//      errorMessage.classList.add("hide");
//      fname.classList.remove("error");
//      lname.classList.remove("error");
//      email.classList.remove("error");
//      password.classList.remove("error");
//      passConfirm.classList.remove("error");
//   }
// }

// const loginForm = document.getElementById('reg-form');
// loginForm.addEventListener('submit', function(event) {
//   checkForm();

//   // Prevent default form action. DO NOT REMOVE THIS LINE
//   event.preventDefault();
// })
// async function registerUser(event){
//   event.preventDefault();
//   const firstname = document.getElementById('fname').value;
//   const lastname = document.getElementById('lname').value;
//   const email = document.getElementById('email').value;
//   const password = document.getElementById('passw').value;
//   const repassword = document.getElementById('repassw').value;
//   const user = document.querySelector('input[name="User"]:checked').value;

//   const result = await fetch('/api/register', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       firstname,
//       lastname,
//       email,
//       password,
//       repassword,
//       user
//     })
//   }).then((res) => res.json());
//   console.log(result);
// }