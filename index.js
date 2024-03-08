const validateForm = (formSelector) => {
  const formElement = document.querySelector(formSelector);
  const inputYear = document.querySelector('#year');
  const inputCardNumber = document.querySelector('#cardNumber');
  const displayCardNumber = document.querySelector('.container__card-number');

  inputYear.setAttribute('min', getCurrentYear());

  function getCurrentYear() {
    const date = new Date().getFullYear().toString();
    return date.substring(date.length - 2);
  }
  const validationOptions = [
    {
      attribute: 'data-card-number',
      isValid: (input) => input.value.replace(/\s+/g, '').length == 16,
      errorMessage: () => `Card numbers must be 16 digits`,
    },
    {
      attribute: 'required',
      isValid: (input) => input.value.trim() !== '',
      errorMessage: () => `This field cannot be empty`,
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

  inputCardNumber.addEventListener('input', (e) => {
    let input = e.target.value.replace(/\D/g, '');
    input = input.slice(0, 16);

    input = input.replace(/(\d{4})/g, '$1 ').trim();

    e.target.value = input;
    if (input != '') {
      displayCardNumber.textContent = input;
    } else {
      displayCardNumber.textContent = '0000 0000 0000 0000';
    }
  });

  formElement.setAttribute('novalidate', '');

  Array.from(formElement.elements).forEach((element) => {
    element.addEventListener('blur', (e) => {
      validateSingleFormGroup(e.srcElement.closest('.form__input-group'));
    });
  });

  formElement.addEventListener('submit', (e) => {
    e.preventDefault();

    validateAllFormGroups(formElement);
  });

  const validateAllFormGroups = (formToValidate) => {
    const formGroups = Array.from(
      formToValidate.querySelectorAll('.form__input-group')
    );

    formGroups.forEach((formGroup) => {
      validateSingleFormGroup(formGroup);
    });
  };
};

validateForm('#details-form');
