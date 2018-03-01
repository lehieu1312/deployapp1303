$(document).ready(() => {
    $('#submenuleft').show();
    $("#about-bill").click((e) => {
        $("#select-custom").toggle()
        e.stopPropagation();
    });
    $(body).click(() => {
        $("#select-custom").hide();
    })
})