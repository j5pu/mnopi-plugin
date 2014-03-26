/**
 * Content Script to retrieve html code
 */
chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse){
        if (message.content == "getHtml"){
            sendResponse({'htmlCode': document.documentElement.innerHTML});

        } else {
            sendResponse(undefined);
        }
    }
)

