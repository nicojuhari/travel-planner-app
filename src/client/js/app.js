import { getCoordinatesAPI, getWeatherAPI, getImageAPI } from './api';
import { formValidation, closeErrorMessage, enableFormFields } from './formValidation';
import { createNewTripLocationBlock, createTripListBlock } from './createUI';
import {    disableEnableSearchBtn, 
            addMoreDestinations, 
            scrollToSection,
            showErrorMessage, removeTrip, daysDifference, printTripBlock } from './helpers';

let newTripTemporaryHolder = [];

const saveNewTrip = () => {

    //save the trip to LocalStorage
    if(window.localStorage!==undefined){
        let newTPcapstone = [];
        if(localStorage.getItem('tp_capstone'))
        newTPcapstone = [ ...JSON.parse(localStorage.getItem('tp_capstone')), newTripTemporaryHolder ]
        else newTPcapstone = [newTripTemporaryHolder];
        localStorage.setItem('tp_capstone', JSON.stringify(newTPcapstone));
 
        //empty the temporary array
        newTripTemporaryHolder = [];

        document.getElementById('new-trip').innerHTML = '';
        enableFormFields();
        displayAllTrips();
    
    } else {
        alert('Your Browser doesn\'t support local storage \nand the data can\'t be saved');
    }

}

const displayAllTrips = () => {

    const allSavedTrips = JSON.parse(localStorage.getItem('tp_capstone'));

    document.getElementById('trip-list').classList.remove('active');

    if(allSavedTrips.length > 0) {
        
        const tripListContent = document.getElementById('trips-list-content');

        tripListContent.innerHTML = '';
        tripListContent.appendChild(createTripListBlock(allSavedTrips));
        document.getElementById('trip-list').classList.add('active');

    }
}



const generateNewTripData = async (userData) => {
    const newTrip = {}

    newTrip.dateStart = userData.dateStart;
    newTrip.dateEnd = userData.dateEnd;
    newTrip.error = [];

    // get Current Location Coordinates
    await getCoordinatesAPI(userData.location)
    .then(resLocation => {
        if(resLocation.error) newTrip.error.push = 'The Current Location can\'t be found';
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
        
        if(resDestination.error) newTrip.error.push = 'The Destination can\'t be found';
        
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
    
    if(newTrip.destination.lat && newTrip.destination.lng) {

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

const createNewTripBlock = (data) => {

    //get the DOM
    const newTripBlock = document.getElementById('new-trip');

    newTripTemporaryHolder.push(data);
    console.log(newTripTemporaryHolder);
    newTripBlock.innerHTML = '';
    //display the Destination in the browser
    newTripBlock.appendChild(createNewTripLocationBlock(newTripTemporaryHolder));
    //scroll to form
    scrollToSection('trip-create');

}

document.addEventListener('DOMContentLoaded', () => {
    
    //get the DOM
    const tripCreateSection = document.getElementById('trip-create');
    const searchBtn = document.getElementById('search');
    const newTripBlock = document.getElementById('new-trip');
    const tripListContent = document.getElementById('trips-list-content');
    const errorCloseBtn = document.querySelector('.js-err-close');
    
    //call by default
    displayAllTrips();

    // Event Listener: Click => on search button;
    searchBtn.addEventListener('click', () => {
            
            //check if the button is not disabled
            if(!searchBtn.classList.contains('disabled')) {

                //check the form data(validation)
                if(formValidation()) {

                    tripCreateSection.classList.remove('active');
                    tripCreateSection.classList.add('loading');
                    
                    //start to generate the data(from APIs)
                    generateNewTripData(formValidation())
                    .then(newTripData => {
                  
                        createNewTripBlock(newTripData)
                        tripCreateSection.classList.remove('loading');
                        tripCreateSection.classList.add('active');
                        
                    });
                }
            }
        
       

    });

    // Event Listener: Click => Add More Destinations;

    newTripBlock.addEventListener('click', () => {
        
        if(event.target.getAttribute('id') == 'add-more-destination') { 
            addMoreDestinations(newTripTemporaryHolder);
        }
       
    })

    // Event Listener: Click => Save New  Trip;
    newTripBlock.addEventListener('click', () => {
        
        if(event.target.getAttribute('id') == 'save-new-trip') { 
            saveNewTrip();
        }
       
    })

    // Event Listener: Click => Remove a Trip 
    tripListContent.addEventListener('click',function(event){

        if(event.target.classList.contains('remove-trip')) {
            removeTrip(event.target.dataset.tripNr);
            displayAllTrips();
        }
        
    },true);

    // Event Listener: Click => Print a Trip 
    tripListContent.addEventListener('click',function(event){

        if(event.target.classList.contains('print-trip')) {
            printTripBlock(event.target.closest('.trip-block').outerHTML);
        }
        
    },true);

    // Event Listener: Click => Close Error Message Block 
    errorCloseBtn.addEventListener('click',function(event){

        closeErrorMessage();
        
    },true);

});
