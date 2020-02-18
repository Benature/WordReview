function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

function copy2Clipboard(content, idN) {
    // var input = document.createElement('TEXTAREA');
    var input = document.getElementById(idN);
    input.value = content; // 修改文本框的内容
    input.select(); // 选中文本
    if (document.execCommand('copy')) {
    } else {
        console.error('复制失败');
    }

}