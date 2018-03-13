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
    console.log(setNumberVersion("3.4.5"))
    console.log(setStringVersion(345))

    // abc();

})

// async function abc() {
//     let a = 0;
//     let b = 0;
//     await (() => {
//         a = a = 1;
//         console.log(a)
//     })();

//     await (() => {
//         b = a + 1;
//         console.log(b)
//     })()
// }

function setNumberVersion(a) {
    let arrNumber = a.split(".");
    let a1 = parseInt(arrNumber[0]) * 100;
    let a2 = parseInt(arrNumber[1]) * 10;
    let a3 = parseInt(arrNumber[2]) * 1;
    return a1 + a2 + a3;
}

function setStringVersion(a) {
    let a1 = Math.floor(a / 100);
    let a2 = Math.floor((a - a1 * 100) / 10)
    let a3 = Math.floor(a - a1 * 100 - a2 * 10)
    return a1 + "." + a2 + "." + a3;
}