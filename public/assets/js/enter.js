$('.enter').on('click', function () {
    var formData = new FormData(enter);
    var username = formData.get('username');
    var password = formData.get('password');
    if (username.length >= 6 && password.length >= 6) {
        $.ajax({
            type: 'post',
            url: '/enter',
            data: {
                username: username,
                password: password
            },
            success: function (doc) {
                location.href = '/enter.html' + '?uid=' + doc.uid
            },
            error: function (err) {
                alert(err.responseText)
            }
        })
    } else {
        alert('请输入6-16位用户名与密码')
    }
    return false;
});

