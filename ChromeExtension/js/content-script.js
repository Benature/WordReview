var word = '';

var baseUrl = "http://www.wordsand.cn/lookup.asp?word=abandon";

function renderWordSand(word_now) {
    chrome.runtime.sendMessage({
        action: "wordsand",
        word: word_now,
    }, function (response) {
        if (response.status == 'done') {
            if (/<td.*valign.*width.*bgcolor.*>([\s\S]*?)<\/td>/g.test(response.content)) {
                document.getElementById('word-sand').innerHTML = RegExp.$1
                    .replace(/<center>[\s\S]+?<\/center>/, '')
                    .replace(/<font.*?>/, '<font>');
            }
        } else {
            console.error('word sand 失败', word_now)
        }
    });
    word = word_now;
}

renderWordSand()

$(function () {
    $(document).keyup(function (e) {
        if ((188 == e.keyCode && !e.shiftKey) ||
            (190 == e.keyCode && !e.shiftKey) ||
            (32 == e.keyCode || 191 == e.keyCode)) {
            setTimeout(function () {
                let word_now = $('#tmpl-word').text()
                // console.log('crx', word_now)
                if (word_now != word) {
                    renderWordSand(word_now)
                }
            }, 500);// 先等待原始页面渲染
        }
        // setTimeout(function () {
        //     chrome.storage.sync.get({wordsand: 'Failed',}, function (items) {console.log(items);});
        // }, 1000)
    })
})
