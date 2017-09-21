console.log( "=== +emoji contentscripts load ===" )

let $input;
const reg = /::([\u4e00-\u9fa5]|[a-zA-Z ])? $/;

/**
 * Enerty point: listen keyup / keydown event
 */
$( "body" ).bind( "keyup", function( event ) {
    if ( event.keyCode == 27 ) {
        $( "body" ).find( "#simpemoji" ).length > 0 && remove();
    } else if ( event.keyCode == 9 ) {
        $( "body" ).find( "#simpemoji" ).length > 0 && highlight();
    } else if ( event.keyCode == 13 ) {
        $( "body" ).find( "#simpemoji img" ).length > 0 && enter();
    } else {
        $input = $( event.target );
        if ( reg.test( $input.val() )) {
            $( "body" ).find( "#simpemoji" ).length == 0 && dropdown();
            $input.keydown( function( event ) {
                if ( $( "body" ).find( "#simpemoji" ).length > 0 && event.keyCode == 13 ) {
                    return false;
                }
            });
            $input.one( "blur", function ( event ) {
                event.target.focus();
            });
        }
    }
});

$( "body" ).bind( "keydown", function( event ) {
    if ( $( "body" ).find( "#simpemoji" ).length > 0 && event.keyCode == 9 ) {
        return false;
    } else {
        return true;
    }
});

/**
 * Dropdown +emoji
 */
function dropdown() {
    create();
    listen();
    face();
}

/**
 * Create
 */
function create() {
    const box    = $input[0].getBoundingClientRect(),
          offest = {
              top : box.top  + window.pageYOffset - document.documentElement.clientTop,
              left: box.left + window.pageXOffset - document.documentElement.clientLeft
    };
    $( "body"       ).append( '<div id="simpemoji"><div class="simpemoji-face"></div><div class="simpemoji-bg"></div></div>' );
    $( "#simpemoji" ).attr( "style", 'left:' + offest.left + 'px;top:' + ( offest.top + $input[0].offsetHeight ) + 'px;width:' + ($input[0].offsetWidth - 10) + 'px;display:block;position:absolute;z-index:99999999;' );
}

/**
 * Add face
 */
function face() {
    let   html    = "";
    const items   = chardict.items,
          flags   = [ "smileys", "symbols" ],
          baseUrl = chrome.extension.getURL( "assets/faces/" ),
          types   = categories["smileys"].concat( categories["symbols"] );
    for ( let item of items ) {
        const name = item.image.replace( ".png", "" );
        if ( types.includes( name )) {
            html += '<img src="' + baseUrl + item.image + '" ' +
                    '     alt="' + item.chars[0] + '" title="' + item.name + '" ' +
                    '     data-face="' + name + '" data-char="' + item.chars[0] + '" />';
        }
    }
    $( ".simpemoji-face" ).html( html );
}

/**
 * Listen event
 */
function listen() {
    $( ".simpemoji-bg" ).click( function( event ) {
        remove();
    });
    $( ".simpemoji-face" ).click( function( event ) {
        if ( $( event.target ).is( "img" ) ) {
            insert( $( event.target ).attr( "data-char" ));
            remove();
        }
    });
}

/**
 * Insert emoji to $target
 * @param  {emoji} emoji
 */
function insert( value ) {
    $input.val( $input.val().replace( reg, ` ${value} ` ));
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
 * Remove and clear
 */
function remove() {
    $( ".simpemoji-bg"   ).off();
    $( ".simpemoji-face" ).off();
    $( "#simpemoji"      ).off().remove();
    $input = undefined;
}
