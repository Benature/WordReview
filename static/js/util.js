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
    input.blur();
}

function readText(word, source = 'baidu') {
    if (source == 'baidu') {
        document.getElementById('bd-tts').innerHTML =
            '<audio id="bd-tts-audio" autoplay="autoplay">' +
            '<source src="http://tts.baidu.com/text2audio?lan=en&ie=UTF-8&spd=4&text=' +
            word + '" type="audio/mpeg"><embed id="tts_embed_id" height="0" width="0" src=""></audio>';
        document.getElementById('bd-tts-audio').play();
    } else if (source == 'browser') {
        let speechInstance = new SpeechSynthesisUtterance(word);
        speechSynthesis.speak(speechInstance);
    }
}