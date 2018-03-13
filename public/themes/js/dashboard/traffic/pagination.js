function pagination(a, b, c) {
    let text = document.getElementsByClassName("setpagination1")[c];

    let lengtr = $(a).length;
    let numberpage_1 = Math.ceil(lengtr / 6);
    text.innerHTML = "Showing 1-6 of " + lengtr + " item(s)"
    let next = $(b + " > .next");
    let doublenext = $(b + "> .double-next");
    let back = $(b + "> .back");
    let doubleback = $(b + " > .double-back");

    let nextlimit = $(b + " > .nextlimit");
    let doublenextlimit = $(b + " > .double-next-limit");
    let backlimit = $(b + "> .backlimit");
    let doublebacklimit = $(b + "> .double-back-limit");
    back.hide();
    doubleback.hide();

    nextlimit.hide();
    doublenextlimit.hide();

    next.show();
    doublenext.show();

    let xnumber = 0;
    let xpage = 1;
    if (numberpage_1 <= 1) {
        next.hide();
        doublenext.hide();
        nextlimit.show();
        doublenextlimit.show();
    }
    next.click((e) => {
        xpage++;
        console.log(xpage);
        if (xpage == numberpage_1) {
            next.hide();
            doublenext.hide();
            nextlimit.show();
            doublenextlimit.show();
        }
        back.show();
        doubleback.show();

        backlimit.hide();
        doublebacklimit.hide();

        $(a).each(function (index) {
            if (index > xnumber + 5 && index < xnumber + 12) {
                // console.log(index);
                $(this).show();
            } else {
                $(this).hide();
            }
        });
        xnumber = xnumber + 6;

    });
    back.click(() => {
        xpage--;
        console.log(xpage);
        next.show();
        doublenext.show();

        nextlimit.hide();
        doublenextlimit.hide();

        if (xpage == 1) {
            back.hide();
            doubleback.hide();

            backlimit.show();
            doublebacklimit.show();
        }
        $(a).each(function (index) {
            if (index >= xnumber - 6 && index <= xnumber - 1) {
                console.log(index);
                $(this).show();
            } else {
                $(this).hide();
            }
        });
        xnumber = xnumber - 6;
    });

    doublenext.click(() => {
        xpage = numberpage_1;
        xnumber = numberpage_1 * 6 - 6;
        back.show();
        doubleback.show();
        backlimit.hide();
        doublebacklimit.hide();
        next.hide();
        doublenext.hide();
        nextlimit.show();
        doublenextlimit.show();
        $(a).each(function (index) {
            if (index > xnumber - 1 && index < xnumber + 6) {
                // console.log(index);
                $(this).show();
            } else {
                $(this).hide();
            }
        });

    })

    doubleback.click(() => {
        xpage = 1;
        xnumber = 6;
        back.hide();
        doubleback.hide();
        backlimit.show();
        doublebacklimit.show();


        next.show();
        doublenext.show();
        nextlimit.hide();
        doublenextlimit.hide();
        $(a).each(function (index) {
            if (index >= xnumber - 6 && index <= xnumber - 1) {
                console.log(index);
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    })

    $(b + " > .set-span-pagination").each(function (i) {
        if (i == 0) {
            $(this).text(`${lengtr + " item(s)"}`);
        }
        if (i == 1) {
            $(this).text(`${  " of " + numberpage_1}`);
        }
    });

    $(a).each(function (index) {
        if (index > 5) {
            $(this).hide();
        }
    });
}