console.log( "=== +emoji contentscripts load ===" )

//import minimatch  from 'minimatch';

// (::|[\uff1a]{2})(([\u4e00-\u9fa5]|[a-zA-Z ])+ $)
const trigger = {
    prefix: "::|[\uff1a]{2}",
    suffix: "([\u4e00-\u9fa5]|[a-zA-Z ])+ "
},
faces = new Map();

let $input, storage,
    insert_type = "normal", // include: normal, key and menu
    status  = "pending",
    reg     = new RegExp( trigger.prefix + trigger.suffix );

/**
 * is black list
 * 
 * @returns {boolean} true: is black list false: not is black list
 */
function isBlacklist() {
    const list = storage.blacklist.split( "," ),
          idx  = list.findIndex( url => {
            if ( !url.startsWith( "http" ) && url == window.location.host.replace( "www.", "" ) ) {
                return true;
            }
            /*
            else if ( url.startsWith( "http" ) && minimatch( window.location.href, url ) ) {
                return true;
            }
            */
    });
    return idx == -1 ? false : true;
}

/**
* Entry
*/
browser.runtime.sendMessage( "get_settings", function ( resp ) {
    console.log( "get_settings", resp )
    status  = "complete";
    storage = $.extend( {}, resp );

    storage.trigger_prefix != "" && ( trigger.prefix = storage.trigger_prefix );
    storage.trigger_suffix != "" && ( trigger.suffix = storage.trigger_suffix );
    reg = new RegExp( `(${trigger.prefix})` + `(${trigger.suffix})` );
    console.log( "current regexp is ", reg, reg.source )

    !isBlacklist() && $( "body" ).bind( "keyup", keyUpEventHandler );
});

/**
 * Listen keyup / keydown event
 *
 * watch key:
 * - All key     : when include reg insert dropdown
 * - ESC( 27 )   : remove insert
 * - Tab( 9  )   : click tab highlight face
 * - Enter( 13 ) : enter click highlight face
 */
function keyUpEventHandler( event ) {
    if ( event.keyCode == 27 ) {
        $( "body" ).find( "#simpemoji" ).length > 0 && remove( true );
    } else if ( event.keyCode == 9 ) {
        $( "body" ).find( "#simpemoji" ).length > 0 && insert_type == "key" && highlight();
    } else if ( event.keyCode == 13 ) {
        $( "body" ).find( "#simpemoji img" ).length > 0 && insert_type == "key" && enter();
    } else {
        if ( reg.test( event.target.value ) && insert_type != "menu" ) {
            $input      = $( event.target );
            insert_type = "key";
            $( "body" ).on( "keydown", bodyKeydownHandler );
            if ( $( "body" ).find( "#simpemoji" ).length == 0 ) {
                face( $input.val().match( reg )[0] );
            } else {
                $( "#simpemoji"      ).off().remove();
                face( $input.val().match( reg )[0] );
            }
            $input.keydown( inputKeydownHandler );
            $input.one( "blur", event => event.target.focus() );
        }
    }
}

/**
 * Add face, mode:
 * 
 * - single   insert e.g. [::<same keyword> ]
 * - multiple insert e.g. right click menu
 * - directly insert
 *
 * @param  {string} [::<same keyword> ]
 */
function face( filter ) {
    const reg     = new RegExp( `(${trigger.prefix})| `, "ig" );
    filter        = filter.replace( reg, "" );
    let   html    = "", count = 0, char = "";
    const baseUrl = browser.extension.getURL( "assets/faces/" ),
          render  = ( item, type ) => {
            count++;
            char  = item.chars[0];
            html += '<img src="' + baseUrl + item.image + '" ' +
                    '     alt="' + item.chars[0] + '" title="' + item.name + '" ' +
                    '     data-face="' + type + '" data-char="' + item.chars[0] + '" />';
          };
    faces.size == 0 && chardict.items.forEach( item => faces.set( item.image, item ));

    if ( filter.match( /[\u4e00-\u9fa5]+/ )) {
        const chars  = new Set();
        Object.keys( zh_emoji ).forEach( item => {
            item.includes( filter ) &&
                zh_emoji[item].forEach( emoji => chars.add( unicode( emoji)) );
        });
        Array.from( chars ).forEach( type => {
            const item = faces.get( `${type}.png` );
            item && render( item, type );
        });
    } else {
        const types = categories["smileys"].concat( categories["symbols"] );
        types.forEach( type => {
            const item = faces.get( `${type}.png` );
            insert_type == "menu" ? render( item, type ) : item && item.name.toLowerCase().includes( filter.toLowerCase() ) && render( item, type );
        });
    }
    if ( count == 1 && storage.one == true ) insert( char );
    else html != "" && dropdown( html );
}

