
function loadOptions() {
    var scale = document.getElementById("fieldscale");
    scale.value = localStorage["scale"];

    var usefont = document.getElementById("fieldusefont");
    usefont.checked = (localStorage["usefont"] == "true");

    var hidePUA = document.getElementById("fieldhidePUA");
    hidePUA.checked = (localStorage["hidePUA"] == "true");

    var blacklist = document.getElementById("fieldblacklist");
    blacklist.value = localStorage["blacklist"];
}

function saveOptions() {
    var scale = document.getElementById("fieldscale");
    localStorage["scale"] = scale.value;

    var usefont = document.getElementById("fieldusefont");
    localStorage["usefont"] = usefont.checked;

    var hidePUA = document.getElementById("fieldhidePUA");
    localStorage["hidePUA"] = hidePUA.checked;

    var blacklist = document.getElementById("fieldblacklist");
    localStorage["blacklist"] = blacklist.value;

    window.close();
}

function cancelOptions() {
    window.close();
}

function init() {
    var save = document.getElementById("buttonsave");
    save.addEventListener("click", saveOptions);

    var cancel = document.getElementById("buttoncancel");
    cancel.addEventListener("click", cancelOptions);

    loadOptions();
}

document.body.addEventListener("load", init());
