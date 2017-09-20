console.log( "=== +emoji contentscripts load ===" )

let $target;
const reg = /::([\u4e00-\u9fa5]|[a-zA-Z ])? $/;

/**
 * Enerty point: listen keyup event
 */
$( "body" ).bind( "keyup", function( event ) {
    if ( event.keyCode == 27 ) {
        $( "body" ).find( "#simpemoji" ).length > 0 && remove();
    } else {
        $target       = $( event.target );
        const value   = $target.val();
        if ( reg.test( value )) {
            $( "body" ).find( "#simpemoji" ).length == 0 && dropdown();
        }
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
    const box    = $target[0].getBoundingClientRect(),
          offest = {
              top : box.top  + window.pageYOffset - document.documentElement.clientTop,
              left: box.left + window.pageXOffset - document.documentElement.clientLeft
    };
    $( "body"       ).append( '<div id="simpemoji"><div class="simpemoji-face"></div><div class="simpemoji-bg"></div></div>' );
    $( "#simpemoji" ).attr( "style", 'left:' + offest.left + 'px;top:' + ( offest.top + $target[0].offsetHeight ) + 'px;width:' + ($target[0].offsetWidth - 10) + 'px;display:block;position:absolute;z-index:99999999;' );
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
        insert( $( event.target ).attr( "data-char" ));
        remove();
    });
}

/**
 * Insert emoji to $target
 * @param  {emoji} emoji
 */
function insert( value ) {
    $target.val( $target.val().replace( reg, ` ${value} ` ));
}

/**
 * Remove and clear
 */
function remove() {
    $( ".simpemoji-bg"   ).off();
    $( ".simpemoji-face" ).off();
    $( "#simpemoji"      ).off().remove();
}
