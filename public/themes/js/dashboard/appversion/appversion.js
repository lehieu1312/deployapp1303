$(document).ready(() => {
    if (window.location.pathname.toLowerCase() == "/appversion") {
        $('#app-used-menuleft').css("background", "#00afee");
        $('#app-used-menuleft').css('color', '#fff')
        $('#appversion').css('color', '#00afee')
    }
    // $('#text-href').text("App Version");
    var nameapp = document.getElementsByClassName("nameapp-appversion");
    var version = document.getElementsByClassName("table-version");
    for (let i = 0; i < $('.tr-content-appversion').length; i++) {
        $("#more-changelog" + i).click(() => {
            $('.dialogdeleteapp-head-history').text($("#nameapp-appversion").val() + " " + version[i].innerHTML);
            $('.headlog').text("Release version" + version[i].innerHTML);
            $('.content-changelog').text($("#content-changelog-hiden" + i).val())
        })
    }
})