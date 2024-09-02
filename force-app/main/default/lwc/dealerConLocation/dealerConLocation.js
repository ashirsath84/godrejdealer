import { LightningElement, api, wire } from 'lwc'; // Importing LWC classes

import { getRecord } from 'lightning/uiRecordApi'; // Import method to fetch records

import LEAFLET from '@salesforce/resourceUrl/leaflet'; // Import static resource for Leaflet

import { loadScript, loadStyle } from 'lightning/platformResourceLoader'; // Import methods to load external scripts and styles

// Fields to fetch latitude and longitude from Account object
const FIELDS = [
    'Account.Dealer_Geolocation__Latitude__s',
    'Account.Dealer_Geolocation__Longitude__s'
];

export default class DealerConLocation extends LightningElement {
    
    @api dealerAccountId; // Public property to receive dealer account Id

    latitude; // Property to store latitude
    longitude; // Property to store longitude

    leafletMap; // Property to store Leaflet map instance

    // Wire method to get latitude and longitude based on dealer account Id
    @wire(getRecord, { recordId: '$dealerAccountId', fields: FIELDS })
    processOutput({ data, error }) {
        if (data) {
            // Assign latitude and longitude values to properties
            this.latitude = data.fields.Dealer_Geolocation__Latitude__s.value;
            this.longitude = data.fields.Dealer_Geolocation__Longitude__s.value;
            
            // Log the latitude and longitude to console for debugging
            console.log('lat:' + data.fields.Dealer_Geolocation__Latitude__s.value);
            console.log('longt:' + data.fields.Dealer_Geolocation__Longitude__s.value);
        } else if (error) {
            // Log error to console if fetching data fails
            console.log('Error');
        }
    }

    // Lifecycle hook called when component is inserted into the DOM
    connectedCallback() {
        // Load Leaflet script and styles
        Promise.all([
            loadStyle(this, LEAFLET + '/leaflet.css'), // Load Leaflet CSS
            loadScript(this, LEAFLET + '/leaflet.js') // Load Leaflet JS
        ]).then(() => {
            // Call plotMap method after scripts and styles are loaded
            this.plotMap();
        });
    }

    // Method to initialize and plot the Leaflet map
    plotMap() {
        // Find the div where the map will be plotted
        const map = this.template.querySelector('.map');
        if (map) {
            // Initialize the Leaflet map with zoom control enabled
            this.leafletMap = L.map(map, { zoomControl: true }).setView([this.latitude, this.longitude], 13);
            
            // Add tile layer to the map (you can change the URL for different maps)
            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Contact Location' // Attribution for the map tiles
            }).addTo(this.leafletMap);
        }

        // Define the location using latitude and longitude
        const location = [this.latitude, this.longitude];

        // Create a marker and add it to the map
        const leafletMarker = L.marker(location);
        leafletMarker.addTo(this.leafletMap);

        // Center the map view at the location
        this.leafletMap.setView(location);
    }
}
