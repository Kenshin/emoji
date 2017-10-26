console.log( "=== +emoji popup load ===" )

import 'popup_css';
import categories from 'categories';
import chardict   from 'chardict';

/***********************
 * Init
 ***********************/

var emojisByChar = {},
    allChars     = [],
    items        = chardict.items;

var faces, faces_wrapper, menu, copy_elem, feedback,
    baseUrl =  "../assets/faces"; // "https://mail.google.com/mail/e" //chrome.extension.getURL('faces');

for (var i in items) {
  if (items.hasOwnProperty(i)) {
    var ch = items[i].image.split('.')[0];
    emojisByChar[ch] = items[i];
    allChars.push(ch);
  }
}

if (typeof localStorage.recent == 'undefined')
    localStorage.recent = '';

/***********************
 * Enerty point
 ***********************/

// attach init event
// window.addEventListener('DOMContentLoaded', init, false);
init();

function init() {

    // face list
    faces            = document.getElementById("faces");
    faces_wrapper    = faces.parentNode;
    faces.onclick    = face_click;

    // load default category
    show_recent();

    // menu init
    menu             = document.getElementById("menu");
    menu.onmouseover = menu_click;

    // dummy elem used by copy and paste for text manipulation
    copy_elem        = document.createElement('input');
    copy_elem.id     = 'copy-container';
    document.body.appendChild(copy_elem);

    // copy and paste UI feedback elem
    feedback         = document.createElement('div');
    feedback.id      = 'feedback';
    document.body.appendChild(feedback);

    // after install show a category instead of an empty 'recent' list
    localStorage.recent == '' && menu_click({target: menu.getElementsByTagName('a')[1] });
}

// broadcast popup events
// highlight active textarea or input element on the current tab
getSelectedTab(function (tab) {
    chrome.tabs.sendMessage(tab.id, 'popup_opened');    // allFrames
    window.addEventListener('unload', function () {
        var bg = chrome.extension.getBackgroundPage();
        bg.chrome.tabs.sendMessage(tab.id, 'popup_closing');
    });
});

/***********************
 * Category
 ***********************/

function menu_click(e) {
    if (e.target.nodeName != 'A') return;
    document.getElementsByClassName('active')[0].classList.remove('active');
    e.target.classList.add('active')
    var category = e.target.hash.slice(1);
    faces_wrapper.scrollTop = 0;
    category == 'recent' ? show_recent() : show_category(category);
}

function show_category( category ) {
    var html = '';
    categories[category].forEach( function( face ) {
        var emoji = emojisByChar[face],
            image = emoji.image.replace( ".png", "" );
        html += '<img src="' + baseUrl  + '/' + emoji.image + '" ' +
                '     alt="' + emoji.chars[0] + '" title="' + emoji.name + '" ' +
                '     data-face="' + image + '" data-char="' + emoji.chars[0] + '" />';
    });
    faces.innerHTML = html;
}

function show_recent() {
    faces.innerHTML = "";
    var recent = localStorage.recent.split(',');
    if (!recent[0]) return;
    var html = "";
    recent.forEach(function (face) {
        var emoji = emojisByChar[face];
        html += '<img src="' + baseUrl  + '/' + emoji.image + '" ' +
                      '     alt="' + emoji.chars[0] + '" title="' + emoji.name + '" ' +
                      '     data-face="' + face + '" data-char="' + emoji.chars[0] + '" />';
    });
    faces.innerHTML = html;
    /*
    for (var i = 0; i < recent.length; i++) {
        var img = document.createElement("img");
        img.src = "img/" + recent[i] + ".png";
        img.dataset.face = recent[i];
        faces.appendChild(img);
    }
    */
}

/***********************
 * Face click
 ***********************/

var message_id;

function face_click(e) {

    if (e.target.nodeName != 'IMG') return;

    add_to_recent(e.target.dataset.face);
    addToMulti( e.target );

    const emoji = ` ${e.target.dataset.char} `;

    // if there's an input field waiting for a paste
    // let's give the face to him
    if (+localStorage.message_id)  {
        getSelectedTab( function ( tab ) {
          chrome.tabs.sendMessage( tab.id, {
              name: 'face_to_paste',
              id  : localStorage.message_id,
              face: emoji
          });
          notifcation( "success", "已插入", e.target );
          localStorage.message_id = 0;
          // allFrames
          //chrome.tabs.executeScript({
          //    allFrames: true,
          //    code: "paste_face({name:'face_to_paste', id:" +  localStorage.message_id + ", face: '" + e.target.dataset.char + "'})"
          //});
          //setTimeout(function () {
          //        window.close();
          //        chrome.tabs.update(tab.id, { active: true }, function () {})
          //}, 350);
        });
    } else {
        copyToClipboard( emoji );
        notifcation( "warning", "已复制", e.target );
    }
}

