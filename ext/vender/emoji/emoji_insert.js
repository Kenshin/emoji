!function a(e){function n(){var e=o.getElementsByTagName("iframe");[].forEach.call(e,function(e){e.src||e.$emoji||(e.$emoji=!0,a(e.contentWindow))})}function i(a){h=null,r(o.activeElement)&&(h=o.activeElement),a&&r(a.target)&&(h=a.target),h?(p=+new Date,browser.runtime.sendMessage({name:"input_selected",id:p})):(p=0,browser.runtime.sendMessage({name:"input_deselected"}))}function r(a){var e="INPUT"==a.nodeName&&"text"==a.type,n="TEXTAREA"==a.nodeName;return e||n||a.isContentEditable}function m(a){var n=a.target;if(r(n)&&!n.dataset.emoji_font){n.dataset.emoji_font=!0;var i=e.getComputedStyle(n)["font-family"];i=i||"monospace",n.style.cssText+="; font-family:"+i+', "Segoe UI Emoji", "Segoe UI Symbol", Symbola, EmojiSymbols !important;'}}function g(a){function n(){if(e.getSelection().rangeCount&&(h.onfocus=null,clearTimeout(i)),h.isContentEditable)if(_){t=e.getSelection().focusOffset+a.face.length;h.$emoji_cursor=t;var n=o.createTextNode(a.face);d(n),h.$cursorNode=n}else o.execCommand("insertHTML",!1,a.face);else{var r=h.selectionStart,m=h.value.slice(0,r),g=h.value.slice(r),s=m+a.face+g;h.value=s;var t=r+a.face.length;h.setSelectionRange(t,t),_&&(h.$emoji_cursor=t,h.$emoji_length=s.length),c(h),setTimeout(function(){h.blur(),h.focus()},1)}}if("face_to_paste"==a.name&&a.id==p&&h){l&&t(h),h.onfocus=n,h.focus();var i=setTimeout(n,1)}}function s(a){setTimeout(function(){var n=a.target.$emoji_cursor;if(void 0!==n)if(/input|textarea/i.test(a.target.nodeName))a.target.value.length==a.target.$emoji_length?a.target.setSelectionRange(n,n):(delete a.target.$emoji_cursor,delete a.target.$emoji_length);else if(a.target.isContentEditable){var i=e.getSelection(),r=a.target.$cursorNode;r&&(i.collapse(r,r.length),delete a.target.$cursorNode)}},1)}function c(a){a=a||o;var n=o.createEvent("KeyboardEvent");n[void 0!==n.initKeyboardEvent?"initKeyboardEvent":"initKeyEvent"]("keydown",!0,!0,e,!0,!1,!1,!1,17,0),a.dispatchEvent(n)}function t(a){a.classList.contains("DOMControl_placeholder")&&(a.classList.remove("DOMControl_placeholder"),a.value="")}function d(a){var n;return(n=e.getSelection().getRangeAt(0)).insertNode(a),n}var o=e.document;n(),e.initPasteFrameInstances=n;var h,p=0,l=/facebook\.com/.test(o.domain),_=/^(mail|plus|talkgadget)\.google/.test(o.domain);!1||(o.onmousedown=o.onkeydown=i,o.addEventListener("focus",i,!0)),o.addEventListener("focus",m,!0),browser.runtime.onMessage.addListener(function(a){if("face_to_paste"==a.name&&a.id==p&&h)g(a);else if("popup_opened"==a)h&&h.classList.add("flashinginput");else if("popup_closing"==a){var e=o.getElementsByClassName("flashinginput")[0];e&&e.classList.remove("flashinginput")}}),_&&o.addEventListener("focus",s,!0)}(window);