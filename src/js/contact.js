const workerUrl = "https://nsphoto-contact.dr-useless.workers.dev";

const contactFormSelector = "form.contact";
const responseContainerSelector = "form.contact .response";

export default function initContactForm() {
    const contactForm = document.querySelector(contactFormSelector);

    if (contactForm) {
        contactForm.addEventListener("submit", e => {
            e.preventDefault();
            grecaptcha.ready(() => {
                grecaptcha.execute('6Lfv0bUUAAAAAMGdj5GMUSsPWIL8IK4pKE50epBF', {action: 'submit'}).then(token => {
                    sendToWorker(token);
                });
              });
        });
    }
}

function sendToWorker(token) {
    const request = new XMLHttpRequest();
    request.open("POST", workerUrl);
    request.setRequestHeader("Content-Type", "application/json");
    request.setRequestHeader("g-recaptcha", token);
    request.responseType = "json";
    request.addEventListener("load", () => {
        console.log(request.response.message);
        const responseContainer = document.querySelector(responseContainerSelector);
        if (request.statusCode !== 200) {
            responseContainer.textContent = request.response.message;
            responseContainer.classList.add('error');
        }
        
    });
    const body = JSON.stringify({
        name: document.querySelector('input[name=name]').value,
        email: document.querySelector('input[name=email]').value,
        phone: document.querySelector('input[name=phone]').value,
        message: document.querySelector('textarea[name=message]').value
    })
    request.send(body);
}