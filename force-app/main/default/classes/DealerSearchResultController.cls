public with sharing class DealerSearchResultController {
   
        @AuraEnabled(cacheable=true)
        public static list<account> getDealers(String dealerStateId ){
    
            if(String.isEmpty(dealerStateId)){
                system.debug('emptydealerStateId');
                return [SELECT Id, Name, Dealer_State__c, Dealer_State__r.Name, Dealer_Budget__c, Dealer_Total_Sales_Revenue__c, Dealer_Active_Pipeline_Value__c,
                Dealer_Primary_POC__c, Dealer_Primary_POC__r.Name,Dealer_Primary_POC__r.title, Dealer_Primary_POC__r.Salutation, Dealer_Contarct_Start_Date__c, Dealer_Contarct_End_Date__c, Dealer_Training_Completed__c, 
                Dealer_Status__c, Number_of_trend_Partner_contact__c, Dealer_WebSite__c, Dealer_Geolocation__Latitude__s, 
                Dealer_Geolocation__Longitude__s, Dealer_Geolocation__c,(Select FirstName,LastName,title,Salutation from Contacts) FROM Account WHERE Dealer_Status__c IN ('Active','Inactive','Pending')];
            } else{
                system.debug('dealerStateId'+dealerStateId);
                return [SELECT Id, Name, Dealer_State__c, Dealer_State__r.Name, Dealer_Budget__c, Dealer_Total_Sales_Revenue__c, Dealer_Active_Pipeline_Value__c,
            Dealer_Primary_POC__c, Dealer_Primary_POC__r.Name,Dealer_Primary_POC__r.title, Dealer_Primary_POC__r.Salutation, Dealer_Contarct_Start_Date__c, Dealer_Contarct_End_Date__c, Dealer_Training_Completed__c, 
            Dealer_Status__c, Number_of_trend_Partner_contact__c, Dealer_WebSite__c, Dealer_Geolocation__Latitude__s, 
            Dealer_Geolocation__Longitude__s, Dealer_Geolocation__c,(Select FirstName,LastName,title,Salutation from Contacts) FROM Account WHERE Dealer_Status__c IN ('Active','Inactive','Pending') AND Dealer_State__c =: dealerStateId];
            }
            
        }
    }
