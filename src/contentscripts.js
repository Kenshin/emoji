console.log( "=== +emoji contentscripts load ===" )

let $input;
const reg    = /::([\u4e00-\u9fa5]|[a-zA-Z ])? $/,
      faces  = new Map();

/**
 * Enerty point: listen keyup / keydown event
 *
 * watch key:
 * - All key     : when include reg insert dropdown
 * - ESC( 27 )   : remove insert
 * - Tab( 9  )   : click tab highlight face
 * - Enter( 13 ) : enter click highlight face
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
            $( "body" ).on( "keydown", bodyKeydownHandler );
            $( "body" ).find( "#simpemoji" ).length == 0 && dropdown();
            $input.keydown( inputKeydownHandler );
            $input.one( "blur", function ( event ) {
                event.target.focus();
            });
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
    const flags   = [ "smileys", "symbols" ],
          baseUrl = chrome.extension.getURL( "assets/faces/" ),
          types   = categories["smileys"].concat( categories["symbols"] );
    faces.size == 0 && chardict.items.forEach( item => faces.set( item.image, item ));
    types.forEach( type => {
        const item = faces.get( `${type}.png` );
        item && ( html += '<img src="' + baseUrl + item.image + '" ' +
                '     alt="' + item.chars[0] + '" title="' + item.name + '" ' +
                '     data-face="' + type + '" data-char="' + item.chars[0] + '" />' );
    });
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
function remove() {
    $( ".simpemoji-bg"   ).off();
    $( ".simpemoji-face" ).off();
    $( "#simpemoji"      ).off().remove();
    $( "body"            ).off( "keydown", bodyKeydownHandler )
    $input.off( "keydown", inputKeydownHandler );
    $input = undefined;
}
