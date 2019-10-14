export const formValidation = () => {

    let errors = '';
    
    const location = document.getElementById('location');
    const destination = document.getElementById('destination');
    const dateStart = document.getElementById('date-start');
    const dateEnd = document.getElementById('date-end');


    // check the Current Location field
    if(location.value.length < 3) {

        location.classList.remove('valid');
        location.classList.add('error');

        errors += '<p>Please, add the Current Location!</p>';
    }
    else {
        //validated
        location.classList.remove('error');
        location.classList.add('valid');
    }

    // check the Destination field
    if(destination.value.length < 3) {

        destination.classList.remove('valid');
        destination.classList.add('error');
        
        errors += '<p>Please, add the Destination!</p>';
        
    }
    else {
        //validated
        destination.classList.remove('error');
        destination.classList.add('valid');
    }

    // check the Start Date field
    if(!isFutureDate(dateStart.value) || dateStart.value == '') {

        dateStart.classList.add('error');
        dateStart.classList.remove('valid');

        errors += '<p>Please, select the Departing Date <br>(The Date cannot be before today)</p>';
       
    } else {
        //validated
        dateStart.classList.remove('error');
        dateStart.classList.add('valid');
    }

    // check the End Date field
    if(!isDateAfterThatDate(dateStart.value, dateEnd.value) || !isFutureDate(dateEnd.value) || dateEnd.value == ''){
        dateEnd.classList.add('error')
        dateEnd.classList.remove('valid');
        
        errors += '<p>Please, select the Returning Date <br>(The Date cannot be before the Departing Date)</p>';
        
    } else {
        dateEnd.classList.remove('error')
        dateEnd.classList.add('valid');
    }

    if(!errors) {
        
        document.getElementById('search').classList.add('disabled')
        
        // if not errors return the validated object
        return {
                location: location.value, 
                destination: destination.value, 
                dateStart: dateStart.value, 
                dateEnd: dateEnd.value
                }
    } else {

        document.getElementById('search').classList.remove('disabled')
        showErrorMessage(errors);
        return false;

    }
}

export const enableFormFields = () => {

    const location = document.getElementById('location');
    const searchBtn = document.getElementById('search');
    const dateStart = document.getElementById('date-start');

    location.disabled = false;
    dateStart.disabled = false;
    searchBtn.classList.remove('disabled');
    document.getElementById('trip-create').classList.remove('active');
}

const isFutureDate = (date) => Math.ceil((new Date(date) - Date.now()) / (1000 * 60 * 60 * 24)) >= 0
const isDateAfterThatDate = (pastDate, futureDate) => Math.ceil((new Date(futureDate) - new Date(pastDate)) / (1000 * 60 * 60 * 24)) > 0
const showErrorMessage = (msg) => {
    const errBlock = document.getElementById('error-block');

    errBlock.querySelector('.js-err-message').innerHTML = msg;
    errBlock.classList.add('active');
}

export const closeErrorMessage = () => {
    document.getElementById('error-block').classList.remove('active');
}

