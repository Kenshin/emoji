//
// (c) 2014 Loco Mojis
// All Rights Reserved.
//
// You can study the code for learning purposes.
// You can use it on noncommercial websites.
// But you are not allowed to redistribute
// this as an extension in whole or in part.
// You are not allowed to use the replacement
// engine inside commercial software without
// the author's permission.
// This license should be included in all cases.
// Contact: locomojis@gmail.com
//
(function pasteEmojiIntoFrame(window) {

var document = window.document;

// run new instances inside dynamic iframes
function initPasteFrameInstances() {
	var iframes = document.getElementsByTagName('iframe');
	[].forEach.call(iframes, function (frame) {
		if (!frame.src && !frame.$emoji) {
			frame.$emoji = true;
			pasteEmojiIntoFrame(frame.contentWindow);
		}
	});
}
initPasteFrameInstances();

// make it global so mutation listeners can call this
window.initPasteFrameInstances = initPasteFrameInstances;

// keep track of active input element
var pending_message_id = 0;
var activeElement;
var is_facebook = /facebook\.com/.test(document.domain);
var is_gchat = /^(mail|plus|talkgadget)\.google/.test(document.domain);
var excluded = false;

if (!excluded) {
	document.onmousedown = document.onkeydown = listener;
	document.addEventListener('focus', listener, true); // focus event doesn't bubble
}


// broadcast selection to all other tabs
function listener(e) {
	activeElement = null;

	if (isInputElement(document.activeElement))
		activeElement = document.activeElement;
	if (e && isInputElement(e.target))
		activeElement = e.target;

	if (activeElement) {
		pending_message_id = +new Date;
		chrome.extension.sendMessage({ name: "input_selected", id: pending_message_id });
	} else {
		pending_message_id = 0;
		chrome.extension.sendMessage({ name: "input_deselected" });
	}
}

function isInputElement(el) {
  var isTextInput = (el.nodeName == 'INPUT' && el.type == 'text');
  var isTextArea  = (el.nodeName == 'TEXTAREA');
  return isTextInput || isTextArea || el.isContentEditable;
}

function onFocusExtendFont(e) {
  var el = e.target;
  if (isInputElement(el) && !el.dataset.emoji_font) {
      el.dataset.emoji_font = true;
      var font = window.getComputedStyle(el)['font-family'];
      font = font || 'monospace';
      el.style.cssText += '; font-family:' + font + ', "Segoe UI Emoji", ' +
                          '"Segoe UI Symbol", Symbola, EmojiSymbols !important;';
  }
}

document.addEventListener('focus', onFocusExtendFont, true); // doesn't bubble


// listen to other tabs, last one always overwrites the others
chrome.extension.onMessage.addListener(function (message) {
	// popup sent back a face to paste & it's addressed to our message id
	if (message.name == "face_to_paste" && message.id == pending_message_id && activeElement) {
		 paste_face(message);
	}
	// highlight active textarea or input element on the current tab
	else if (message == "popup_opened") {
		activeElement && (activeElement.classList.add('flashinginput'));
	}
	// remove highlighting
	else if (message == "popup_closing") {
		var flashinginput = document.getElementsByClassName('flashinginput')[0];
		flashinginput && (flashinginput.classList.remove('flashinginput'));
	}
});


function paste_face(message) {

	if (message.name == "face_to_paste" && message.id == pending_message_id && activeElement) {

		// FB tricks
		if (is_facebook) {
			fb_remove_placeholder(activeElement);
		}

		function on_focus() {

			// if we have the focus yet
			// we remove the remaining listeners
			if (window.getSelection().rangeCount) {
				activeElement.onfocus = null;
				clearTimeout(focus_timer)
			}

			// document.execCommand("insertHTML", false, message.face);

			if (activeElement.isContentEditable) {
				if (is_gchat) {
					var cursor = window.getSelection().focusOffset + message.face.length;
					activeElement.$emoji_cursor = cursor;
					//insertHtmlAtCursor(message.face);
					var node = document.createTextNode(message.face);
					insertNodeAtCursor(node);
					activeElement.$cursorNode = node;
				} else {
					document.execCommand("insertHTML", false, message.face);
				}
				return;
			}

			var index = activeElement.selectionStart;

			// insert emoticon at cursor position
			var first_part = activeElement.value.slice(0, index);
			var last_part  = activeElement.value.slice(index);
			var new_value  = first_part + message.face + last_part;
			activeElement.value = new_value;


			// move cursor after the new emoticon
			var cursor = index + message.face.length;
			activeElement.setSelectionRange(cursor, cursor);

			// gchat only
			if (is_gchat) {
				activeElement.$emoji_cursor = cursor;
				activeElement.$emoji_length = new_value.length;
			}

			// can't remember what this is for... :-)
			//listener({target: activeElement});

      // trick to trigger auto resize for textareas
			fire_keyboard_event(activeElement);

			// trick to scroll to the cursor position
			setTimeout(function () {
				activeElement.blur();
				activeElement.focus();
			}, 1);
		}

		// double safety focus detection
		// for custom made contentEditables
		activeElement.onfocus = on_focus;
		activeElement.focus();
		var focus_timer = setTimeout(on_focus, 1);
	}
}

//////////////////////////////////////////////////////////////////
// gchat & twitter fix, because it uses custom code for its cursor

function restore_cursor(e) {
	setTimeout(function () {
		var cursor = e.target.$emoji_cursor;
		if (typeof cursor == 'undefined')
			return;
		// put the cursor after the inserted face
		if (/input|textarea/i.test(e.target.nodeName)) {
			if (e.target.value.length == e.target.$emoji_length)  {
				e.target.setSelectionRange(cursor, cursor);
			} else {
				delete e.target.$emoji_cursor;
				delete e.target.$emoji_length;
			}
		} else if (e.target.isContentEditable) {
			var sel = window.getSelection();
			var insertedFace = e.target.$cursorNode;
			if (insertedFace) {
				sel.collapse(insertedFace, insertedFace.length);
				delete e.target.$cursorNode;
			}
		}
	}, 1);
}

if (is_gchat) {
	document.addEventListener('focus', restore_cursor, true); // doesn't bubble
}

//////////////////////////////////////////////////////////////////

//
// Helpers
//

// needed for triggering auto resizing textboxes
function fire_keyboard_event(target) {
	target = target || document;
	var keyboardEvent = document.createEvent("KeyboardEvent");
	var initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined'
	                         ? "initKeyboardEvent"
	                         : "initKeyEvent";
	keyboardEvent[initMethod]("keydown", true, true, window,
	                           true, false, false, false, 17, 0
	);
	target.dispatchEvent(keyboardEvent);
}

function remove_wbr_tags(node) {
	// remove wbr elements (static copy first)
	var wbrs = [].slice.call(node.getElementsByTagName('wbr'));
	var parents = [];
	[].forEach.call(wbrs, function (wbr) {
		parents.push(wbr.parentNode);
		wbr.parentNode.removeChild(wbr);
	});
	// merge remainig content
	// TODO: only unique parents!
	[].forEach.call(parents, function (parent) {
		if (parent.childElementCount == 0) {
			parent.textContent = parent.textContent;
		}
	});
}

function fb_remove_placeholder(el) {
	if (el.classList.contains('DOMControl_placeholder')) {
		el.classList.remove('DOMControl_placeholder');
		el.value = '';
	}
}




//
// Insert Into ContentEditable
//

function insertNodeAtCursor(node) {
    var range, html;
    range = window.getSelection().getRangeAt(0);
    range.insertNode(node);
    return range;
}

function insertHtmlAtCursor(html) {
    var range, node;
    range = window.getSelection().getRangeAt(0);
    node = range.createContextualFragment(html);
    range.insertNode(node);
    return range;
}


})(window);