/**
 * Dropdown +emoji
 *
 * @param {string} html
 */
function dropdown( html ) {
    create( html );
    listen();
}

/**
 * Create
 */
function create( value ) {
    const box    = $input[0].getBoundingClientRect(),
          offest = {
              top : box.top  + window.pageYOffset - document.documentElement.clientTop,
              left: box.left + window.pageXOffset - document.documentElement.clientLeft
    };
    $( "body"       ).append( `<div id="simpemoji"><div class="simpemoji-face">${value}</div><div class="simpemoji-bg"></div></div>` );
    $( "#simpemoji" ).attr( "style", 'left:' + offest.left + 'px;top:' + ( offest.top + $input[0].offsetHeight ) + 'px;width:' + ($input[0].offsetWidth - 10) + 'px;display:block;position:absolute;z-index:99999999;' );
}

/**
 * Listen event
 */
function listen() {
    $( ".simpemoji-bg"   ).click( event => remove() );
    $( ".simpemoji-face" ).click( event => {
        if ( $( event.target ).is( "img" ) ) {
            insert( $( event.target ).attr( "data-char" ));
            remove();
        }
    });
}

/**
 * Insert emoji to $target
 *
 * @param  {emoji} emoji
 */
function insert( value ) {
    storage.blank == true && ( value = ` ${value} ` );
    if ( insert_type == "key" ) {
       $input.val( $input.val().replace( reg, value ));
    } else {
        const start = $input[0].selectionStart,
              text  = $input.val(),
              empty = storage.blank == true ? 4 : 2;
        $input.val( text.substr( 0, start ) + value + text.substr( start ) );
        setTimeout( ()=> {
            $input[0].setSelectionRange( start + empty, start + empty );
            $input[0].focus();
        }, 100 );
    }
    browser.runtime.sendMessage({ id: "analytics", value: { eventCategory: "emoji", eventAction : "insert" }});
}

/**
 * Keyboard click enter
 */
function enter() {
    $( ".simpemoji-face" ).find( "img.highlight-face" )[0].click();
}

/**
 * Hight light
 */
function highlight() {
    const $target = $( ".simpemoji-face" );
    if ( $target.find( ".highlight-face" ).length == 0 ) {
        $($target.find( "img" )[0]).addClass( "highlight-face" );
    } else {
        const $highlight = $target.find( "img.highlight-face" );
        $highlight.removeClass( "highlight-face" ).next().addClass( "highlight-face" );
    }
}

/**
 * Body keydown event handler, prevent tab key
 */
function bodyKeydownHandler( event ) {
    if ( $( "body" ).find( "#simpemoji" ).length > 0 && event.keyCode == 9 ) {
        return false;
    } else {
        return true;
    }
}

/**
 * input keydown event handler, prevent enter key
 */
function inputKeydownHandler( event ) {
    if ( $( "body" ).find( "#simpemoji" ).length > 0 && event.keyCode == 13 ) {
        return false;
    }
}
/**
 * Remove and clear
 */
function remove( is_remove = false ) {
    if ( !is_remove && insert_type == "menu" ) return;
    $( ".simpemoji-bg"   ).off();
    $( ".simpemoji-face" ).off();
    $( "#simpemoji"      ).off().remove();
    $( "body"            ).off( "keydown", bodyKeydownHandler )
    $input && $input.off( "keydown", inputKeydownHandler );
    $input = undefined;
    insert_type = "normal";
}

/**
 * Emoji to unicode
 *
 * @param  {emoji}   emoji
 * @return {unicode} unicode
 */
function unicode( input ) {
    if (input.length === 1) {
        return input.charCodeAt(0);
    }
    var comp = (input.charCodeAt(0) - 0xD800) * 0x400 + (input.charCodeAt(1) - 0xDC00) + 0x10000;
    if (comp < 0) {
        return input.charCodeAt(0);
    }
    return comp.toString("16");
}

$( "body" ).on( "mouseup", mouseUpEventHandle );
function mouseUpEventHandle( event ) {
    event.type == "mouseup" && [ "input", "textarea" ].includes( event.target.nodeName.toLowerCase() ) &&
        ( $input = $( event.target ));
}

browser.runtime.onMessage.addListener( request => {
    if ( request.type == "rightclick" && insert_type != "key" ) {
        insert_type = "menu";
        face( "::  " );
    }
});