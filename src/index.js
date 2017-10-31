console.log( "index.js" )

import './vender/fullpage/jquery.fullpage.min.css';
import './assets/css/style.css';

import fullpage from 'fullpage';

$( document ).ready( function() {
    $( "#fullpage" ).fullpage({
        sectionsColor     : [ "#FFCA28", "#80DEEA", "#ff7281", "#64B5F6", "#c5e763" ],
        anchors           : [ "welcome", "popup", "window", "insert", "option", "footer" ],
        loopBottom        : true,
        navigation        : true,
        navigationPosition: "right",
        navigationTooltips: [ "下载", "快捷键", "独立窗口", "中文语义化", "定制化", "联系" ],
    });
});

/**
 * Goggle Analytics
 */
(function analytics() {
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'UA-405976-10');
})();
