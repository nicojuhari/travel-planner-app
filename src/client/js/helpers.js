export const daysDifference = (date1, date2) => Math.ceil(Math.abs(new Date(date2) - new Date(date1)) / (1000 * 60 * 60 * 24));
export const fahrenheitToCelsius = fahrs => Math.round(Number(fahrs) - 32 * 5/9);
export const disableEnableSearchBtn = (exec = '') => {
    exec == 'disable' ? document.getElementById('search').classList.add('disabled') :
                        document.getElementById('search').classList.remove('disabled');
}



/* Local Functions */
export const showErrorMessage = (msg) => {
    const errBlock = document.getElementById('error-block');

    errBlock.querySelector('.js-err-message').innerHTML = msg;
    errBlock.classList.add('active');
}

export const addMoreDestinations = (data) => {
    //clone the array
    const newData = data.slice();

    //get the DOM
    const location = document.getElementById('location');
    const destination = document.getElementById('destination');
    const dateStart = document.getElementById('date-start');
    const dateEnd = document.getElementById('date-end');

    //get the Last destination from the new trip
    const lastDestination = newData.reverse()[0];
    const lastDateEnd = lastDestination.dateEnd;
    const lastDestinationCity = lastDestination.destination.city;

    //clear and assign new values
    location.value = lastDestinationCity;
    destination.value = '';
    dateStart.value = lastDateEnd;
    dateEnd.value = '';

    //disable the inputs
    location.disabled = true;
    dateStart.disabled = true;

    //remove the valid classes
    destination.classList.remove('valid');
    dateEnd.classList.remove('valid');

    //enable search button
    document.getElementById('search').classList.remove('disabled');

    //scroll to form
    scrollToSection('trip-form');
    
}

export const removeTrip = (index) => {
    const allTrips = JSON.parse(localStorage.getItem('tp_capstone'));
    let newAllTrips = allTrips.filter((item, i) => i != index);
    localStorage.setItem('tp_capstone', JSON.stringify(newAllTrips));
}

export const printTripBlock = (elem) => {
    console.log(elem);
    var mywindow = window.open('', 'PRINT', 'height=400,width=600');

    mywindow.document.write('<html><head><title>' + document.title  + '</title>');
    mywindow.document.write('</head><body >');
    mywindow.document.write('<h1>' + document.title  + '</h1>');
    mywindow.document.write(elem);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();

    return true;
}

export const scrollToSection = sectionId => document.getElementById(sectionId).scrollIntoView({  behavior: 'smooth' });



const sortAllTrips = (tripArray) => {
    
    function compare( a, b ) {
        if ( a.last_nom < b.last_nom ){
          return -1;
        }
        if ( a.last_nom > b.last_nom ){
          return 1;
        }
        return 0;
      }
      
      objs.sort( compare );
    //tripArray.sort(function(e.dateStart, b.dateStart){return e.dateStart - b.dateStart})
}