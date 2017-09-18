console.log( "=== +emoji contentscripts load ===" )

let $target;
const reg = /::([\u4e00-\u9fa5]|[a-zA-Z ])? $/;

/**
 * Enerty point: listen keyup event
 */
$( "body" ).bind( "keyup", function( event ) {
    $target       = $( event.target );
    const value   = $target.val();
    if ( reg.test( value )) {
        $( "body" ).find( "#simpemoji" ).length == 0 && popup();
    }
});

/**
 * Popup +emoji
 */
function popup() {
    create();
    listen();
    face();
}

/**
 * Create popup
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
          baseUrl = chrome.extension.getURL( "assets/faces/" );

    for (var i in items) {
        if (items.hasOwnProperty(i)) {
            const item = items[i];
            html += '<img src="' + baseUrl  + '/' + item.image + '" ' +
                    '     alt="' + item.chars[0] + '" title="' + item.name + '" ' +
                    '     data-face="' + item.name.replace( ".png", "" ) + '" data-char="' + item.chars[0] + '" />';
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
    $target.val( $target.val().replace( reg, value ));
}

/**
 * Remove and clear
 */
function remove() {
    $( ".simpemoji-bg"   ).off();
    $( ".simpemoji-face" ).off();
    $( "#simpemoji"      ).off().remove();
}