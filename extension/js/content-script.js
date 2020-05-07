var word = '';
var noteFocus = false;
var content = "";

function renderWordSand(word_now) {
    chrome.runtime.sendMessage({
        action: "wordsand",
        word: word_now,
    }, function (response) {
        if (response.status == 'done') {
            if (/<td.*valign.*width.*bgcolor.*>([\s\S]*?)<\/td>/g.test(response.content)) {
                content = RegExp.$1
                    .replace(/<center>[\s\S]+?<\/center>/, '')
                    .replace(/<font.*?>/, '<font>');
                document.getElementById('word-sand').innerHTML = content;
                if ($.trim($('#word-sand').text()) != '') {
                    $('#word-sand').css('display', '');
                    $('#tmpl-sentence').css('max-width', '400px');
                }
            }
        } else {
            console.error('word sand 失败', word_now)
        }
    });
    word = word_now;
}

function updateWordSand(delay = 500) {
    setTimeout(function () {
        let word_now = $('#tmpl-word').text()
        console.log('crx', word_now)
        if (word_now != word) {
            renderWordSand(word_now)
        }
    }, delay);// 先等待原始页面渲染
}

// 第一个单词渲染
updateWordSand(1500);

$(function () {
    $(document).keyup(function (e) {
        if ((188 == e.keyCode && !e.shiftKey) ||     // <
            (190 == e.keyCode && !e.shiftKey) ||     // >
            (37 == e.keyCode && e.shiftKey) ||       // shift + left arrow
            (39 == e.keyCode && e.shiftKey) ||       // shift + right arrow
            (32 == e.keyCode || 191 == e.keyCode)) { // blank or /
            updateWordSand();
        }
    })
})

$(document).ready(function () {
    $("#tmpl-note").focus(function () {
        noteFocus = true;
    });
    $("#tmpl-note").blur(function () {
        noteFocus = false;
    });
})