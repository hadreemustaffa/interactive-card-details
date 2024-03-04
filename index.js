const validateForm = (formSelector) => {
  const formElement = document.querySelector(formSelector);
  const inputYear = document.querySelector('#year');

  inputYear.setAttribute('min', getCurrentYear());

  function getCurrentYear() {
    const date = new Date().getFullYear().toString();
    return date.substring(date.length - 2);
  }
  const validationOptions = [
    {
      attribute: 'data-maxlength',
      isValid: (input) =>
        input.value &&
        input.value.length <=
          parseInt(input.getAttribute('data-maxLength'), 10),
      errorMessage: (input, label) =>
        `${label.textContent} must be less than ${input.getAttribute(
          'data-maxlength'
        )} characters`,
    },
    {
      attribute: '',
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

    console.log(formGroup);
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
    }
  };

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
