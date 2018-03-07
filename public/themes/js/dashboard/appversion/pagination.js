var xnumber = 1;
var numberpage;
var amount = 9;
var setamount = 9;
var manguse = [];
$(document).ready(() => {
    $('#number-show-footer').text(9)
    $("#span-show-number").text(9);
    for (let i = 0; i < $('.tr-content-appversion').length; i++) {
        manguse.push(i);
    }

    $(".number-items").text($('.tr-content-appversion').length + " item(s)")
    $('.thispage').text(xnumber)
    page = Math.ceil($('.tr-content-appversion').length / 9);
    numberpage = page;
    $('.numberpage').text("of " + page);
    checkpaginnation($('.tr-content-appversion').length, setamount)
    for (let j = 9; j < 37; j = j + 9) {
        $("#show" + j).click(() => {
            amount = j;
            setamount = j;
            xnumber = 1;
            $('.thispage').text(xnumber);
            $('#number-show-footer').text(xnumber)
            $("#span-show-number").text(setamount);

            checkpaginnation($('.tr-content-appversion').length, setamount)

            $('.numberpage').text("of " + page);
        })
    }
    $(".nextpage").click(() => {
        xnumber = xnumber + 1;
        $('.thispage').text(xnumber);
        amount = amount + setamount;
        if (xnumber == numberpage) {
            $(".nextpage").hide();
            $(".limitnext").show();
            $(".supernext").hide();
            $(".limitsupernext").show();
            $(".superback").show();
            $(".limitsuperback").hide();
        } else if (1 < xnumber < numberpage) {
            $(".nextpage").show();
            $(".supernext").show();
            $(".superback").show();
            $(".backpage").show();
            $(".limitnext").hide();
            $(".limitback").hide();
            $(".limitsupernext").hide();
            $(".limitsuperback").hide();
        } else {
            $(".nextpage").show();
            $(".supernext").show();
            $(".limitsuperback").show();
            $(".limitnext").hide();
            $(".limitsupernext").hide();
            $(".superback").hide();
        }
        for (let i = 0; i < manguse.length; i++) {
            if (i >= amount) {
                $('#version' + manguse[i]).hide();
            } else if (i < amount - setamount) {
                $('#version' + manguse[i]).hide();
            } else {
                $('#version' + manguse[i]).show();
            }
        }
        $(".backpage").show();
        $(".limitback").hide();
    })
    $(".supernext").click(() => {
        $(".superback").show();
        $(".limitsuperback").hide();
        $(".supernext").hide();
        $(".limitsupernext").show();
        $(".backpage").show();
        $(".limitback").hide();
        xnumber = numberpage;
        if (xnumber == numberpage) {
            $(".nextpage").hide();
            $(".limitnext").show();
            $(".supernext").hide();
            $(".limitsupernext").show();
        } else {
            $(".nextpage").show();
            $(".limitnext").hide();
            $(".supernext").show();
            $(".limitsupernext").hide();
        }
        amount = setamount * (numberpage - 1);
        $('.thispage').text(xnumber);
        for (let i = 0; i < manguse.length; i++) {
            if (i >= amount) {
                $('#version' + manguse[i]).show();
            } else {
                $('#version' + manguse[i]).hide();
            }
        }
    })
    $(".backpage").click(() => {
        $(".nextpage").show();
        $(".limitnext").hide();
        xnumber = xnumber - 1;
        if (xnumber == 1) {
            $(".backpage").hide();
            $(".limitback").show();
            $(".superback").hide();
            $(".limitsuperback").show();
            $(".limitsupernext").hide();
            $(".supernext").show();
        } else if (1 < xnumber < numberpage) {
            $(".nextpage").show();
            $(".supernext").show();
            $(".superback").show();
            $(".backpage").show();
            $(".limitnext").hide();
            $(".limitback").hide();
            $(".limitsupernext").hide();
            $(".limitsuperback").hide();
        }
        $('.thispage').text(xnumber);
        amount = amount - setamount;
        // console.log(amount);
        for (let i = 0; i < manguse.length; i++) {
            if (i >= amount) {
                $('#version' + i).hide();
            } else if (i < amount - setamount) {
                $('#version' + manguse[i]).hide();
            } else {
                $('#version' + manguse[i]).show();
            }
        }
    })
    $('.superback').click(() => {
        $(".superback").hide();
        $(".limitsuperback").show();
        $(".supernext").show();
        $(".limitsupernext").hide();
        $(".nextpage").show();
        $(".limitnext").hide();
        xnumber = 1;
        $('.thispage').text(xnumber);
        amount = setamount;
        // console.log(amount);
        for (let i = 0; i < manguse.length; i++) {
            if (i < amount) {
                $('#version' + manguse[i]).show();
            } else {
                $('#version' + manguse[i]).hide();
            }
        }
        if (xnumber == 1) {
            $(".nextpage").show();
            $(".limitnext").hide();
            $(".backpage").hide();
            $(".limitback").show();
        }
    })
    //filter status
    $("#slect-status-1").click(() => {
        $("#span-selcect-status").text("New")
        var dem = 0;
        var lenthmanguse = manguse.length;
        manguse.splice(0, lenthmanguse);
        for (let i = 0; i < $('.tr-content-appversion').length; i++) {
            if (i == 0) {
                dem++;
                manguse.push(i)
                $('#version' + manguse[i]).show();
            } else {
                $('#version' + i).hide();
            }
        }
        $(".number-items").text(manguse.length + " item(s)")
        checkpaginnation(dem, setamount);
    });
    $("#slect-status-2").click(() => {
        $("#span-selcect-status").text("Feature")
        var dem = 0;
        var lenthmanguse = manguse.length;
        manguse.splice(0, lenthmanguse);
        for (let i = 0; i < $('.tr-content-appversion').length; i++) {
            if (i == 1) {
                dem++;
                manguse.push(i)
                $('#version' + i).show();
            } else {
                $('#version' + i).hide();
            }
        }
        $(".number-items").text(manguse.length + " item(s)")
        checkpaginnation(dem, setamount);
    });
    $("#slect-status-3").click(() => {
        $("#span-selcect-status").text("All")
        var lenthmanguse = manguse.length;
        manguse.splice(0, lenthmanguse);
        xnumber = 1;
        var dem = 0;
        $('.thispage').text(xnumber);
        $("#span-show-number").text(setamount);
        // console.log($('.tr-content-appversion').length);
        for (let i = 0; i < $('.tr-content-appversion').length; i++) {
            dem++;
            manguse.push(i);
            if (i > setamount - 1) {
                $('#version' + i).hide();
            } else {
                $('#version' + i).show();
            }
        }
        $(".number-items").text(manguse.length + " item(s)")
        let page = Math.ceil($('.tr-content-appversion').length / setamount)
        numberpage = page;
        $('.numberpage').text("of " + page);
        checkpaginnation(dem, setamount);
        dem = 0;
    })
    // filter date
    $("#select-date-1").click(() => {
        $("#span-selcect-date").text("Hours Ago");
        var lenthmanguse = manguse.length;
        manguse.splice(0, lenthmanguse);
        var d1 = new Date();
        var dem = 0;
        for (let i = 0; i < $('.tr-content-appversion').length; i++) {
            var d = new Date($('#time-ready' + i).val())
            if (d1.getDate() == d.getDate() && d1.getMonth() == d.getMonth() && d1.getFullYear() == d.getFullYear()) {
                if (0 <= d1.getHours() - d.getHours() <= 1) {
                    manguse.push(i)
                    dem++;
                    $('#version' + manguse[i]).show();
                }
            } else {
                $('#version' + i).hide();
            }
        }
        $(".number-items").text(manguse.length + " item(s)")
        checkpaginnation(dem, setamount);
        dem = 0;
    });
    $("#select-date-2").click(() => {
        $("#span-selcect-date").text("Yesterday");
        var lenthmanguse = manguse.length;
        manguse.splice(0, lenthmanguse);
        var d1 = new Date();
        var dem = 0;
        for (let i = 0; i < $('.tr-content-appversion').length; i++) {
            var d = new Date($('#time-ready' + i).val())
            if (d1.getMonth() == d.getMonth() && d1.getFullYear() == d.getFullYear()) {
                if (0 <= d1.getDate() - d.getDate() <= 1) {
                    manguse.push(i)
                    dem++;
                    $('#version' + manguse[i]).show();
                }
            } else {
                $('#version' + i).hide();
            }
        }
        $(".number-items").text(manguse.length + " item(s)")
        checkpaginnation(dem, setamount);
        dem = 0;
    });
    $("#select-date-3").click(() => {
        function getWeekDates() {
            let now = new Date();
            let dayOfWeek = now.getDay(); //0-6
            let numDay = now.getDate();

            let start = new Date(now); //copy
            start.setDate(numDay - 6);
            // start.setHours(0, 0, 0, 0);
            return start;
        }
        var start = getWeekDates();
        // console.log(start);

        $("#span-selcect-date").text("Last Weed");
        var lenthmanguse = manguse.length;
        manguse.splice(0, lenthmanguse);
        // var d1 = new Date();
        var dem = 0;
        for (let i = 0; i < $('.tr-content-appversion').length; i++) {
            var d = new Date($('#time-ready' + i).val())
            if (d - start >= 0) {
                manguse.push(i)
                dem++;
                $('#version' + manguse[i]).show();
            } else {
                $('#version' + i).hide();
            }
        }
        $(".number-items").text(manguse.length + " item(s)")
        checkpaginnation(dem, setamount);
        dem = 0;
    });
    $("#select-date-4").click(() => {
        $("#span-selcect-date").text("All Dates");
        var lenthmanguse = manguse.length;
        manguse.splice(0, lenthmanguse);
        xnumber = 1;
        var dem = 0;
        $('.thispage').text(xnumber);
        $("#span-show-number").text(setamount);
        // console.log($('.tr-content-appversion').length);
        for (let i = 0; i < $('.tr-content-appversion').length; i++) {
            dem++;
            manguse.push(i);
            if (i > setamount - 1) {
                $('#version' + i).hide();
            } else {
                $('#version' + i).show();
            }
        }
        $(".number-items").text(manguse.length + " item(s)")
        let page = Math.ceil($('.tr-content-appversion').length / setamount)
        numberpage = page;
        $('.numberpage').text("of " + page);
        checkpaginnation(dem, setamount);
        dem = 0;
    });


    $("#select-date-5").click((event) => {
        $("#span-selcect-date").text("Custom");
        event.stopPropagation();
    })
    $("#select-date-5").daterangepicker({
        drops: "up",
        opens: "left"
    }, function (start, end) {
        var lenthmanguse = manguse.length;
        manguse.splice(0, lenthmanguse);
        var d1 = new Date();
        var dem = 0;
        // console.log(d1 - start._d)
        for (let i = 0; i < $('.tr-content-appversion').length; i++) {
            var d = new Date($('#time-ready' + i).val())
            if (d - start._d >= 0 && end._d - d >= 0) {
                manguse.push(i)
                dem++;
                // $('#version' + manguse[i]).show();
            } else {
                $('#version' + i).hide();
            }
        }
        $(".number-items").text(manguse.length + " item(s)")
        checkpaginnation(dem, setamount);
        dem = 0;
    });

});

