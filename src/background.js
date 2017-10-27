console.log( "=== +emoji background load ===" )

/***********************
 * Init
 ***********************/

const storage = {
    version : "1.0.0",
    message_id: 0,
    popup   : "popup",
    blank   : false,
    clip    : false,
    clicked : false,
    advanced: false,
    trigger : "",
    regexp  : "",
    blacklist: [
        "twitter.com",
        "google.com"
    ]
};

initialize();
chrome.extension.onMessage.addListener( listener );

/**
 * Conver local storage
 * 
 * @param {object} local storage
 */
function conver( object ) {
    const news = { ...object };
    Object.keys( news ).forEach( key => {
        news[key] == "true"  && ( news[key] = true );
        news[key] == "false" && ( news[key] = false );
    });
    return news;
}

/**
 * Initialize
 */
function initialize() {
    Object.keys( storage ).forEach( key => {
        localStorage[key] == undefined && ( localStorage[key] = storage[key] );
    });
    console.log( localStorage )
}

/**
 * Lister chorme message
 * 
 * @param {object} request
 * @param {object} sender
 * @param {object} sendResponse
 */
function listener( request, sender, sendResponse ) {
    if ( request == "get_settings" ) {
        sendResponse( conver( localStorage ));
    } else if ( request && request.id == "popup" ) {
        localStorage.popup = request.value;
        localStorage.popup == "popup" ? removeWindow() : createWindow();
        localStorage.popup == "popup" ? chrome.browserAction.setPopup({ popup: popup_url }) : chrome.browserAction.setPopup({ popup: "" });
    } else if ( request && request.id == "set_settings" ) {
        Object.keys( request.value ).forEach( key => {
            localStorage[key] = request.value[key];
        });
    } else if ( request && request.id == "clear_settings" ) {
        localStorage.clear();
        initialize();
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