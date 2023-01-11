// import { toast } from 'react-toastify';

const isValidEmail = (email) => {
    const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return email ? regex.test(email) : false;
}
const validate = (formId, field) => {
    let isValid = false;
    if (formId) {
        let form = document.getElementById(formId);
        let fields = form.querySelectorAll('[name]');

        if (field) {
            for (const item of fields) {
                if (item.name === field) {
                    if (!item.value) {
                        messageInvalid(item.name);
                        addClassInvalid(form, item.name);
                        return isValid;
                    }

                    if (field === 'email') {
                        if (!isValidEmail(item.value)) {
                            messageInvalid(item.name);
                            addClassInvalid(form, item.name);
                            return isValid;
                        }
                    }

                    isValid = true;
                }
            }
        } else {
            let isChecked = false;
            for (const item of fields) {
                switch (item.tagName) {
                    case 'INPUT':
                    case 'SELECT':
                        if (item.value) {
                            // CHECKBOX
                            if (item.type === 'checkbox') {
                                if (item.checked) {
                                    isValid = true;
                                    isChecked = true;
                                }

                                if (!isChecked) {
                                    messageInvalid(item.name);
                                    addClassInvalid(form, item.name);
                                } else {
                                    item.classList.remove('is-invalid');
                                }
                            } else {
                                isValid = true;
                            }
                        } else {
                            messageInvalid(item.name);
                            addClassInvalid(form, item.name);
                            isValid = false;
                            return isValid;
                        }

                    default:
                        break;
                }

                if (item.name === 'email') {
                    if (!isValidEmail(item.value)) {
                        messageInvalid(item.name);
                        addClassInvalid(form, item.name);
                        isValid = false;
                        return isValid;
                    }
                }
            }
        }
    }

    return isValid;
}

const addClassInvalid = (form, nameInput) => {
    if (form[nameInput].type) {
        form[nameInput].classList.add("is-invalid");
        return;
    }

    for (const item of form[nameInput]) {
        item.classList.add("is-invalid");
    }
}

const messageInvalid = (fieldName) => {
    let i = 0;
    let character = '';
    while (i <= fieldName.length) {
        character = fieldName.charAt(i);
        if (character == character.toUpperCase()) {
            let lowerWord = fieldName.substring(0, i);
            let upperWord = fieldName.substring(i);
            lowerWord = lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1);
            fieldName = `${lowerWord} ${upperWord}`
            // toast.error(`Field ${fieldName} you input isn't correct, try again`);
            return;
        }
        if (character == character.toUpperCase()) {
            let lowerWord = fieldName.substring(0, i);
            lowerWord = lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1);
            fieldName = lowerWord;
            // toast.error(`Field ${fieldName} you input isn't correct, try again`);
            return;
        }
        i++;
    }
}

export default {
    validate
}