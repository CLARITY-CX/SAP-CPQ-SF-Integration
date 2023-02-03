({
    doInit : function(component, event, helper) { 
        let action = component.get("c.getAccessToken");
        action.setCallback(this,function(response){ 
            let accessToken; 
            let state = response.getState();
            if (state === 'SUCCESS'){ 
                accessToken = response.getReturnValue(); 
                var recordId = component.get("v.recordId");
                //Get ParentId if recordId is empty
                if ( ! recordId ) {
                    var parameterValue = helper.getParameterByName(component , event, 'inContextOfRef');
                    var addressableContext = JSON.parse(window.atob(parameterValue));
                    recordId = addressableContext.attributes.recordId;
                }
                var urlEvent = $A.get("e.force:navigateToURL"); 
                urlEvent.setParams({ 
                    "url": "/apex/cpqquoterouter?recordid=" + recordId + "&token=" + accessToken + "&action=create" 
                }); 
                urlEvent.fire();
            } else if (state === 'ERROR') {
                $A.get("e.force:closeQuickAction").fire();
                let errorMsgObject = response.getError();
                let exceptionType = errorMsgObject[0].hasOwnProperty('exceptionType') ? errorMsgObject[0].exceptionType + '. ' : '';
                let stackTrace = errorMsgObject[0].hasOwnProperty('stackTrace') ? '. ' + errorMsgObject[0].stackTrace : '';
                let finalMessage = exceptionType + errorMsgObject[0].message + stackTrace;
                var showToast = component.find('notifyId').showToast({
                    variant: "error",
                    title: "Error!",
                    message: finalMessage
                });
                showToast.fire();
            } 
        }); 
        $A.enqueueAction(action);   
    }
})