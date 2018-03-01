  $(document).ready(function() {
      $('.btn-build-ios-admin').click(function() {
          alert('123');
          alert($(this).attr("attr-value"));
          $('#loading').show();
          var obj = {};
          $.ajax({
              url: "/build-ios-client",
              type: "POST",
              data: {
                  cKeyFolder: $(this).attr("attr-value")
              },
              //  processData: false,
              //contentType: false,
              success: function(result) {
                  // $('#loading').text(result);
                  if (result.status == 1) {
                      // console.log(result.content);
                      //   alert('1');
                      //   location.href = "//" + result.keyFolder
                      $('.errPopup').show();
                      $('.alert-upload').html(result.content);
                      $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                          $("#danger-alert").slideUp(1000);
                          $('.errPopup').hide();
                      });
                  } else if (result.status == 3) {
                      //   alert('3');
                      //   alert(result.content);
                      $('.errPopup').show();
                      $('.alert-upload').html(result.content);
                      $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                          $("#danger-alert").slideUp(1000);
                          $('.errPopup').hide();
                      });
                  } else {
                      $('.errPopup').show();
                      $('.alert-upload').html('Oops, something went wrong');
                      $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                          $("#danger-alert").slideUp(1000);
                          $('.errPopup').hide();
                      });
                  }
              },
              error: function(jqXHR, exception) {
                      $('.errPopup').show();
                      $('.alert-upload').html('Oops, something went wrong');
                      $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                          $("#danger-alert").slideUp(1000);
                          $('.errPopup').hide();
                      });
                      //   }

                  }
                  // timeout: 300000
          }).always(function(data) {

              $('#loading').hide();

          });


      })
  });