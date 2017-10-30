console.log( "index.js" )

import './vender/fullpage/jquery.fullpage.min.css';
import './assets/css/style.css';

import fullpage from 'fullpage';

$( document ).ready( function() {
    $('#fullpage').fullpage();
});
