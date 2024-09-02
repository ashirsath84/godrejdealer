import { LightningElement, api, wire } from 'lwc';
import getDealerReviews from '@salesforce/apex/DealerReviewController.getDealerReview';
import DEALER_CHANNEL from '@salesforce/messageChannel/DealerMessageChannel__c';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import { NavigationMixin } from 'lightning/navigation'; // Import Navigation Mixin for navigating

export default class ViewDealerReview extends  NavigationMixin(LightningElement)  {
    subcription;
    @wire(MessageContext) messageContext;
    dealerAccountId;
    channelName;
    selectedDealerAccountId
    selectedDealerAccountName;
    dealerReviews = null;
    dealer;
    recordIndex = 0;
    
    connectedCallback(){
        // Subscribe to the message channel when the component is connected
        if(this.subcription){
            return;
        }
        this.subcription = subscribe(this.messageContext, DEALER_CHANNEL, (message) => {this.processMessage(message)});
    }
    
    processMessage(message){
        // Process the incoming message and update component properties
        this.dealerAccountId = message.selectedDealerAccountId;
        this.channelName = message.channelName;
        this.selectedDealerAccountName = message.selectedDealerAccountName;
    }

    discconnectedCallBack(){
        // Unsubscribe from the message channel when the component is disconnected
        unsubscribe(this.subcription);
        this.subcription = null;
    }
    
    @wire(getDealerReviews, {dealerAccountId:'$dealerAccountId'})
    processOutput({data,error}){
        // Wire method to fetch dealer reviews
        if(data){
            this.dealerReviews = data;
            if(this.dealerReviewsFound){
                this.getCurrentDealerReview();
            }
        } else if(error){
            console.log('error');
        }
    }

    getCurrentDealerReview(){
        // Get the current dealer review based on the record index
        this.dealer = this.dealerReviews[this.recordIndex];
    }

    navigateNextReview(){
        // Navigate to the next dealer review
        if(this.recordIndex == this.dealerReviews.length -1){
            this.recordIndex = this.dealerReviews.length -1;
        } else {
            this.recordIndex++;
        }
        this.getCurrentDealerReview(); 
    }

    navigatepreviousReview(){
        // Navigate to the previous dealer review
        if(this.recordIndex <= 0){
            this.recordIndex = 0;
        } else {
            this.recordIndex--;
        }
        this.getCurrentDealerReview(); 
    }

    get dealerReviewsFound(){
        // Check if dealer reviews are available
        return this.dealerReviews != null && this.dealerReviews.length > 0;
    }

    get IsDealerSelected(){
        // Check if a dealer is selected
        return this.dealerAccountId != null && this.dealerAccountId.length > 0;
    }

    addReview(event){
       
        const flowURL = '/flow/Rate_Dealer_Performance?Dealer_Account=' + this.dealerAccountId; // Construct the flow URL
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: flowURL // Navigate to the flow page
            },
        });
      
    }
}
