$(function () {
    $('#submit-btn').on('click', function (e) {
        $('#submit-btn').addClass('d-none');
        $('#wait').text('导入数据库中，成功后将自动跳转')
    })
})