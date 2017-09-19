console.log( "=== +emoji background load ===" )

/***********************
 * Init
 ***********************/

setDefaultSettings();
chrome.extension.onMessage.addListener(listener);

function setDefaultSettings() {
    if (typeof localStorage.scale == 'undefined')
        localStorage.scale = 1.0;
    if (typeof localStorage.hidePUA == 'undefined')
        localStorage.hidePUA = 'true';
    if (typeof localStorage.usefont == 'undefined')
        localStorage.usefont = 'false';
    if (typeof localStorage.blacklist == 'undefined')
        localStorage.blacklist = 'example.com, another-example.com';
    if (typeof localStorage.popup == 'undefined')
        localStorage.popup = 'popup';
}

function listener(request, sender, sendResponse) {
    if (request == 'get_settings') {
        var blacklist = localStorage.blacklist;
        blacklist = blacklist.replace(/\n/g, ',');
        blacklist = blacklist.replace(/,+/g, ',');
        blacklist = blacklist.replace(/^,|,$/g, '');
        blacklist = blacklist.split(',');

        for (var i = blacklist.length; i--;)
            blacklist[i] = blacklist[i].trim();

        if (blacklist.length == 1 && !blacklist[0])
            blacklist = [];

        sendResponse({
            scale     : localStorage.scale,
            usefont   : localStorage.usefont == 'true',
            hidePUA   : localStorage.hidePUA == 'true',
            blacklist : blacklist,
            popup     : localStorage.popup,
        });
    } else if ( request && request.id == "popup" ) {
        localStorage.popup = request.value;
        localStorage.popup == "popup" ? removeWindow() : createWindow();
        localStorage.popup == "popup" ? chrome.browserAction.setPopup({ popup: popup_url }) : chrome.browserAction.setPopup({ popup: "" });
    }
    /*
    if (request == 'insertCSS') {
        chrome.tabs.insertCSS(sender.tab.id, {
          file: 'backup/sprite/sprite.css',
          allFrames: true
        })
        return true
    }
    */
}

/***********************
 * Emoji pasting
 ***********************/

localStorage.message_id = 0;

// listen to other tabs, last one always overwrites the others
chrome.extension.onMessage.addListener(function (message) {
    if (message.name == "input_deselected") {
        localStorage.message_id = 0;
    }
    else if (message.name == "input_selected") {
        localStorage.message_id = message.id;
    }
});

// changing tabs should invalidate pending messages
chrome.tabs.onActivated.addListener(function () {
    localStorage.message_id = 0;
});

/***********************
 * Browser action
 ***********************/

const popup_url = "popup/popup.html";
let   popup     = {};

chrome.browserAction.onClicked.addListener( function( event ) {
    if ( popup && popup.id ) {
        removeWindow();
    } else {
        createWindow();
    }
});

chrome.windows.onRemoved.addListener( function( windowId ) {
    if ( windowId == popup.id ) popup = {};
});

/**
 * Create popup window
 */
function createWindow() {
    chrome.tabs.create({
        url        : chrome.extension.getURL( popup_url ),
        active     : false
    }, function ( tab ) {
        chrome.windows.create({
            tabId  : tab.id,
            type   : "popup",
            focused: true,
            width  : 353, height : 290,
        }, function ( window ) { popup = window; });
    });
}

/**
 * Remove popup window
 */
function removeWindow() {
    chrome.windows.remove( popup.id );
    popup = {};
}

localStorage.popup == "popup" ? chrome.browserAction.setPopup({ popup: popup_url }) : chrome.browserAction.setPopup({ popup: "" });