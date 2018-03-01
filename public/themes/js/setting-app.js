  $(document).ready(function() {
      function validateEmail(email) {
          var str = /^[a-z][a-zA-Z0-9_.]*(\.[a-zA-Z][a-zA-Z0-9_.]*)?@[a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?$/;
          return str.test(email);
      }

      function validateIdentifier(str) {
          var id = /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/;
          return id.test(str);
      }

      function validPackageID(str) {
          var dotPackage = str.split('.');
          var checkF;
          var regex = /[!@#$%^&*()~_+\- `=\[\]{};':"\\|,<>\/?¿§«»ω⊙¤°℃℉€¥£¢¡®©]+/;
          var regexNumber = /[0123456789]+/;
          if (str.search(regex) != -1) {
              checkF = false;
          } else if (dotPackage.length == 1) {
              checkF = false;
          } else if (dotPackage.length > 1) {
              for (var i = 0; i < dotPackage.length; i++) {
                  if (dotPackage[i] == '')
                      checkF = false;
                  if (isNumber(dotPackage[0]) == true) {
                      checkF = false;
                  }
                  if (dotPackage[0].search(regexNumber) != -1)
                      checkF = false;
              }

          } else {
              checkF = true;
          }
          if (checkF == false)
              return false;
          else return true;
      }

      function checkCharSpecial(str) {
          var regex = /['&"]+/;
          if (str.search(regex) != -1) {
              return false;
          }
      }

      function validAppName(str) {
          var strSpecial = /^[a-zA-Z0-9\. ]+$/;
          return strSpecial.test(str);
      }

      function isNumber(strnumber) {
          var numberic = /^[0-9]*$/;
          return numberic.test(strnumber);
      }

      function checkDateFormat(strDate) {
          var cDate = strDate.split('-');
          var clDate = strDate.split('/');
          var checkDate;
          if (cDate.length == 3) {
              if (cDate[0] == 'dd' && cDate[1] == 'MM' && (cDate[2] == 'yyyy' || cDate[2] == 'yy')) checkDate = true;
              else if (cDate[0] == 'MM' && cDate[1] == 'dd' && (cDate[2] == 'yyyy' || cDate[2] == 'yy')) checkDate = true;
              else if ((cDate[0] == 'yy' || cDate[0] == 'yyyy') && cDate[1] == 'MM' && cDate[2] == 'dd') checkDate = true;
              else checkDate = false;
          } else if (clDate.length == 3) {
              if (cDate[0] == 'dd' && cDate[1] == 'MM' && (cDate[2] == 'yyyy' || cDate[2] == 'yy')) checkDate = true;
              else if (cDate[0] == 'MM' && cDate[1] == 'dd' && (cDate[2] == 'yyyy' || cDate[2] == 'yy')) checkDate = true;
              else if ((cDate[0] == 'yy' || cDate[0] == 'yyyy') && cDate[1] == 'MM' && cDate[2] == 'dd') checkDate = true;
              else checkDate = false;
          } else checkDate = false;
          if (checkDate == false) return false;
          else return true;
      }

      function ValidURL(str) {
          var pattern = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
          if (!pattern.test(str)) {
              return false;
          } else {
              return true;
          }
      }


      function checkWpUrl(strUrl) {
          var checkURL;
          console.log(strUrl);
          if (ValidURL(strUrl)) {
              //   $('#loading').show();
              $.ajax({
                  url: strUrl + '/wp-json',
                  type: "get",
                  dataType: "text",
                  data: {},
                  async: false,
                  success: function(msg) {
                      checkURL = true;
                  },
                  error: function(jqXHR, textStatus, err) {
                      console.log(textStatus);
                      console.log(err);
                      console.log(jqXHR);
                      console.log('ko co du lieu');
                      checkURL = false;
                  }
              }).always(function() {
                  $('#loading').hide();
              })
              return checkURL;
          } else return false;
      }

      function validateForm_setting_app() {
          var checkValid = true;
          $(".form-group").each(function() {
              var rules = $(this).find('input').attr("rules");
              var require = $(this).find('input').prop("required");
              //   alert('require: ' + require);
              //   var checkCharSpecial = validAppName($(this).find('input').val());
              //   alert(checkCharSpecial);
              //   if (checkCharSpecial == false) {
              //       $(this).find('.help-block').html('Field  is contain characters special');
              //       $(this).removeClass('has-success').addClass('has-error');
              //       $(this).find('input').focus();
              //       checkValid = false;
              //   }

              if (require == true && $(this).find('input').val() == '' && rules.toLowerCase() == "string") {
                  //   $(this).find('input').val('');
                  $(this).find('input').attr('placeholder', '');
                  $(this).find('input').addClass('input-holder').addClass('border-bottom-red');
                  //   $(this).find('#icon-err').removeClass('display-none').addClass('display-inline');
                  checkValid = false;
              }
              // else {
              //       $(this).find('input').removeClass('input-holder').removeClass('border-bottom-red');
              //       $(this).find('#icon-err').removeClass('display-inline').addClass('display-none');
              //       //   $(this).find('.help-block').html('');
              //       //   $(this).removeClass('has-error').addClass('has-success');
              //       //   $(this).find('input').focus();
              //   }
              //   else if (rules.toLowerCase() == "string") {
              // && checkCharSpecial($(this).find('input').val()) == false
              //   var value = $(this).find('input').val();
              //   var checkSpecial = checkCharSpecial(value);
              //   if (checkSpecial == false) {
              //   $(this).find('input').val('');
              //   $(this).find('input').attr('placeholder', '');
              //   $(this).find('input').attr('placeholder', 'Field is contain characters special');
              //   $(this).find('input').addClass('input-holder').addClass('border-bottom-red');
              //   $(this).find('#icon-err').removeClass('display-none').addClass('display-inline');
              //   checkValid = false;
              //   } else {
              //       $(this).find('input').removeClass('input-holder').removeClass('border-bottom-red');
              //       //   $(this).find('#icon-err').removeClass('display-inline').addClass('display-none');
              //   }
              //   }
              else if (rules.toLowerCase() == "packageid") {
                  var value = $(this).find('input').val();
                  var checkSpecial = validPackageID(value);

                  if (value == '') {
                      $(this).find('input').val('');
                      $(this).find('input').attr('placeholder', 'This ID uniquely identifies your app on the device and in Google Play, like: com.example.myapp');
                      $(this).find('input').addClass('input-holder').addClass('border-bottom-red');
                  } else if (checkSpecial == false) {
                      $(this).find('input').val('');
                      $(this).find('input').attr('placeholder', 'This ID uniquely identifies your app on the device and in Google Play, like: com.example.myapp');
                      $(this).find('input').addClass('input-holder').addClass('border-bottom-red');
                      //   $(this).find('#icon-err').removeClass('display-none').addClass('display-inline');
                      checkValid = false;

                  } else {
                      $(this).find('input').removeClass('input-holder').removeClass('border-bottom-red');
                      //   $(this).find('#icon-err').removeClass('display-inline').addClass('display-none');
                      //   $(this).find('.help-block').html('');
                      //   $(this).removeClass('has-error').addClass('has-success');
                  }

                  // if (cPackage.lenght() < 2 || typeof cPackage.lenght() == 'undefined') {
                  //     alert('Package is not match (com.domain.id) ');
                  //     $(this).focus();
                  //     return false;
                  // }
              } else if (rules.toLowerCase() == "email") {
                  var checkmail = validateEmail($(this).find('input').val());
                  if ($(this).find('input').val() == '') {
                      $(this).find('input').attr('placeholder', 'Enter valid email');
                      $(this).find('input').addClass('input-holder').addClass('border-bottom-red');
                  } else if (checkmail == false) {
                      $(this).find('input').val('');
                      $(this).find('input').attr('placeholder', 'Enter valid email');
                      $(this).find('input').addClass('input-holder').addClass('border-bottom-red');
                      //   $(this).find('#icon-err').removeClass('display-none').addClass('display-inline');
                      checkValid = false;
                      //   $(this).find('.help-block').html('Please enter correct email');
                      //   $(this).removeClass('has-success').addClass('has-error');
                      //   $(this).find('input').focus();
                      //   checkValid = false;
                  } else {
                      $(this).find('input').removeClass('input-holder').removeClass('border-bottom-red');
                      //   $(this).find('#icon-err').removeClass('display-inline').addClass('display-none');
                      //   $(this).find('.help-block').html('');
                      //   $(this).removeClass('has-error').addClass('has-success');
                  }

              } else if (rules.toLowerCase() == "number") {
                  var val = $(this).find('input').val();
                  var checkNumber = isNumber(val);

                  if (val == '') {
                      $(this).find('input').attr('placeholder', 'Enter valid number [0-9]');
                      $(this).find('input').addClass('input-holder').addClass('border-bottom-red');
                      checkValid = false;
                  } else if (checkNumber == false) {
                      $(this).find('input').val('');
                      $(this).find('input').attr('placeholder', 'Enter valid number [0-9]');
                      $(this).find('input').addClass('input-holder').addClass('border-bottom-red');
                      //   $(this).find('#icon-err').removeClass('display-none').addClass('display-inline');
                      checkValid = false;

                      // $(this).focus();
                  } else {
                      $(this).find('input').removeClass('input-holder').removeClass('border-bottom-red');
                      //   $(this).find('#icon-err').removeClass('display-inline').addClass('display-none');
                  }

              }
              //   else if (rules.toLowerCase() == "dateformat") {
              //       if ($(this).find('input').val() == '') {
              //           $(this).find('input').attr('placeholder', 'Enter Date format, example: yyyy-MM-dd');
              //           $(this).find('input').addClass('input-holder').addClass('border-bottom-red');
              //           checkValid = false;
              //       } else if (checkDateFormat($(this).find('input').val()) == false) {
              //           $(this).find('input').val('');
              //           $(this).find('input').attr('placeholder', 'Enter Date format, example: yyyy-MM-dd');
              //           $(this).find('input').addClass('input-holder').addClass('border-bottom-red');
              //           //   $(this).find('#icon-err').removeClass('display-none').addClass('display-inline');
              //           checkValid = false;
              //           // alert('OnesignalID not match format');
              //           // $(this).focus();
              //       } else {
              //           $(this).find('input').removeClass('input-holder').removeClass('border-bottom-red');
              //           //   $(this).find('#icon-err').removeClass('display-inline').addClass('display-none');
              //       }

              //   }
              else if (rules.toLowerCase() == "onesignalid") {
                  if ($(this).find('input').val() == '') {
                      $(this).find('input').attr('placeholder', 'Enter valid OneSignal App ID, like: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
                      $(this).find('input').addClass('input-holder').addClass('border-bottom-red');
                      checkValid = false;
                  } else if (validateIdentifier($(this).find('input').val()) == false) {
                      $(this).find('input').val('');
                      $(this).find('input').attr('placeholder', 'Enter valid OneSignal App ID, like: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
                      $(this).find('input').addClass('input-holder').addClass('border-bottom-red');
                      //   $(this).find('#icon-err').removeClass('display-none').addClass('display-inline');
                      checkValid = false;

                      // $(this).focus();
                  } else {
                      $(this).find('input').removeClass('input-holder').removeClass('border-bottom-red');
                      //   $(this).find('#icon-err').removeClass('display-inline').addClass('display-none');
                  }

              } else if (rules.toLowerCase() == "wordpressurl") {
                  var val = $(this).find('input').val();

                  if (val == '') {
                      $(this).find('input').attr('placeholder', 'Enter valid URL to your wordpress, like: http(s)://your_website.com');
                      $(this).find('input').addClass('input-holder').addClass('border-bottom-red');
                      checkValid = false;
                  } else if (ValidURL(val) == false) {
                      $(this).find('input').val('');
                      $(this).find('input').attr('placeholder', 'Enter valid URL to your wordpress, like: http(s)://your_website.com');
                      $(this).find('input').addClass('input-holder').addClass('border-bottom-red');
                      checkValid = false;
                  }
                  //   else if (checkWpUrl(val) == false) {
                  //       alert('1');
                  //       $(this).find('input').val('');
                  //       $(this).find('input').attr('placeholder', 'Enter valid URL to your wordpress, like: http(s)://your_website.com');
                  //       $(this).find('input').addClass('input-holder').addClass('border-bottom-red');
                  //       //   $(this).find('#icon-err').removeClass('display-none').addClass('display-inline');
                  //       checkValid = false;
                  //   } 
                  else {
                      $(this).find('input').removeClass('input-holder').removeClass('border-bottom-red');
                      //   $(this).find('#icon-err').removeClass('display-inline').addClass('display-none');
                  }
              } else {
                  $(this).find('input').removeClass('input-holder').removeClass('border-bottom-red');
                  //   $(this).find('#icon-err').removeClass('display-inline').addClass('display-none');
              }
          });

          if (checkValid == false) {
              return false;
          } else {
              return true;
          }
      }
      //   btn-setting-app
      $('#btn-setting-app').click(function() {
          if (validateForm_setting_app() == true) {
              $('#loading').show();
              var obj = {};
              // $('.form-group').find('.help-block').html('');
              // $('.form-group').removeClass('has-error').addClass('has-success');
              // $(".spinner").fadeIn();
              $.ajax({
                  url: "/setting-app",
                  type: "POST",
                  data: $("#fSettingApp").serialize(),
                  //  processData: false,
                  //contentType: false,
                  success: function(result) {

                      // $('#loading').text(result);
                      if (result.status == 1) {
                          console.log(result.content);

                          location.href = "/platforms/" + result.keyFolder
                      } else if (result.status == 3) {
                          //   $('.error-all').find('.help-block').html(result.content);
                          //   $('.error-all').removeClass('has-success').addClass('has-error');
                          //
                          $('.errPopup').show();
                          $('.alert-upload').html(result.content);
                          //   $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                          //       $("#danger-alert").slideUp(1000);
                          //       $('.errPopup').hide();
                          //   });
                      } else {
                          //   $('.error-all').find('.help-block').html('Undefined error');
                          //   $('.error-all').removeClass('has-success').addClass('has-error');
                          //
                          $('.errPopup').show();
                          $('.alert-upload').html('Oops, something went wrong');
                          //   $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                          //       $("#danger-alert").slideUp(1000);
                          //       $('.errPopup').hide();
                          //   });
                      }
                  },
                  error: function(jqXHR, exception) {
                          //show error message

                          //   if (jqXHR.status == 200 || jqXHR.status == 0) {
                          //       //   console.log(jqXHR.status + ' - ' + exception);
                          //       //   $('.error-all').find('.help-block').html(jqXHR.status + ' - ' + exception);
                          //       //   $('.error-all').removeClass('has-success').addClass('has-error');
                          //       //
                          //       $('.errPopup').show();
                          //       $('.alert-upload').html(jqXHR.status + ' - ' + exception);
                          //       $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                          //           $("#danger-alert").slideUp(1000);
                          //           $('.errPopup').hide();
                          //       });
                          //   } else {

                          // location.href = "/upload"
                          //   $('.error-all').find('.help-block').html(jqXHR.status + ' - ' + exception);
                          //   $('.error-all').removeClass('has-success').addClass('has-error');
                          //   //
                          $('.errPopup').show();
                          $('.alert-upload').html('Oops, something went wrong');
                          //   $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                          //       $("#danger-alert").slideUp(1000);
                          //       $('.errPopup').hide();
                          //   });
                          //   }

                      }
                      // timeout: 300000
              }).always(function(data) {

                  $('#loading').hide();

              });
          }
      });

      //   function send_data_setting() {}
      $(function() {
          $('.editor').froalaEditor()
      });
  });