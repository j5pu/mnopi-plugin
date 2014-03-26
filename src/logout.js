$(function(){
    $('#logout').click(function(){
        chrome.extension.getBackgroundPage().logout()

        popup_window = chrome.extension.getViews({type:'popup'});
        if (popup_window.length > 0){
            popup_window[0].close();
        }
    })
})