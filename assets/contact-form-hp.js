const form_ele = document.querySelector('.contact form');
form_ele.setAttribute('action', '');
const topic_ele = document.querySelector("select[name ='contact[Topic]']");
const name_ele = document.querySelector("input[name='contact[Name]']");
const email_ele = document.querySelector("input[name='contact[Email]']");
const phone_ele = document.querySelector("input[name='contact[Phone_number]");
const order_ele = document.querySelector("input[name='contact[Order_Number]");
const comment_ele = document.querySelector("textarea[name='contact[Comment]']");

topic_ele.addEventListener('change', function () {
  document.querySelector('#topic-err-msg').style.display = 'none';
});

topic_ele.addEventListener('focusout', function () {
  if (!topic_ele.value) {
    document.querySelector('#topic-err-msg').style.display = 'block';
    return;
  }
  document.querySelector('#topic-err-msg').style.display = 'none';
});

name_ele.addEventListener('keyup', function() {  
  if (!name_ele.value) {
    document.querySelector('#name-err-msg').style.display = 'block';
    return;
  }
  document.querySelector('#name-err-msg').style.display = 'none'; 
});

name_ele.addEventListener('focusout', function() { 
  if (!name_ele.value) {
    document.querySelector('#name-err-msg').style.display = 'block';
    return;
  }
  document.querySelector('#name-err-msg').style.display = 'none'; 
});

email_ele.addEventListener('keyup', function () {
  if (!email_ele.value.includes('@') || !email_ele.value.includes('.co')) {
    document.querySelector('#email-err-msg').style.display = 'block';
    return;
  }
  document.querySelector('#email-err-msg').style.display = 'none';
});

email_ele.addEventListener('focusout', function () {
  if (!email_ele.value.includes('@') || !email_ele.value.includes('.co')) {
    document.querySelector('#email-err-msg').style.display = 'block';
    return;
  }
  document.querySelector('#email-err-msg').style.display = 'none';
});

comment_ele.addEventListener('keyup', function () {
  if (!(comment_ele.value.trim())) {
    document.querySelector('#comment-err-msg').style.display = 'block';
    return;
  }
  document.querySelector('#comment-err-msg').style.display = 'none';
});

comment_ele.addEventListener('focusout', function () {
  if (!(comment_ele.value.trim())) {
    document.querySelector('#comment_label').style.display = 'none'
    document.querySelector('#comment-err-msg').style.display = 'block';
    return;
  }
  document.querySelector('#comment_label').style.display = 'none'
  document.querySelector('#comment-err-msg').style.display = 'none';
});

function onResponse() {
  const submit_error = document.querySelector('.contact__submit-error')
  submit_error.style.display = "none"
  contact_modal_container.style.opacity = '1';
  contact_modal_container.style.backgroundColor = 'rgba(0,0,0,.6)';
  submit_button.innerHTML = 'Submit Message';
  document.getElementById('ContactForm').reset();
  document.querySelectorAll('#ContactForm .form-field--success, #ContactForm .form-field--error').forEach(function (element) {
    element.classList.remove('form-field--success');
    element.classList.remove('form-field--error');
  });
  contact_modal_content.setAttribute('modal', 'enabled');
  document.addEventListener('mouseup', hideModal);
}

function onError() {
  const submit_error = document.querySelector('.contact__submit-error')
  submit_button.innerHTML = "Try again"
  submit_error.style.display = "block"
  submit_button.disabled = false;
}

function hideModal(event) {
    if (!contact_modal_content.contains(event.target)) {
        contact_modal_container.style.opacity = '0';
        contact_modal_content.setAttribute('modal', 'disabled');
        submit_button.disabled = false;
    }
}
const formSelector = 'form[ContactForm]';
const submit_button = document.querySelector('.contact__button .button')
const contact_modal_container = document.getElementsByClassName('contact-modal-container')[0];
const contact_modal_content = document.getElementsByClassName('contact-modal-content')[0];
contact_modal_content.setAttribute('modal', 'disabled');
submit_button.addEventListener('click', postCustomForm);

async function postCustomForm(event) {
    event.preventDefault();
    const form_data = {
        topic: topic_ele.value,
        name: name_ele.value,
        email: email_ele.value,
        phone: phone_ele.value,
        order_number: order_ele.value,
        // country: country_ele.value,
        message: comment_ele.value,
    };
    if(!topic_ele.value){
        document.querySelector('#topic-err-msg').style.display = 'block';
    }
    else if(!name_ele.value){
        document.querySelector('#name-err-msg').style.display = 'block';
        
    }
    else if(!email_ele.value|| !email_ele.value.includes('@')){
        document.querySelector('#email-err-msg').style.display = 'block';

    }
    // else if(!country_ele.value){
    //     document.querySelector('#country-err-msg').style.display = 'block';

    // }
    else if(!(comment_ele.value.trim())){
        document.querySelector('#comment-err-msg').style.display = 'block';

    }else{
        submit_button.disabled = true;
        submit_button.innerHTML = 'Sending Message...';
        const url = contact_us_enviroment === 'prod' ? "https://utopia.azure-api.net/shenzhen/HPS/feedback" : "https://utopia-dev.azure-api.net/shenzhen/HPS/feedback"
        try {
            const response = await fetch(url,
                {
                    method: 'POST',
                    mode: 'cors', // no-cors, *cors, same-origin
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body:  JSON.stringify(form_data)
                })
                if (response.ok) {
                    onResponse()
                } else {
                    onError()
                }
        } catch (err) {
            onError()
        }
    }
}

