function drawuserbytime(contentuserbytime, dateuser) {
    var timeuser = ["12am", "2am", "4am", "6am", "8am", "10am", "12am", "2pm", "4pm", "6pm", "8pm", "10pm"]
    var timeuserusing = ["12am", "1am", "2am", "3am", "4am", "5am", "6am", "7am", "8am", "9am", "10am", "11am", "12am", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm", "10pm", "11pm"]
    var setdateuser = 0;

    for (let j = 0; j < 7; j++) {

        var valuehmt;
        var setcolor;
        var sumuser = contentuserbytime[j].reduce((a, b) => a + b, 0);
        valuehmt = '<div class="head-userbytime">';
        valuehmt += '<span>' + dateuser[setdateuser] + '</span>';
        valuehmt += '<span class="content-userbytime float-right">' + sumuser + '  <img class="setimg-rightnow" src="/themes/img/traffic/user.png"></span>';
        valuehmt += `</div>`
        valuehmt += `<div class="border-level">`
        for (let i = 0; i < 24; i++) {
            if (contentuserbytime[j][i] > 0 && contentuserbytime[j][i] <= 4) {
                if (i == 23) {
                    setcolor = "colorlevel1";
                    valuehmt += '<div class="level-userbytime ' + setcolor + '"></div></div>'
                } else {
                    setcolor = "colorlevel1";
                    valuehmt += '<div class="level-userbytime ' + setcolor + '"></div>'
                }
            } else if (contentuserbytime[j][i] > 4 && contentuserbytime[j][i] <= 8) {
                if (i == 23) {
                    setcolor = "colorlevel2";
                    valuehmt += '<div class="level-userbytime ' + setcolor + '"></div></div>'
                } else {
                    setcolor = "colorlevel2";
                    valuehmt += '<div class="level-userbytime ' + setcolor + '"></div>';
                }
            } else if (contentuserbytime[j][i] > 8 && contentuserbytime[j][i] <= 24) {
                if (i == 23) {
                    setcolor = "colorlevel3";
                    valuehmt += '<div class="level-userbytime ' + setcolor + '"></div></div>'
                } else {
                    setcolor = "colorlevel3";
                    valuehmt += '<div class="level-userbytime ' + setcolor + '"></div>';
                }
            } else if (contentuserbytime[j][i] > 24 && contentuserbytime[j][i] <= 36) {
                if (i == 23) {
                    setcolor = "colorlevel4";
                    valuehmt += '<div class="level-userbytime ' + setcolor + '"></div></div>'
                } else {
                    setcolor = "colorlevel4";
                    valuehmt += '<div class="level-userbytime ' + setcolor + '"></div>';
                }
            } else if (contentuserbytime[j][i] > 36) {
                if (i == 23) {
                    setcolor = "colorleve5";
                    valuehmt += '<div class="level-userbytime ' + setcolor + '"></div></div>'
                } else {
                    setcolor = "colorlevel5";
                    valuehmt += '<div class="level-userbytime ' + setcolor + '"></div>';
                }
            } else {
                if (i == 23) {
                    valuehmt += '<div class="level-userbytime"></div></div>';
                } else {
                    valuehmt += '<div class="level-userbytime"></div>';
                }
            }

        }
        $('#border-userbytime').append(valuehmt)
        valuehmt = "";
        setdateuser++;
        sumuser = null;
    }
    var legendhtml = `<div class="border-legend-user">
    <div class="float-left setspanlegend"><span>4</span></div>
    <div class="colorlevel1 level-user float-left"></div>
    <div class="colorlevel2 level-user float-left"></div>
    <div class="colorlevel3 level-user float-left"></div>
    <div class="colorlevel4 level-user float-left"></div>
    <div class="colorlevel5 level-user float-left"></div>
    <div class="float-left setspanlegend"><span>40</span></div>`;
    $('#border-userbytime').after(legendhtml);
    var titlehmtl = '<div class="border-level-title-userbytime">';
    for (let time = 0; time < 12; time++) {
        if (time == 11) {
            titlehmtl += '<div class="level-title-userbytime">' + timeuser[time] + '</div></div>';
        } else {
            if (time == 0) {
                titlehmtl += '<div class="level-title-userbytime">' + timeuser[time] + '</div>';
            } else {
                titlehmtl += '<div class="level-title-userbytime padding-title">' + timeuser[time] + '</div>';
            }
        }

    }
    $('#border-userbytime').after(titlehmtl);


    var setuser = document.getElementsByClassName('level-userbytime');
    var setcontentuser = document.getElementsByClassName("content-userbytime");

    // console.log(setuser.length)
    var variabledate;
    var variabletime;
    for (let i = 0; i < setuser.length; i++) {
        setuser[i].addEventListener("mouseover", () => {
            variabledate = Math.floor(i / 24);
            variabletime = i % 24;
            setcontentuser[variabledate].innerHTML = "";
            setcontentuser[variabledate].insertAdjacentHTML('afterbegin', '<span class="colora">' + contentuserbytime[variabledate][variabletime] + ' users at ' + timeuserusing[variabletime] + '<span> ')
        })
        setuser[i].addEventListener("mouseout", () => {
            setcontentuser[variabledate].innerHTML = "";
            var texthtmlcontent = contentuserbytime[variabledate].reduce((a, b) => a + b, 0) + '<img class="setimg-rightnow" src="/themes/img/traffic/user.png">'
            setcontentuser[variabledate].insertAdjacentHTML('afterbegin', texthtmlcontent);
            variabledate = null;
            variabletime = null;
        })
    }
}

function ajaxuserbytime(numberdate, numberend) {
    $('#border-userbytime').html("");
    $('.border-level-title-userbytime').html("");
    $('.border-legend-user').html("");
    $('div').removeClass("border-level-title-userbytime");
    $('div').removeClass("border-legend-user")
    let linkstatistic;
    if (numberend == 0) {
        linkstatistic = "/userbytime/" + $("#idapp-using").val() + "?numberdate=" + numberdate;
    } else {
        linkstatistic = "/userbytime/" + $("#idapp-using").val() + "?numberdate=" + numberdate + "&numberend=" + numberend;
    }

    function getWeekDates() {
        if (numberdate <= 7) {
            numberdate = 0;
        }
        let now = new Date();
        if (!numberend) {
            now = new Date();
        } else {
            console.log(numberend)
            now = numberend._d;
        }
        let dayOfWeek = now.getDay(); //0-6
        let numDay = now.getDate();
        let setdate = [];
        let setarraydate = [];
        for (var i = 0; i < 7; i++) {
            setarraydate.push(i)
        }
        for (let i = 0; i < 7; i++) {
            setdate[i] = new Date(now); //copy
            setdate[i].setDate(numDay - numberdate - setarraydate[i] - 1);
            setdate[i].setHours(0, 0, 0, 0);
            setdate[i] = setdate[i].toDateString().split(" ");
            setdate[i] = setdate[i][0];
        }
        console.log(setdate);
        return setdate;
    };
    $.post(linkstatistic, {},
        (data) => {
            drawuserbytime(data, getWeekDates())
        }
    )
}