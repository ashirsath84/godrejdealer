import { LightningElement } from 'lwc';

export default class MasterContainner extends LightningElement {

    selectedDealerStateId = ''; // Initialize selected dealer type ID

    // Handler for selected dealer type event
    handleSelectedDealerStateIEvent(event) {
        this.selectedDealerStateId = event.detail; // Update selected dealer type ID
    }
}