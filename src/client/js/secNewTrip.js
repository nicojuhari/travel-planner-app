import { getCoordinatesAPI, getWeatherAPI, getImageAPI } from './api';
import { scrollToSection } from './helpers';
import { displayAllTrips } from './secTripList';

export const getDataFromAPIs = async (userData) => {
    let newTrip = {}

    newTrip.dateStart = userData.dateStart;
    newTrip.dateEnd = userData.dateEnd;
    newTrip.toDoList = [];
    newTrip.error = '';

    // get Current Location Coordinates
    await getCoordinatesAPI(userData.location)
    .then(resLocation => {
        if(resLocation.error) {

            newTrip.error = resLocation.error;
        }
        else {

            newTrip.location = {
                city: resLocation.geonames[0].toponymName,
                lat: resLocation.geonames[0].lat,
                lng: resLocation.geonames[0].lng
            };
            
        }
    });

    // get Destination Coordinates
    await getCoordinatesAPI(userData.destination)
    .then(resDestination => {
        
        if(resDestination.error) {
            newTrip.error = resDestination.error;
        }
        else {

            // add the Destination info to the object
            newTrip.destination = {
                city: resDestination.geonames[0].toponymName,
                country: resDestination.geonames[0].countryName,
                lat: resDestination.geonames[0].lat,
                lng: resDestination.geonames[0].lng
            };
        }
    })
    
    if(newTrip.error == '') {

        //get the Weather by Destination Coords and DateStart
        await getWeatherAPI(newTrip.destination.lat, newTrip.destination.lng, userData.dateStart)
        .then(resWeather => {

            // add the Weather info to the object
            newTrip.weather = {
                temperatureMax: resWeather.daily.data[0].temperatureMax,
                temperatureMin: resWeather.daily.data[0].temperatureMin,
                summary: resWeather.daily.data[0].summary,
                icon: resWeather.daily.data[0].icon
            }

        })


        //get the Image by Destination City
        await getImageAPI(newTrip.destination.city)
        .then(cityImg => {
            
            //Image found by Destination City Name
            if(cityImg.totalHits > 0) {
                newTrip.image = cityImg.hits[0].largeImageURL;
            }
            else {
                //Image not found
                //Send another API request to get the Image by Destination Country Name
                getImageAPI(newTrip.destination.country)
                .then(countryImg =>{
                    
                    //image found
                    if(countryImg.totalHits > 0) {
                        newTrip.image = countryImg.hits[0].largeImageURL
                    }
                    else {
                        // the Image Placeholder will be added instead
                        newTrip.image = false;
                    }
                })
            }
            
        })


    }

    return newTrip;
    
}

export const addMoreDestinations = (newTripHolder) => {

    //clone the newTripHolder array/pbject
    const newData = newTripHolder.slice();

    //get the DOM
    const location = document.getElementById('location');
    const destination = document.getElementById('destination');
    const dateStart = document.getElementById('date-start');
    const dateEnd = document.getElementById('date-end');

    //reverse the array
    const lastDestination = newData.reverse()[0];
    
    //get the Last destination from the newTripHolder
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

export const saveNewTrip = (newTripHolder) => {

    //check if the LocalStorage is supported by User's Browser
    if(window.localStorage !== undefined ){

        let newTPcapstone = [];

        if(localStorage.getItem('tp_capstone')) {
            newTPcapstone = [ ...JSON.parse(localStorage.getItem('tp_capstone')), newTripHolder ]
        } else { 
            newTPcapstone = [newTripHolder];
        }

        //add the trip to LocalStorage
        localStorage.setItem('tp_capstone', JSON.stringify(newTPcapstone));
 
        //update Landing UI
        updateForm();

        return true;
       
    
    } else {
        
        alert('Your Browser doesn\'t support the local storage. \nPlease, update your browser!');
        
        return false;
    }

}

export const updateForm = () => {
    
    //get the DOM
    const tripFormBlock = document.getElementById('trip-form');
    const formInputs = tripFormBlock.querySelectorAll('input');
    const searchBtn = document.getElementById('search');

    formInputs.forEach((el) => {
        el.value = '';
        el.disabled  = false;
        el.classList.remove('valid');
    });

    searchBtn.classList.remove('disabled');

    //hide the trip create seaction
    document.getElementById('trip-create').classList.remove('active');
    
    displayAllTrips();
    
    scrollToSection('trip-list');
}