function add_to_recent(face) {
    var recent = localStorage.recent.split(',');
    var index = recent.indexOf(face);
    // remove if it's already listed
    if (index != -1)
        recent.splice(index, 1);
    // push to the beginning of the list
    if (recent[0])
        recent.unshift(face);
    else
        recent = [face];
    // limit the maximum number of recent faces
    recent = recent.slice(0, 63);
    localStorage.recent = recent.join(',');
}

function copyToClipboard(text) {
    copy_elem.value = text;
    copy_elem.select();
    document.execCommand("Copy", false, null);
}

function getSelectedTab(callback) {
    chrome.tabs.query(
        { currentWindow: true, active: true },
        function (array) { callback(array[0]); }
    );
}

/***********************
 * Feedback( notifcation )
 ***********************/

var feedback_animations = [];

/**
* Message watcher push
*
* @param {string} include: success warning failed
* @param {string} message
* @param {element} html element
*/
function notifcation( type, message, element ) {
    feedback.className = type +"-feedback";
    show_feedback( message, element );
}

function show_feedback(text, face) {
    feedback.style.display = 'block';
    center_to_ref(feedback, face);
    feedback.textContent = text;
    feedback_stop();
    feedback_defer(function () {
        feedback.style.opacity = 1;
        feedback_defer(function () {
            feedback.style.opacity = 0;
            feedback_defer(function () {
                feedback.style.display = 'none';
            }, 200);
        }, 1000);
    }, 1)
}

function feedback_defer(fn, time) {
    feedback_animations.push(setTimeout(fn, time));
}

function feedback_stop() {
    var timer;
    while (timer = feedback_animations.pop())
        clearTimeout(timer);
}

function center_to_ref(el, ref) {
    var el_rect = el.getBoundingClientRect();
    var ref_rect = ref.getBoundingClientRect();
    el.style.left = ref_rect.left - (el_rect.width/2 - ref_rect.width/2) + 'px';
    el.style.top = ref_rect.top - (el_rect.height/2 - ref_rect.height/2) + 'px';
}

/***********************
 * Tabs Scrollbar
 ***********************/

var is_scrolling  = true,
    last_scrolled = Date.now();

function update() {
    if (is_scrolling) {
        if (faces_wrapper.scrollTop)
            menu.classList.add('scrolled');
        else
            menu.classList.remove('scrolled');
        is_scrolling = false;
    }
    requestAnimationFrame(update);
}

faces_wrapper.onscroll = function () {
    is_scrolling = true;
}

update();

/***********************
 * Bottom controlbar
 ***********************/

/**
* Get settings from response
*/
chrome.runtime.sendMessage( "get_settings", function ( resp ) {
    if ( resp && resp.popup ) {
        $( "#action" ).attr( "class", resp.popup );
        $( "#action" ).text( resp.popup == "popup" ? "弹出" : "缩入" );
    }
});

/**
* Add emoji to multi-copy
*
* @param {html} html tag
*/
function addToMulti( element ) {
    $( "#multi-copy" ).append( $( element ).clone() );
}

/**
* Action element event handler
*/
$( "#action" ).click( function ( event ) {
    const value = $( "#action" ).attr( "class" ) == "window" ? "popup" : "window";
    setTimeout(function () {
        window.close();
        chrome.runtime.sendMessage({ id: "popup", value });
    }, 350 );
});

/**
* Copy element event handler
*/
$( "#copy" ).click( function ( event ) {
    const emojis = [];
    if ( $( "#multi-copy img" ).length > 0 ) {
        $( "#multi-copy img" ).map( function( idx, item ) { emojis.push( item.alt ); });
        copyToClipboard( emojis.join( " " ) );
        notifcation( "success", "已复制", $( "body" )[0] );
    } else {
        notifcation( "failed", "无内容", $( "body" )[0] );
    }
});

/**
* Clear element event handler
*/
$( "#clear" ).click( function ( event ) {
    $( "#multi-copy" ).html( "" );
    notifcation( "warning", "已清除", $( "body" )[0] );
});

/***********************
 * Comments
 ***********************/

/**
 * Send emoji to active tab
 * @param  {string} emoji
 */
/*
function sendMessage( emoji ) {
    chrome.tabs.query({ active: true, currentWindow: true}, function( tabs ) {
        chrome.tabs.sendMessage(tabs[0].id, { id: "insert", emoji: emoji });
    });
}
*/

// save active frame's message id for pasting
/*
// this was taken out!!!
chrome.extension.onMessage.addListener(function(message) {
    if (message.name == "input_to_popup") {
        message_id = message.id;
    }
});
chrome.extension.sendMessage({ name: "popup_open" });
*/
