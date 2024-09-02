import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation'; // Import NavigationMixin for navigation
import fetchDealerState from '@salesforce/apex/dealerSearchClass.getAllDealerState'; // Import Apex method to fetch dealer types

export default class DealerSearch extends NavigationMixin (LightningElement) {


    description = "Godrej Interio is one of India's leading furniture brands, offering a wide range of home and office furniture solutions. Known for its innovative designs, ergonomic comfort, and sustainable practices, the brand focuses on creating eco-friendly and space-saving furniture. Godrej Interio serves various sectors, including residential, healthcare, educational, and corporate. The company emphasizes customer-centric designs and customization, ensuring functionality and aesthetics. With a strong presence across India, Godrej Interio operates through retail stores, exclusive showrooms, and online platforms.";
    dealerStateProperty; // Holds option dealer types for the combobox
    values = ''; // Stores the selected dealer type value


    // Handles change event when a dealer type is selected
    handleChange(event) {
        const dealerStateId = event.detail.value; // Get the selected value from the combobox
        // Dispatch a custom event with the selected dealer type ID
        const dealerStateSelectedChangeEvent = new CustomEvent('selecteddealerstate', { detail: dealerStateId });
        this.dispatchEvent(dealerStateSelectedChangeEvent);
    }

    // Wire to fetch dealer types from Apex
    @wire(fetchDealerState)
    processOutput({ data, error }) {
        if (data) {
            console.log('before Dealer Type : ' + JSON.stringify(data));
            // Initialize the dealer types array with a default option
            this.dealerStateProperty = [{ label: 'Select dealer State', value: '' }];

            // Iterate over the fetched data to populate dealer types
            data.forEach(item => {
                const dealerStateEach = {};
                dealerStateEach.label = item.Name;
                dealerStateEach.value = item.Id;
                this.dealerStateProperty.push(dealerStateEach);
            });

            console.log('after Dealer Type : ' + JSON.stringify(this.dealerStateProperty));
        } else if (error) {
            console.log('error  : ' + error.body.message); // Log error if any
        }
    }

    // Navigates to the standard page to create a new dealer type
    openNewDealerStateStdPage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Dealer_State__c',
                actionName: 'new'
            },
        });
    }

    // Navigates to the standard page to create a new account
    openNewAccountTypeStdPage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Account',
                actionName: 'new'
            },
        });
    }

    // Navigates to the standard page to create a new contact
    openNewContactTypeStdPage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Contact',
                actionName: 'new'
            },
        });
    }
}