public with sharing class dealerSearchClass {
    
    @AuraEnabled(cacheable=true)
    
    public static list<Dealer_State__c> getAllDealerState(){
        try {

            return [select Id, Name from Dealer_State__c];
            
        } catch (Exception e) {

            throw new AuraHandledException(e.getMessage());
            
        }
    }
}