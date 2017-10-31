console.log( "index.js" )

import './vender/fullpage/jquery.fullpage.min.css';
import './assets/css/style.css';

import fullpage from 'fullpage';

$( document ).ready( function() {
    $( "#fullpage" ).fullpage({
        sectionsColor: [ "#FFCA28", "#80DEEA", "#ff7281", "#64B5F6", "#c5e763" ]
    });
});
