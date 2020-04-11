$('.register').ready(function () {
    //初始化高百度
    $('.register').height($(window).height());
    //当文档度窗口发生专改变时属 触发
    $(window).resize(function () {
        var sum = $(window).height();
        $(".register").css({
            height: sum,
        })
    })
});
let inputWarning1 = false;
let inputWarning2 = false;
let inputWarning3 = false;
$('#login').on('click', function () {
    var html = template('loginCut', {name: 12});
    $('.register').html(html)
});
// 返回登录页面
$('.register').on('click', '#btn', function () {
    location.reload()
    // 上传图像
}).on('change', '#exampleInputFile', function () {
    let formData = new FormData();
    formData.append('avatar', this.files[0]);
    $.ajax({
        type: 'post',
        url: '/image',
        data: formData,
        processData: false,
        contentType: false,
        success: function (doc) {
            $('.hiddenImgUrl').val(doc);
        }
    })
}).on('blur', '.username', function () {
    let reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
    if (reg.test($(this).val())) {
        $.ajax({
            type: 'post',
            url: '/username',
            data: {
                username: $(this).val()
            },
            success: function (doc) {
                $('.span1').css({
                    display: 'block'
                }).text(doc.message);
                // 如果返回的状态码 == 200 那么才可以注册
                if (doc.status === 200) {
                    inputWarning3 = true;
                    $('.span1').prev().css({
                        display: 'block'
                    });
                    $('.usernameShow').removeClass('glyphicon-remove').parent().removeClass('has-error');
                } else {
                    $('.span1').prev().css({
                        display: 'block'
                    });
                    $('.usernameShow').addClass('glyphicon-remove').parent().addClass('has-error');
                }
            }
        });
    } else {
        $('.span1').css({
            display: 'block'
        }).text('请输入正确的邮箱格式').prev().css({
            display: 'block'
        });
        $('.usernameShow').addClass('glyphicon-remove').parent().addClass('has-error');
    }
    if ($(this).val() === '') {
        $('.usernameShow').removeClass('glyphicon-remove').parent().removeClass('has-error');
        $('.span1').css({
            display: 'none'
        }).text('').prev().css({
            display: 'none'
        });
    }
    return false
}).on('blur', '.password', function () {
    let reg = /^[a-zA-Z\d_]{6,16}$/;
    if (reg.test($(this).val())) {
        $('.span2').css({
            display: 'none'
        }).prev().css({
            display: 'block'
        });
        inputWarning1 = true;
        $('.passwordShow').removeClass('glyphicon-remove').parent().removeClass('has-error');
    } else {
        $('.span2').css({
            display: 'block'
        }).text('密码格式输入错误').prev().css({
            display: 'block'
        });
        $('.passwordShow').addClass('glyphicon-remove').parent().addClass('has-error');
    }
    if ($(this).val() === '') {
        $('.span2').css({
            display: 'none'
        }).prev().css({
            display: 'none'
        });
        $('.passwordShow').removeClass('glyphicon-remove').parent().removeClass('has-error');
    }
}).on('blur', '.verifyPassword', function () {
    if ($(this).val() === $('.password').val()) {
        $('.span3').css({
            display: 'none'
        }).prev().css({
            display: 'block'
        });
        inputWarning2 = true;
        $('.verifyPasswordShow').removeClass('glyphicon-remove').parent().removeClass('has-error');
    } else {
        $('.span3').css({
            display: 'block'
        }).text('两次输入密码格式不一样').prev().css({
            display: 'block'
        });
        $('.verifyPasswordShow').addClass('glyphicon-remove').parent().addClass('has-error');
    }
    if ($(this).val() === '') {
        $('.span3').css({
            display: 'none'
        }).prev().css({
            display: 'none'
        });
        $('.verifyPasswordShow').removeClass('glyphicon-remove').parent().removeClass('has-error');
    }
}).on('click', '#btnLogin', function () {
    let formData = new FormData($('#form').get()[0]);
    if (inputWarning1 && inputWarning2 && inputWarning3) {
        $.ajax({
            type: 'post',
            url: '/login',
            data: {
                username: formData.get('username'),
                password: formData.get('password'),
                imgUrl: formData.get('imgUrl'),
            },
            success: function (doc) {
                alert('注册成功');
                location.reload();
            },
            error: function (err) {
                alert('注册失败')
            }
        })
    } else {
        alert('请填写账号密码')
    }
});
