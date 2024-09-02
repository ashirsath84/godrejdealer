import { LightningElement, api, wire } from 'lwc'; // Import LWC classes
import myImage from '@salesforce/resourceUrl/godrej_interio'; //static resources
import { publish, MessageContext } from 'lightning/messageService'; // Import Lightning Message Service methods
import DEALER_CHANNEL from '@salesforce/messageChannel/DealerMessageChannel__c'; // Import custom message channel

export default class DealerCard extends LightningElement {
    
    @api dealerAccount; // Public property to receive dealer account data
    @api selectedDealerAccountId; // Public property to hold the selected dealer's ID

    @wire(MessageContext) messageContext; // Wire method to get the message context for LMS

    channelDealerStyle; // Variable to hold the CSS class for dealer type

    userImg = myImage; // Default image URL

 
    // Lifecycle hook called when the component is inserted into the DOM
    connectedCallback() {
        // Set the dealer type style based on the dealer type
        this.getDealerTypeStyle(this.dealerAccount.Dealer_State__r.Name);

        // Set the user image based on the salutation of the primary POC
        this.getUserImg(this.dealerAccount.Dealer_State__r.Name);
    }

    // Method to determine the dealer type style
    getDealerTypeStyle(dealerState) {
        switch (dealerState) {
            // Add additional cases for different dealer types if needed
            default:
                this.channelDealerStyle = 'slds-theme_success'; // Default CSS class for dealer type
                break;
        }
    }

    // Method to set the user image based on salutation
    getUserImg(salutation) {
        const randomId = Math.floor(Math.random() * 100); // Generate a random ID for user images

        switch (salutation) {
            case 'Maharashtra':
                console.log('MR');
                this.userImg = myImage; // Male image
                break;

            case 'Goa':
                console.log('Ms');
                this.userImg = `https://randomuser.me/api/portraits/thumb/women/${randomId}.jpg`; // Female image
                break;

            default:
                console.log('de');
                this.userImg = `https://randomuser.me/api/portraits/thumb/men/${randomId}.jpg`; // Default image
                break;
        }
    }

    handleSelectedDealerAccount(event) {
        const dealerAccountId = this.dealerAccount.Id; // Get the ID of the dealer account

        // Dispatch a custom event to notify the parent component of the selection
        const dealerAccountSelect = new CustomEvent('dealerselect', {
            detail: dealerAccountId
        });
        this.dispatchEvent(dealerAccountSelect);

        // Message to be published through the Lightning Message Service
        const msgToPublish = {
            selectedDealerAccountId: this.dealerAccount.Id,
            channelName: 'Dealer Name', // Example channel name
            selectedDealerAccountName: this.dealerAccount.Name // Dealer account name
        };

        // Publish the message to the DEALER_CHANNEL
        publish(this.messageContext, DEALER_CHANNEL, msgToPublish);
    }
     // Getter to dynamically set the CSS class based on the selection
     get dealerCardStyle() {
        if (this.dealerAccount.Id == this.selectedDealerAccountId) {
            return 'tile selected'; // CSS class when dealer is selected
        } else {
            return 'tile'; // Default CSS class
        }
    }
}
