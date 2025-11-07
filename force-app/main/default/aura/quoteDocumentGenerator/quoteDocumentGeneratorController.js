({
    doInit : function(component, event, helper) { 
        let action = component.get("c.getAccessToken");
        action.setCallback(this,function(response){ 
            let state = response.getState();
            let experience = component.get("v.experience");
            if (state === 'SUCCESS') { 
                let recordId = experience == 'lightning' ? component.get("v.recordId") : component.get("v.sobjectid"); 
                //Get ParentId if recordId is empty
                if ( ! recordId ) {
                    let parameterValue = helper.getParameterByName(component , event, 'inContextOfRef');
                    let addressableContext = JSON.parse(window.atob(parameterValue));
                    recordId = addressableContext.attributes.recordId;
                }
                let accessToken = response.getReturnValue();
                let uniqueId = Date.now() + '_' + Math.random().toString(36).slice(2, 11) + '_' + $A.get("$SObjectType.CurrentUser.Id");
                let url = "/apex/cpqquoterouter?recordid=" + recordId + "&token=" + accessToken + "&action=create&uniqueId=" + uniqueId;
                if (experience == 'lightning') {
                    let urlEvent = $A.get("e.force:navigateToURL");
                    urlEvent.setParams({ 
                        "url": url
                    }); 
                    urlEvent.fire();
                } else {
                    window.location = url;
                }
            } else if (state === 'ERROR') {
                if (experience == 'lightning') {
                    helper.showToastMessage(component, response, 'Error!', 'error');
                } else {
                    helper.showToastMessageInSFClassic(component, response, 'Error!', 'error');
                }
            } 
        }); 
        $A.enqueueAction(action);   
    }
})