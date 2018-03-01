$(document).ready(function () {
    $('.showmenuaccount').click((event) => {
        $('#menuaccount').toggle();
        event.stopPropagation();
    })
    $(body).click(() => {
        $('#menuaccount').hide();
    })
    // btn-menu active
    $('#nomenu').click(() => {
        $('.setlimenu').removeClass('divhover');
        $('.setlimenu').addClass("hoverspan");
        $('.top-opacity').addClass("toptop-opacity-menusmall");
        $('.orderit').addClass('orderit-menusmall');
        $('#nomenu').hide();
        $('#okmenu').show();
        $('#menu-detail').animate({
            'width': '70px'
        });
        $('.navbar1').animate({
            'left': '70px'
        });
        $('.set-a-logo').attr({
            'src': '/themes/img/dashboard/iconhome.png'
        });
        $('.set-a-logo').css('margin-left', '2px');
        $('.imgiconmenu').css('padding', '0 23px 0 23px');
        $('.xcontent ').css('margin-left', '70px');
        $('.spantextmenu').css('display', 'none');
        $('.setarrowmenu').css('display', 'none');

    })
    $('#okmenu').click(() => {
        $('.setlimenu').addClass('divhover');
        $('.setlimenu').removeClass("hoverspan");
        $('.top-opacity').removeClass("toptop-opacity-menusmall");
        $('.orderit').removeClass('orderit-menusmall');
        $('#nomenu').show();
        $('#okmenu').hide();
        $('.navbar1').css({
            'left': '270px'
        });
        $('#menu-detail').animate({
            'width': '270px'
        });
        $('.set-a-logo').attr({
            'src': '/themes/img/logo-appbuilder.svg'
        });
        $('.set-a-logo').css('margin-left', '');
        $('.imgiconmenu').css('padding', '0 50px 0 35px');
        $('.xcontent ').css('margin-left', '270px');
        $('.spantextmenu').css('display', 'inline')
        $('.setarrowmenu').css('display', 'inline');
    })
    $('#app-used-menuleft').click(() => {
        $('#arowwx').toggle();
        $('.arrow-top').toggle();
        $('.submenuleft-edit').toggle();
    })


    // set local
    var hoverarrow = document.getElementsByClassName('set-span-arrow-right')
    var hovertext = document.getElementsByClassName('subspantextmenu1')
    var pathArray = window.location.pathname.split('/');
    if (pathArray[1] == "appversion") {
        // hoversubmenu[0].style.display = "none"
        hoverarrow[0].style.color = "#00afee"
        hovertext[0].style.color = "#00afee"
        $('#navigate-text').append(
            `<a class="colora" href="/dashboard"><span>Home</span><a>
        <span class="setarrownavigate">
            <img src="/themes/img/dashboard/iconarrowbreadcrumb.png">
        </span>
        <span id="text-href">App Version</span>`)

    }
    if (pathArray[1] == "editprofile") {
        // hoversubmenu[0].style.display = "none"
        $('#navigate-text').append(
            `<a class="colora" href="/dashboard"><span>Home</span><a>
        <span class="setarrownavigate">
            <img src="/themes/img/dashboard/iconarrowbreadcrumb.png">
        </span>
        <span id="text-href">User</span>`)

    }
    if (pathArray[1] == "dashboard") {
        // hoverarrow[1].style.color = "#00afee"
        // hovertext[1].style.color = "#00afee"
        $('#navigate-text').append(
            `<a class="colora" href="/dashboard"><span>Home</span><a>
        <span class="setarrownavigate">
            <img src="/themes/img/dashboard/iconarrowbreadcrumb.png">
        </span>
        <span id="text-href">My app</span>`)

    }
    if (pathArray[1] == "history") {
        hoverarrow[1].style.color = "#00afee"
        hovertext[1].style.color = "#00afee"
        $('#navigate-text').append(
            `<a class="colora" href="/dashboard"><span>Home</span><a>
        <span class="setarrownavigate">
            <img src="/themes/img/dashboard/iconarrowbreadcrumb.png">
        </span>
        <span id="text-href">History</span>`)

    }
    if (pathArray[1] == "myteam") {
        hoverarrow[2].style.color = "#00afee"
        hovertext[2].style.color = "#00afee"
        $('#navigate-text').append(
            `<a class="colora" href="/dashboard"><span>Home</span><a>
        <span class="setarrownavigate">
            <img src="/themes/img/dashboard/iconarrowbreadcrumb.png">
        </span>
        <span id="text-href">My Team</span>`)

    }
    if (pathArray[1] == "myorder") {
        hoverarrow[3].style.color = "#00afee"
        hovertext[3].style.color = "#00afee"
        if (pathArray[2] != "detail") {
            $('#navigate-text').append(
                `<a class="colora" href="/dashboard"><span>Home</span><a>
            <span class="setarrownavigate">
                <img src="/themes/img/dashboard/iconarrowbreadcrumb.png">
            </span>
            <span id="text-href">My Order</span>`)
        } else {
            var parseQueryString = function (queryString) {
                var params = {},
                    queries, temp, i, l;
                // Split into key/value pairs
                queries = queryString.split("&");
                // Convert the array of strings into an object
                for (i = 0, l = queries.length; i < l; i++) {
                    temp = queries[i].split('=');
                    params[temp[0]] = temp[1];
                }
                return params;
            };
            var querycodeorder = parseQueryString(window.location.search.substring(1))
            $('#navigate-text').append(
                `<a class="colora" href="/dashboard"><span>Home</span><a>
            <span class="setarrownavigate">
                <img src="/themes/img/dashboard/iconarrowbreadcrumb.png">
            </span>
            <a class="colora" href="/myorder/${pathArray[3]}"><span>My Order</span><a>
            <span class="setarrownavigate">
                <img src="/themes/img/dashboard/iconarrowbreadcrumb.png">
            </span>
            <span id="text-href">#${querycodeorder.codeorder}</span>`)
        }

    }
    if (pathArray[1] == "traffic") {
        hoverarrow[4].style.color = "#00afee"
        hovertext[4].style.color = "#00afee"
        $('#navigate-text').append(
            `<a class="colora" href="/dashboard"><span>Home</span><a>
        <span class="setarrownavigate">
            <img src="/themes/img/dashboard/iconarrowbreadcrumb.png">
        </span>
        <span id="text-href">Traffic</span>`)

    }
    // console.log(pathArray)


});

function trimSpace(str) {
    return str.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, "").replace(/\s+/g, " ");
}

function searchmyapp() {
    var input, filter, span, i, div;
    input = document.getElementById("inputsearchapp");
    filter = input.value.toUpperCase();
    // console.log(filter);
    span = document.getElementsByClassName("nameapp");
    div = document.getElementsByClassName("div-list-myapp");
    var dem = 0;
    for (i = 0; i < span.length; i++) {
        if (span[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
            dem++;
            div[i].style.display = "";

        } else {
            div[i].style.display = "none";
        }
    }
    if (dem < 6) {
        $('.iconloadmore').hide();
    }

    if (trimSpace(input.value) == "") {
        if (div.length > 6) {
            $('.iconloadmore').show();
            for (let i = 6; i < div.length; i++) {
                // console.log(i);
                div[i].style.display = "none";
            }
        }
    }


}