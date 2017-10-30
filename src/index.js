console.log( "index.js" )

import './vender/fullpage/jquery.fullpage.min.css';
import './assets/css/style.css';

import fullpage from 'fullpage';

$( document ).ready( function() {
    $('#fullpage').fullpage({
        sectionsColor: [ '#FFE082', '#94AC3C', '#7BAABE', 'whitesmoke', '#ccddff' ]
    });
});
