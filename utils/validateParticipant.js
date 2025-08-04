const MAX_AGE = 150;

const capitalize = (str) =>
    typeof str === 'string' && str.length > 0
        ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
        : str;

const isNonEmptyString = (value) => typeof value === 'string' && value.trim() !== '';
const isPositiveNumber = (value) => typeof value === 'number' && !isNaN(value) && value > 0;
const isWithinRange = (value, max) => value <= max;

const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPhone = (phone) =>
    /^\+?[0-9]{7,15}$/.test(phone);

function normalizeForm(form) {
    return {
        ...form,
        name: capitalize(form.name?.trim() || ''),
        surname: capitalize(form.surname?.trim() || ''),
        gender: form.gender?.trim() || '',
        raceRole: form.raceRole?.trim() || '',
        age: form.age?.toString().trim() || '',
        email: form.email?.trim() || '',
        phone: form.phone?.trim() || '',
    };
}

function validateGeneral(form) {
    const errors = {};
    let isValid = true;

    if (!isNonEmptyString(form.name)) {
        errors.name = 'Name is required';
        isValid = false;
    }
    if (!isNonEmptyString(form.surname)) {
        errors.surname = 'Surname is required';
        isValid = false;
    }

    const ageNum = Number(form.age);
    if (!isPositiveNumber(ageNum)) {
        errors.age = 'Age must be a positive number';
        isValid = false;
    } else if (!isWithinRange(ageNum, MAX_AGE)) {
        errors.age = `Age must not exceed ${MAX_AGE}`;
        isValid = false;
    }

    if (form.email && !isValidEmail(form.email)) {
        errors.email = 'Invalid email format';
        isValid = false;
    }

    if (form.phone && !isValidPhone(form.phone)) {
        errors.phone = 'Invalid phone number format';
        isValid = false;
    }

    return { isValid, errors, ageNum };
}

export function validateParticipant(form, eventRestrictions = {}) {
    const normalizedForm = normalizeForm(form);
    const { isValid: generalValid, errors, ageNum } = validateGeneral(normalizedForm);
    let isValid = generalValid;

    if (eventRestrictions.ageLimit === '18+' && ageNum < 18) {
        errors.age = 'Sorry, this event is 18+ only';
        isValid = false;
    }
    if (
        eventRestrictions.ageLimit === 'children' &&
        eventRestrictions.maxChildAge &&
        ageNum > Number(eventRestrictions.maxChildAge)
    ) {
        errors.age = `Sorry, only children up to ${eventRestrictions.maxChildAge} years can participate`;
        isValid = false;
    }
    if (
        eventRestrictions.genderRestriction &&
        eventRestrictions.genderRestriction !== 'any' &&
        normalizedForm.gender !== eventRestrictions.genderRestriction
    ) {
        errors.gender = `Sorry, this event is for ${eventRestrictions.genderRestriction} only`;
        isValid = false;
    }
    if (eventRestrictions.isRace && !isNonEmptyString(normalizedForm.raceRole)) {
        errors.raceRole = 'Please select your race role';
        isValid = false;
    }

    return { isValid, errors, normalizedForm };
}