$(document).ready(() => {
    var btnmenu = document.getElementsByClassName('showmenu');
    var menu = document.getElementsByClassName('myDropdown-traffic');

    for (let i = 0; i < btnmenu.length; i++) {
        btnmenu[i].addEventListener("click", (e) => {
            if (menu[i].style.display == "none") {
                menu[i].style.display = "block";
            } else {
                menu[i].style.display = "none";
            }
            e.stopPropagation();
        })
    }
    $("#deploy-detail-content").click(() => {
        $(".myDropdown-traffic").hide();
    })
})

function clickmenu(a, b) {
    let menupageuser = document.getElementsByClassName("myDropdown-traffic")[a];
    let selected = document.getElementsByClassName("selected-date")[a];
    let selected1 = document.getElementsByClassName("selected-date1")[a];
    let showdate = document.getElementsByClassName("show-date")[a];

    let tagapageuser = menupageuser.getElementsByTagName("a");
    let now = new Date();
    let numDay = now.getDate()
    // for (let i = 0; i < tagapageuser.length; i++) {
    tagapageuser[0].addEventListener('click', () => {
        let datenow = new Date(now);
        datenow.setDate(numDay);
        datenow = datenow.toString().split(" ");
        showdate.innerHTML = datenow[1] + " " + datenow[2] + "," + datenow[3];
        selected.innerHTML = "ToDay";
        selected1.innerHTML = "ToDay";
        b(0);
    })
    tagapageuser[1].addEventListener('click', () => {
        let datenow = new Date(now);
        datenow.setDate(numDay - 1);
        datenow = datenow.toString().split(" ");
        showdate.innerHTML = datenow[1] + " " + datenow[2] + "," + datenow[3];
        selected.innerHTML = "Yesterday";
        selected1.innerHTML = "Yesterday";
        b(1);
    })
    tagapageuser[2].addEventListener('click', () => {
        let datenow = new Date(now);
        datenow.setDate(numDay - 1);
        datenow = datenow.toString().split(" ");
        let datenow1 = new Date(now);
        datenow1.setDate(numDay - 7);
        datenow1 = datenow1.toString().split(" ");
        showdate.innerHTML = datenow[1] + " " + datenow[2] + "," + datenow[3] + " - " + datenow1[1] + " " + datenow1[2] + "," + datenow1[3];;
        selected.innerHTML = "Last 7 days";
        selected1.innerHTML = "Last 7 days";
        b(7);
    })
    tagapageuser[3].addEventListener('click', () => {
        let datenow = new Date(now);
        datenow.setDate(numDay - 1);
        datenow = datenow.toString().split(" ");
        let datenow1 = new Date(now);
        datenow1.setDate(numDay - 30);
        datenow1 = datenow1.toString().split(" ");
        showdate.innerHTML = datenow[1] + " " + datenow[2] + "," + datenow[3] + " - " + datenow1[1] + " " + datenow1[2] + "," + datenow1[3];;
        selected.innerHTML = "Last 30 days";
        selected1.innerHTML = "Last 30 days";
        b(30);
    })
    tagapageuser[4].addEventListener('click', () => {
        let datenow = new Date(now);
        datenow.setDate(numDay - 1);
        datenow = datenow.toString().split(" ");
        let datenow1 = new Date(now);
        datenow1.setDate(numDay - 90);
        datenow1 = datenow1.toString().split(" ");
        showdate.innerHTML = datenow[1] + " " + datenow[2] + "," + datenow[3] + " - " + datenow1[1] + " " + datenow1[2] + "," + datenow1[3];;
        selected.innerHTML = "Last 90 days";
        selected1.innerHTML = "Last 90 days";
        b(90);
    })
    tagapageuser[5].addEventListener('click', () => {
        b(1);
    })
}