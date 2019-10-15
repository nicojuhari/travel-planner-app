import { createTripListBlock } from './createUI';

export const displayAllTrips = () => {

    //get the SavedTrips from local storage, if exist.
    let allSavedTrips = localStorage.getItem('tp_capstone');

    //hide the section when no Saved Trips 
    document.getElementById('trip-list').classList.remove('active');
    //hide the navigation
    document.querySelector('nav li').classList.remove('active');

    if(allSavedTrips && JSON.parse(allSavedTrips).length > 0) {

        const tripListContent = document.getElementById('trips-list-content');

        //enable navigation
        document.querySelector('nav li').classList.add('active');

        tripListContent.innerHTML = '';
        tripListContent.appendChild(createTripListBlock(JSON.parse(allSavedTrips)));
        document.getElementById('trip-list').classList.add('active');

    }
}

const removeTrip = (index) => {
    const allTrips = JSON.parse(localStorage.getItem('tp_capstone'));
    let newAllTrips = allTrips.filter((item, i) => i != index);
    localStorage.setItem('tp_capstone', JSON.stringify(newAllTrips));
}


document.addEventListener('DOMContentLoaded', () => {

    //display all the saved trips if exist
    displayAllTrips()
    
    //get the DOM
    const tripListContent = document.getElementById('trips-list-content');
    const navLink = document.querySelector('nav a');

    // Event Listener: Click => Remove a Trip
    tripListContent.addEventListener('click',function(event){

        if(event.target.classList.contains('remove-trip')) {
            removeTrip(event.target.dataset.tripNr);
            displayAllTrips();
        }
        
    },true);

})

