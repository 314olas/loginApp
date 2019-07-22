$('#registration').on('submit', function (e) {
    e.preventDefault();
    var newUserObj = {};
    $('#registration').find('input').each(function (i, el) {
        newUserObj[$(el).attr('name')] = $(el).val();
    });
    $.ajax({
        type: 'POST',
        data: newUserObj,
        url: '/registration',
        success: function success(data) {
            $('#msg').text();
            data.isRedirect ? document.location.replace( data.redirectPath )  :  true;
        },
        error: function error(e) {
            $('#msg').text(JSON.parse(e.responseText).text);
        }
    });
});

$('#login').on('submit', function (e) {
    e.preventDefault();
    var newUserObj = {};
    $('#login').find('input').each(function (i, el) {
        newUserObj[$(el).attr('name')] = $(el).val();
    });
    $.ajax({
        type: 'POST',
        data: newUserObj,
        url: '/login',
        success: function success(data) {
            data.isRedirect ? document.location.replace( data.redirectPath )  :  true;
        },
        error: function error(e) {
            $('#msg').text(JSON.parse(e.responseText).text)
        }
    });
});

$('#resetPassword').on('submit', function (e) {
    e.preventDefault();
    var newUserObj = {};
    $('#resetPassword').find('input').each(function (i, el) {
        newUserObj[$(el).attr('name')] = $(el).val();
    });
    $.ajax({
        type: 'POST',
        data: newUserObj,
        url: '/resetPassword/step1',
        success: function success(data) {
           data.isRedirect ? document.location.replace( data.redirectPath )  :  true;
        },
        error: function error(e) {
            $('#msg').text(JSON.parse(e.responseText).text)
        }
    });
});

$('#resetPasswordStep2').on('submit', function (e) {
    e.preventDefault();

    const firstPass =  $('#resetPasswordStep2 [name=passwordFirst]').val();
    const secondPass =  $('#resetPasswordStep2 [name=passwordTwo]').val();
   if ( firstPass === secondPass ) {
       let arr = window.location.pathname.split('/');
       arr.join = [].join;
       $.ajax({
           type: 'PUT',
           data: {password: firstPass},
           url: `/resetPassword/step2/${arr[arr.length-1]}`,
           success: function success(data) {
               data.isRedirect ? document.location.replace( data.redirectPath )  :  true;
           },
           error: function error(e) {
               $('#msg').text(JSON.parse(e.responseText).text)
           }
       });
   } else {
       $('#msg').text('passwords don\'t not match')
   }
});
