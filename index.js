const formElement = document.querySelector('#details-form');
const errorMessages = document.querySelectorAll('.error-message');

const inputCardholderName = document.querySelector('#cardholderName');
const displayCardholderName = document.querySelector('.container__card-name');

const inputCardNumber = document.querySelector('#cardNumber');
const displayCardNumber = document.querySelector('.container__card-number');

const inputMonth = document.querySelector('#month');
const displayMonth = document.querySelector('#dateMonth');

const inputYear = document.querySelector('#year');
const displayYear = document.querySelector('#dateYear');

const inputCvc = document.querySelector('#cvc');
const displayCvc = document.querySelector('.container__card-cvc');

const thankYou = document.querySelector('.thank-you-message');
const continueBtn = document.querySelector('#continueBtn');

inputYear.setAttribute('min', Number(getCurrentYear()) + 1);
inputYear.setAttribute('max', Number(inputYear.getAttribute('min')) + 30);

function getCurrentYear() {
  const date = new Date().getFullYear().toString();
  return date.substring(date.length - 2);
}

const validationOptions = [
  {
    attribute: 'data-card-year',
    isValid: (input) => input.value >= input.min,
    errorMessage: () => `Year must be in the future`,
  },
  {
    attribute: 'data-card-number',
    isValid: (input) => input.value.replace(/\s+/g, '').length == 16,
    errorMessage: () => `Card numbers must be 16 digits`,
  },
  {
    attribute: 'required',
    isValid: (input) => input.value.trim() !== '',
    errorMessage: () => `Can't be blank`,
  },
];

const validateSingleFormGroup = (formGroup) => {
  const input = formGroup.querySelector('input');
  const errorContainer = formGroup.querySelector('.error-message');

  let formGroupError = false;
  for (const option of validationOptions) {
    if (input.hasAttribute(option.attribute) && !option.isValid(input)) {
      errorContainer.textContent = option.errorMessage();
      input.placeholder = '';
      input.classList.add('error');
      formGroupError = true;
    }
  }

  if (!formGroupError) {
    errorContainer.textContent = '';
    input.classList.remove('error');
  }
};

const validateFieldset = (fieldset) => {
  const fieldsetElement = document.querySelector(fieldset);
  const inputs = fieldsetElement.querySelectorAll('input');
  const errorContainer = fieldsetElement.querySelector('.error-message');

  let fieldsetError = false;
  for (let i = 0; i < inputs.length; i++) {
    for (const option of validationOptions) {
      if (
        inputs[i].hasAttribute(option.attribute) &&
        !option.isValid(inputs[i])
      ) {
        errorContainer.textContent = option.errorMessage();
        inputs[i].placeholder = '';
        inputs[i].classList.add('error');
        fieldsetError = true;
      }
    }

    if (!fieldsetError) {
      errorContainer.textContent = '';
      inputs[i].classList.remove('error');
    }
  }
};

const displayCardDetails = (input, element, string) => {
  if (input != '') {
    element.textContent = input;
  } else {
    element.textContent = string;
  }
};

formElement.addEventListener('input', (e) => {
  if (e.target == inputCardNumber) {
    let input = e.target.value.replace(/\D/g, '');
    input = input.slice(0, 16);
    input = input.replace(/(\d{4})/g, '$1 ').trim();
    e.target.value = input;
    displayCardDetails(input, displayCardNumber, '0000 0000 0000 0000');
  }

  if (e.target == inputCardholderName) {
    let input = e.target.value.replace(/\d/g, '');
    e.target.value = input;
    displayCardDetails(
      input.toUpperCase(),
      displayCardholderName,
      'JANE APPLESEED'
    );
  }

  if (e.target == inputMonth) {
    let input = e.target.value;
    input = input.slice(0, 2);
    if (input > e.target.max) {
      input = e.target.max;
    }
    e.target.value = input;
    displayCardDetails(input, displayMonth, '00');
  }

  if (e.target == inputYear) {
    let input = e.target.value;
    if (input >= e.target.max) {
      input = e.target.max;
    }
    input = input.slice(0, 2);
    e.target.value = input;
    displayCardDetails(input, displayYear, '00');
  }

  if (e.target == inputCvc) {
    let input = e.target.value;
    input = input.slice(0, 3);
    e.target.value = input;
    displayCardDetails(input, displayCvc, '000');
  }
});

formElement.setAttribute('novalidate', '');

Array.from(formElement.elements).forEach((element) => {
  element.addEventListener('blur', (e) => {
    if (e.srcElement.parentElement.classList.contains('form__input-group')) {
      validateSingleFormGroup(e.srcElement.closest('.form__input-group'));
    }

    if (e.srcElement.parentElement.classList.contains('form__input-wrapper')) {
      validateFieldset('fieldset');
    }
  });
});

const formReset = () => {
  const inputs = formElement.querySelectorAll('input:not(#submitBtn)');

  inputs.forEach((input) => {
    input.value = '';
  });

  displayCardNumber.textContent = '0000 0000 0000 0000';
  displayCardholderName.textContent = 'JANE APPLESEED';
  displayCvc.textContent = '000';
  displayMonth.textContent = '00';
  displayYear.textContent = '00';
};

formElement.addEventListener('submit', (e) => {
  e.preventDefault();

  validateAllFormGroups(formElement);

  errorMessages.forEach((message) => {
    let errorState = message.textContent;
    if (errorState == '') {
      thankYou.style.display = 'flex';
      formElement.style.display = 'none';
    }
  });
});

continueBtn.addEventListener('click', () => {
  thankYou.style.display = 'none';
  formElement.style.display = 'grid';

  formReset();
});

const validateAllFormGroups = (formToValidate) => {
  const formGroups = Array.from(
    formToValidate.querySelectorAll('.form__input-group')
  );

  formGroups.forEach((formGroup) => {
    validateSingleFormGroup(formGroup);
  });

  validateFieldset('fieldset');
};
