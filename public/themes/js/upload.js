$('#btn-click').click(function() {
    $('.alert-upload').html('error connection');
    $('#danger-alert').show();
})
$('.upload-btn').on('click', function() {
    $('#dialog-history-file-uploaded').css('display', 'block');
});
$('.btn-icon-close-recent-file').click(function() {
    $('#dialog-history-file-uploaded').css('display', 'none');
});
$('#btn-add-new-file-zip').on('click', function() {
    $('#upload-input').click();
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
});
$('.link-use-a-file-zip').click(function() {
    var valueFile = $(this).find('.value-keyfolder-uploaded').val();
    // alert(valueFile);
    $('#dialog-history-file-uploaded').css('display', 'none');
    $('#loading').show();
    $.ajax({
        url: "/move-new-keyfolder/" + valueFile,
        type: "POST",
        data: '',
        //  processData: false,
        //contentType: false,
        success: function(result) {
            if (result.status == 2) {
                location.href = '/setting-app/' + result.keyFolder;
            } else if (result.status == 1) {
                location.href = '/platforms/' + result.keyFolder;
                // ejs.render('info-build');
            } else {

                $('.errPopup').show();
                $('.alert-upload').html(result.content);
                // $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                //     $("#danger-alert").slideUp(1000);
                // });
                // $('.form-group').find('.help-block').html(data.content);
                // $('.form-group').removeClass('has-success').addClass('has-error');
            }
        },
        error: function(jqXHR, exception) {
                $('.errPopup').show();
                $('.alert-upload').html('Oops, something went wrong');
                // $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                //     $("#danger-alert").slideUp(1000);
                //     $('.errPopup').hide();
                // });
                //   }
            }
            // timeout: 300000
    }).always(function(data) {
        $('#loading').hide();

    });
})

function formatBytes(a, b) {
    if (0 == a) return "0 Bytes";
    var c = 1e3,
        d = b || 2,
        e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
        f = Math.floor(Math.log(a) / Math.log(c));
    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f]
}
$('#upload-input').on('change', function() {
    $('#dialog-history-file-uploaded').css('display', 'none');
    var files = $(this).get(0).files;
    if (files.length > 0) {
        // create a FormData object which will be sent as the data payload in the
        // AJAX request
        var formData = new FormData();
        // loop through all the selected files and add them to the formData object
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            // add the files to formData object for the data payload
            formData.append('uploads', file, file.name);
        }
        $('.icon-upload').removeClass('fa-cloud-upload').addClass('fa-file-archive-o');
        $('.around-upload').find('.text-fileuploadname').html(file.name);
        $('.around-upload').find('.text-fileuploadsize').html('Size ' + formatBytes(file.size));

        if (file.size > 200000000) {
            // $('.form-group').find('.help-block').html('Upload file size is too large');
            // $('.form-group').removeClass('has-success').addClass('has-error');
            $('.errPopup').show();
            $('.alert-upload').html('File is too large (' + formatBytes(file.size) + '). The max filesize for your plan is 200Mb.');
            $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                $("#danger-alert").slideUp(1000);
                $('.errPopup').hide();
            });
        } else if (file.name.split('.').pop() != 'zip') {
            $('.errPopup').show();
            $('.alert-upload').html('File upload is not zip format');
            $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                $("#danger-alert").slideUp(1000);
            });
        } else {
            $('.upload-btn').hide();
            $('.progress').show();
            $.ajax({
                url: '/upload',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                datatype: "json",
                success: function(data) {
                    // alert(JSON.stringify(data));
                    if (data.status == 2) {
                        location.href = '/setting-app/' + data.keyFolder;
                    } else if (data.status == 1) {
                        location.href = '/platforms/' + data.keyFolder;
                        // ejs.render('info-build');
                    } else {
                        $('#loading').hide();
                        $('.upload-btn').show();
                        $('.progress').hide();
                        $('.errPopup').show();
                        $('.alert-upload').html(data.content);
                        // $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                        //     $("#danger-alert").slideUp(1000);
                        // });
                        // $('.form-group').find('.help-block').html(data.content);
                        // $('.form-group').removeClass('has-success').addClass('has-error');

                    }
                },

                xhr: function() {
                    var xhr;
                    // create an XMLHttpRequest
                    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
                        xhr = new XMLHttpRequest();
                    } else { // code for IE6, IE5
                        xhr = new ActiveXObject("Microsoft.XMLHTTP");
                    }
                    // var xhr = new XMLHttpRequest();
                    // listen to the 'progress' event
                    xhr.upload.addEventListener('progress', function(evt) {
                        var str = "";
                        if (evt.lengthComputable) {
                            // calculate the percentage of upload completed
                            var percentComplete = evt.loaded / evt.total;
                            percentComplete = parseInt(percentComplete * 100);
                            // update the Bootstrap progress bar with the new percentage
                            $('.progress-bar').text(percentComplete + '%');

                            $('.progress-bar').width(percentComplete + '%');
                            // once the upload reaches 100%, set the progress bar text to done
                            if (percentComplete === 100) {
                                // alert('123');
                                $('#loading').show();
                                // $('#loading').text('Handling project');
                            }
                        }
                    }, false);
                    return xhr;
                }

            });
        }


    }
});


////Info APp