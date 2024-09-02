import { LightningElement, wire } from 'lwc'; // Import LWC base class and wire service
import { NavigationMixin } from 'lightning/navigation'; // Import Navigation Mixin for navigating
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService'; // Import Message Service for subscribing to messages

// Import Account fields
import ACCOUNT_NAME from '@salesforce/schema/Account.Name';
import ACCOUNT_CONTRACT_START from '@salesforce/schema/Account.Dealer_Contarct_Start_Date__c';
import DEALER_PRIMARY_POC_FIELD from '@salesforce/schema/Account.Dealer_State__c';
import DEALER_Budget__c_FIELD from '@salesforce/schema/Account.Dealer_Budget__c';
import DEALER_Total_Sales_Revenue_FIELD from '@salesforce/schema/Account.Dealer_Total_Sales_Revenue__c';
import DEALER_Active_Pipeline_Value_FIELD from '@salesforce/schema/Account.Dealer_Active_Pipeline_Value__c';
import DEALER_Contract_End_Date__c_FIELD from '@salesforce/schema/Account.Dealer_Contarct_End_Date__c';
import DEALER_of_trained_Partner_contacts__c_FIELD from '@salesforce/schema/Account.Number_of_Trend_Partner_Contact__c';
import DEALER_Latitude_FIELD from '@salesforce/schema/Account.Dealer_GeoLocation__Latitude__s';
import DEALER_Longitude_FIELD from '@salesforce/schema/Account.Dealer_GeoLocation__Longitude__s';

// Import custom message channel
import DEALER_CHANNEL from '@salesforce/messageChannel/DealerMessageChannel__c';

export default class DealerDetail extends NavigationMixin(LightningElement) {

    objectApi = 'Account'; // Set the object API name to 'Account'
    selectedDealerAccountId; // Variable to store the selected dealer account ID
    channelName; // Variable to store the channel name
    selectedDealerAccountName; // Variable to store the selected dealer account name

    showLocation = false; // Flag to show or hide the location map

    subscription; // Variable to store the subscription reference

    @wire(MessageContext) messageContext; // Wire to get the message context

    // Expose properties to the template
    accountName = ACCOUNT_NAME;
    accContractStartDate = ACCOUNT_CONTRACT_START;
    primarypoc = DEALER_PRIMARY_POC_FIELD;
    budget = DEALER_Budget__c_FIELD;
    salesRevenue = DEALER_Total_Sales_Revenue_FIELD;
    activepipeline = DEALER_Active_Pipeline_Value_FIELD;
    contractEnd = DEALER_Contract_End_Date__c_FIELD;
    totalTrained = DEALER_of_trained_Partner_contacts__c_FIELD;
    dealerLatitude = DEALER_Latitude_FIELD;
    dealerLongitude = DEALER_Longitude_FIELD;

    // Lifecycle hook to subscribe to message channel when component is connected
    connectedCallback() {
        if (this.subscription) {
            return; // Return if already subscribed
        }

        // Subscribe to the dealer channel and process messages
        this.subscription = subscribe(this.messageContext, DEALER_CHANNEL, (message) => { this.processMessage(message) });
    }

    // Method to process received messages
    processMessage(message) {
        this.selectedDealerAccountId = message.selectedDealerAccountId;
        console.log('selectedDealerAccountId'+this.selectedDealerAccountId); // Set the selected dealer account ID
        this.channelName = message.channelName; // Set the channel name
        this.selectedDealerAccountName = message.selectedDealerAccountName; // Set the selected dealer account name
    }

    // Lifecycle hook to unsubscribe from message channel when component is disconnected
    disconnectedCallback() {
        unsubscribe(this.subscription); // Unsubscribe from the message channel
        this.subscription = null; // Clear the subscription reference
    }

    
    // Getter to check if a dealer is selected
    get IsDealerSelected() {
        return this.selectedDealerAccountId != null && this.selectedDealerAccountId.length > 0; // Return true if dealer is selected
    }

    
    // Handler for the "Add Dealer Review" button click
    onDealerReviewScreenFlow() {
        const flowURL = '/flow/Rate_Dealer_Performance?Dealer_Account=' + this.selectedDealerAccountId; // Construct the flow URL
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: flowURL // Navigate to the flow page
            },
        });
    }
}