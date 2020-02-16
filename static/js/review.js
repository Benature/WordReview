var word;
var wordCount = 0; // 本次复习的计数
var book = getQueryString('book');
var wordArray;
var wordIndex = 0;
var lastWord = '';
var remember = true; // 这个单词是否记住了
var sortMode = '顺序'; //排序模式

function compareField(att, direct) {
    return function (a, b) {
        var value1 = a.fields[att];
        var value2 = b.fields[att];
        return (value1 - value2) * direct;
    }
}


$(function () {
    /**
     * 渲染单词 页面
     * @param {object} data 单词数据
     */
    function renderWord(data) {
        data = data.fields;
        word = data.word;
        console.log(word)
        $('#tmpl-word').text(word);
        $('#tmpl-last-word').text(wordCount + '| ' + lastWord)
            .removeClass(remember ? 'last-forget' : 'last-remember')
            .addClass(remember ? 'last-remember' : 'last-forget');
        $('.progress-bar').css("width", data.rate * 100 + "%");
        if (!data.rate == 0 || !data.rate == null) {
            $('#tmpl-total-num').addClass('d-none');
            $('#tmpl-progress').text(data.forget_num + '/' + data.total_num);
            $('#tmpl-total-num').text('');
        } else {
            $('#tmpl-total-num').removeClass('d-none');
            $('#tmpl-progress').text('');
            $('#tmpl-total-num').text(data.total_num);
        }
        $('#tmpl-index').text('L' + data.LIST + ' U' + data.UNIT + ' I' + data.INDEX +
            ' [' + wordIndex + '/' + wordArray.length + ']');

        // 中文释义处理
        let means = data.mean.split('\n')
        var mean_content = '';
        for (let i = 0; i < means.length; i++) {
            mean_content += '<p>' + means[i] + '</p>'
        }
        $.template("mean", mean_content);
        $('#tmpl-content').empty()
        $.tmpl("mean").appendTo($('#tmpl-content'))
    }

    function selectWord() {
        return ++wordIndex;
    }
    // =============================================================
    //                          页面初始渲染
    // =============================================================
    $.ajax({
        url: '/review/get_word',
        type: 'GET',
        data: {
            list: getQueryString('list'),
            book: book,
        }
    }).done(function (response) {
        console.log(response)
        wordArray = response.data;
        let data = response.data[wordIndex];
        if (response.status === 200) {
            renderWord(data);
        } else {
            layer.msg(response.msg)
        }
    })


    $('#meaning-box').on('click', function (e) {
        $('#tmpl-content').removeClass('d-none')
    })

    // 往前查看单词时候看到更新后的信息
    function hotUpdate(remember) {
        let w = wordArray[wordIndex].fields;
        if (!remember) {
            w.forget_num++;
        }
        w.total_num++;
        w.rate = w.forget_num / w.total_num;
    }

    // 复习完一个单词
    $('.btn').on('click', function (e) {
        e.preventDefault();
        if ($(this).text() == '我记得') {
            remember = true;
        } else if ($(this).text() == '不认识') {
            remember = false;
        }
        $.ajax({
            url: '/review/review_a_word',
            type: 'POST',
            data: {
                remember: remember,
                word: word,
                book: book,
            }
        }).done(function (response) {
            if (response.status === 200) {
                lastWord = word;
                wordCount++;
                hotUpdate(remember);
                // console.log(wordArray.pop(wordArray[wordIndex]));
                // console.log(wordArray)
                if (wordIndex != wordArray.length - 1) {
                    wordIndex = selectWord();
                } else {
                    layer.msg('背完了')
                }
                $('#tmpl-content').addClass('d-none')

                renderWord(wordArray[wordIndex]);
            } else {
                layer.msg(response.msg);
            }
        })
    })

    $('.btn-jump').on('click', function (e) {
        let display = false;
        if ($(this).text() == '«') {
            if (wordIndex > 0) {
                layer.msg('跳转到上一个单词');
                wordIndex--;
                display = true
            } else {
                layer.msg('这是第一个单词');
            }
        } else if ($(this).text() == '»') {
            if (wordIndex < wordArray.length - 1) {
                wordIndex++;
                layer.msg('跳转到下一个单词');
            } else {
                layer.msg('这是最后一个单词');
                display = true;
            }
        }
        console.log(wordIndex);
        if (display) {
            $('#tmpl-content').removeClass('d-none')
        } else {
            $('#tmpl-content').addClass('d-none')
        }
        renderWord(wordArray[wordIndex]);
    })

    // 列表重排序
    $('.sort-array').on('click', function (e) {
        let text = $(this).text();
        if (text != sortMode) {
            wordArray = wordArray.slice(wordIndex);
            switch (text) {
                case '顺序':
                    wordArray.sort(function (a, b) {
                        a = a.fields;
                        b = b.fields;
                        if (a.LIST == b.LIST) {
                            if (a.UNIT == b.UNIT) {
                                return a.INDEX - b.INDEX;
                            } else {
                                return a.UNIT - b.UNIT;
                            }
                        } else {
                            return a.LIST - b.LIST;
                        }
                    })
                    break;
                case '乱序':
                    wordArray.sort(function (a, b) {
                        return Math.random() > 0.5 ? -1 : 1;
                    })
                    break;
                case '记忆序':
                    wordArray.sort(compareField('rate', -1));
                    break;
                case '次数序':
                    wordArray.sort(compareField('total_num', 1));
                    break;
                default:
                    console.error('未知' + text);
            }
            sortMode = text;
            wordIndex = 0;
            renderWord(wordArray[wordIndex]);
        } else {
            layer.msg('已是' + text);
        }

    })

})

// 快捷键
$(document).keyup(function (e) {
    // console.log(e.keyCode);
    if (37 == e.keyCode && e.shiftKey) {
        // shift + left arrow
        $('#btn-forget').click();
    }
    else if (39 == e.keyCode && e.shiftKey) {
        // shift + right arrow
        $('#btn-remember').click();
    }
    else if (188 == e.keyCode) {
        $('#jump-back').click();
    }
    else if (190 == e.keyCode) {
        $('#jump-forward').click();
    }
    else if (32 == e.keyCode) {
        // blank
        $('#meaning-box').click();
    }

});
