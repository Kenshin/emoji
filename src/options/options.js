console.log( "=== +emoji options page load ===" )

import 'option_css';
import '../vender/notify/notify.css';

import Velocity  from 'velocity';
import Setting   from 'setting';

const versions = new Map([
    [ "1.0.0", "Fri Nov 03 2017 15:27:12 GMT+0800 (CST)" ],
    [ "1.1.0", "Mon Nov 06 2017 14:54:41 GMT+0800 (CST)" ],
]),
details = new Map([
    [ "1.0.0", "" ],
    [ "1.1.0", "新增「多选插入与直接插入」，" ],
]);

/***********************
 * Entry
 ***********************/

/**
* Entry: Get settings from response
*/
chrome.runtime.sendMessage( "get_settings", function ( resp ) {
    console.log( "get_settings", resp )
    $( "body" ).velocity({ opacity: 1 }, { duration: 1000, complete: ()=> {
        $( "body" ).removeAttr( "style" );
    }});
    hashnotify();
    settingRender( { ...resp } );
});

/**
 * Hash notify
 */
function hashnotify() {
    let type = location.search;
    if ( type.startsWith( "?first" ) ) {
        new Notify().Render( "+Emoji 版本提示", `感谢使用 +Emoji 😄 ，如需帮助请看 <a href="https://github.com/kenshin/emoji/wiki" target="_blank">入门指引</a>` );
    }
    else if ( type.startsWith( "?update" ) ) {
        type = type.replace( "?update=", "" ).replace( /\./ig, "" );
        new Notify().Render( "+Emoji 版本提示", ` 🎉 已升级到 ${type}，` + details.get(type) + `详细请看 <a href="https://github.com/Kenshin/emoji/blob/master/CHANGELOG.md#${type}" target="_blank">更新日志</a>` );
    }
    history.pushState( "", "", "/options/options.html" );
}

/**
 * Setting Render
 * 
 * @param {object} options
 */
function settingRender( options ) {
    ReactDOM.render( <Setting options={ options } />, $( ".setting" )[0] );
}

/***********************
 * Analytics
 ***********************/

// Google Analytics
chrome.runtime.sendMessage({ id: "analytics", value: { eventCategory: "option", eventAction : "open" }});

// Start of Async Drift Code
!function() {
  var t;
  if (t = window.driftt = window.drift = window.driftt || [], !t.init) return t.invoked ? void (window.console && console.error && console.error("Drift snippet included twice.")) : (t.invoked = !0, 
  t.methods = [ "identify", "config", "track", "reset", "debug", "show", "ping", "page", "hide", "off", "on" ], 
  t.factory = function(e) {
    return function() {
      var n;
      return n = Array.prototype.slice.call(arguments), n.unshift(e), t.push(n), t;
    };
  }, t.methods.forEach(function(e) {
    t[e] = t.factory(e);
  }), t.load = function(t) {
    var e, n, o, i;
    e = 3e5, i = Math.ceil(new Date() / e) * e, o = document.createElement("script"), 
    o.type = "text/javascript", o.async = !0, o.crossorigin = "anonymous", o.src = "https://js.driftt.com/include/" + i + "/" + t + ".js", 
    n = document.getElementsByTagName("script")[0], n.parentNode.insertBefore(o, n);
  });
}();
drift.SNIPPET_VERSION = '0.3.1';
drift.load('26857h5m5iad');