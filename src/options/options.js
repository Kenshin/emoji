console.log( "=== +emoji options page load ===" )

import 'option_css';
import '../vender/notify/notify.css';

import Velocity  from 'velocity';
import Setting   from 'setting';

/**
* Entry: Get settings from response
*/
chrome.runtime.sendMessage( "get_settings", function ( resp ) {
    console.log( "get_settings", resp )
    $( "body" ).velocity({ opacity: 1 }, { duration: 1000, complete: ()=> {
        $( "body" ).removeAttr( "style" );
    }});
    settingRender( { ...resp } );
});

/**
 * Setting Render
 * 
 * @param {object} options
 */
function settingRender( options ) {
    ReactDOM.render( <Setting options={ options } />, $( ".setting" )[0] );
}