function searchappversion() {
    var lenthmanguse = manguse.length;
    manguse.splice(0, lenthmanguse);
    var input, filter, spanversion, findcode, spannameapp, spanchangelog, spantime;
    input = document.getElementById("inputsearchapp1");
    filter = input.value.toUpperCase();
    findcode = document.getElementsByClassName("findcode");
    spannameapp = document.getElementsByClassName("findnameapp");
    spanversion = document.getElementsByClassName("findversion");
    spanchangelog = document.getElementsByClassName("findnote");
    spantime = document.getElementsByClassName("finddate");
    var dem = 0;
    for (let i = 0; i < spanversion.length; i++) {
        // console.log(spanversion[i].innerHTML.toUpperCase().indexOf(filter));
        if (spanversion[i].innerHTML.toUpperCase().indexOf(filter) > -1 || spanchangelog[i].innerHTML.toUpperCase().indexOf(filter) > -1 || spantime[i].innerHTML.toUpperCase().indexOf(filter) > -1 || spannameapp[i].innerHTML.toUpperCase().indexOf(filter) > -1 | findcode[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
            if (findcode[i].innerHTML.toUpperCase().indexOf(filter) == 0 || findcode[i].innerHTML.toUpperCase().indexOf(filter) == 1 || spanversion[i].innerHTML.toUpperCase().indexOf(filter) == 0 || spanversion[i].innerHTML.toUpperCase().indexOf(filter) == 1 || spantime[i].innerHTML.toUpperCase().indexOf(filter) == 0 || spantime[i].innerHTML.toUpperCase().indexOf(filter) == 1 || spanversion[i].innerHTML.toUpperCase().indexOf(filter) == 0 || spanversion[i].innerHTML.toUpperCase().indexOf(filter) == 1 || spannameapp[i].innerHTML.toUpperCase().indexOf(filter) == 0 || spannameapp[i].innerHTML.toUpperCase().indexOf(filter) == 1) {
                manguse.push(i);
                dem = spanversion.length;
                xnumber = 1;
                $('.thispage').text(xnumber);
                $("#span-show-number").text(setamount);
                for (let i = 0; i < $('.tr-content-appversion').length; i++) {
                    if (i > setamount - 1) {
                        $('#version' + i).hide();
                    } else {
                        $('#version' + i).show();
                    }
                }
                let page = Math.ceil($('.tr-content-appversion').length / setamount)
                numberpage = page;
                $('.numberpage').text("of " + page);
            } else {
                manguse.push(i);
                dem++;
                // $('#version' + i).show();
            }
        } else {
            $('#version' + i).hide();
        }
    }
    // console.log(manguse);
    $(".number-items").text(manguse.length + " item(s)")
    checkpaginnation(dem, setamount);
    dem = 0;
}

function checkpaginnation(a, b) {
    if (a > b) {
        $('.nextpage').show();
        $('.supernext').show();
        $('.limitsuperback').show();
        $('.limitback').show();
        $('.limitsupernext').hide();
        $('.superback').hide();
        $('.limitnext').hide();
        $('.backpage').hide();
        page = Math.ceil(a / b);
        xnumber = 1;
        amount = b;
        numberpage = page;
        $('.thispage').text(xnumber);
        $('.numberpage').text("of " + numberpage);
        for (let i = 0; i < manguse.length; i++) {
            if (i > setamount - 1) {
                $('#version' + manguse[i]).hide();
            } else {
                $('#version' + manguse[i]).show();
            }
        }
    } else {
        $('.backpage').hide();
        $('.nextpage').hide();
        $('.supernext').hide();
        $('.superback').hide();
        $('.limitnext').show();
        $('.limitback').show();
        $('.limitsupernext').show();
        $('.limitsuperback').show();
        page = 1;
        xnumber = 1;
        amount = b;
        numberpage = 1;
        $('.thispage').text(xnumber);
        $('.numberpage').text("of " + numberpage);
        for (let i = 0; i < manguse.length; i++) {
            $('#version' + manguse[i]).show();
        }
    }
}