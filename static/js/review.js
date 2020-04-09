var word;
var rawWordLength;
var wordCount = 0; // 本次复习的计数
var book = getQueryString('book');
var wordArray;
var wordIndex = 0;
var lastWord = '';
var remember = true; // 这个单词是否记住了
var sortMode = ''; //排序模式
var note = '';
var begin_index;

var repeatMode = true;
var previewMode = false;

var currentHistoryX = [''];
var currentHistoryY = [0];
var noteFocus = false;

function compareField(att, direct) {
    return function (a, b) {
        var value1 = a.fields[att];
        var value2 = b.fields[att];
        return (value1 - value2) * direct;
    }
}


$(function () {

    /**
     * 渲染拆解单词 
     */
    function renderBreakWord(text) {
        let tmpl_break_word = document.getElementById('tmpl-break-word')
        tmpl_break_word.innerHTML = '';
        let notes = text.split('\n')
        for (let i = 0; i < notes.length; i++) {
            let note_break = notes[i].split('=');
            if (word.indexOf(note_break[0]) == -1 || (word == note_break[0] && notes[0].indexOf('=') == -1)) { continue; }

            let word_block = document.createElement('span');
            word_block.setAttribute('class', 'word-block');
            let word_break = document.createElement('div');
            word_break.innerText = note_break[0];
            // word_break.setAttribute('class', 'text-center');
            let word_explain = document.createElement('div');
            word_explain.innerText = note_break.length == 1 ? '' : note_break[1];
            word_explain.setAttribute('class', 'word-explain')
            // console.log(notes[i]);

            word_block.appendChild(word_break)
            word_block.appendChild(word_explain)
            tmpl_break_word.appendChild(word_block);
        }
    }
    /**
     * 渲染单词 页面
     * @param {object} data 单词数据
     * @param {bool} copy 是否朗读
     */
    function renderWord(data, copy = true) {
        data = data.fields;
        word = data.word;
        // console.log(data.panTotalNum, data.panForgetNum, data.panRate)
        console.log(word)
        $('#tmpl-word')[0].innerHTML = '<a class="word-display">' + word + '</a>' +
            (data.webster ? ' <a style="color: red;">  𝓦</a>' : '');
        $('#tmpl-last-word').text(wordCount + '| ' + lastWord)
            .removeClass(remember ? 'last-forget' : 'last-remember')
            .addClass(remember ? 'last-remember' : 'last-forget');
        // console.log(data.panRate);
        if (0 != data.panTotalNum) {
            $('.progress-bar').css("width", (1 - data.panRate) * 100 + "%");
            $('#tmpl-total-num').addClass('d-none');
            $('#tmpl-progress').text((data.panTotalNum - data.panForgetNum) + '/' + data.panTotalNum);
            if (data.panTotalNum == data.panForgetNum) {
                $('#tmpl-progress').css('padding-left', '5px');
            } else {
                $('#tmpl-progress').css('padding-left', '0');
            }
            $('#tmpl-total-num').text('');
        } else {
            $('.progress-bar').css("width", "0%");
            $('#tmpl-total-num').removeClass('d-none');
            $('#tmpl-progress').text('');
            $('#tmpl-total-num').text(data.panTotalNum);
        }
        $('#tmpl-index').text('L' + data.LIST + ' U' + data.UNIT + ' I' + data.INDEX +
            ' [' + wordIndex + '/' + wordArray.length + ']');

        // note
        note = data.note;
        if (data.note.length == 0) {
            $('#tmpl-note').addClass('d-n-note');
            $('#tmpl-note').val(word);
        } else {
            $('#tmpl-note').removeClass('d-n-note');
            $('#tmpl-note').val(note);
        }

        // 词根词缀拆解
        renderBreakWord(note);

        // 中文释义处理
        let means = data.mean.split('\n')
        var mean_content = '';
        for (let i = 0; i < means.length; i++) {
            mean_content += '<p>' + means[i] + '</p>'
        }
        $.template("mean", mean_content);
        $('#tmpl-content').empty();
        $.tmpl("mean").appendTo($('#tmpl-content'));

        // 例句
        let sentence = data.sentence.replace('‖', '\n').replace('||', '\n').split('\n')
        $('#tmpl-sentence').empty();
        if (sentence != '') {
            var sentence_content = '';
            for (let i = 0; i < sentence.length; i++) {
                let eng = sentence[i].match(/[a-z \-,.?!'’“”…"0-9—]+/ig);
                let zh = sentence[i].match(/[\u4e00-\u9fa5【】：，。《》()“”、 0-9—]+/g);
                for (let j = eng.length; j >= 0; j--) {
                    if (eng[j] == ' ') { eng.splice(j, 1); }
                }
                for (let j = zh.length; j >= 0; j--) {
                    if (zh[j] == ' ') { zh.splice(j, 1); }
                }
                if (eng == null || eng == 'nan') { eng = ''; }
                if (zh == null) { zh = ''; }
                sentence_content += '<p class="flex-column d-flex"><a>' + eng.join('\n') + '</a><a class="sentence-zh">' + zh.join('\n') + '</a></p>';
                console.log(sentence)
                console.log(eng, zh)
            }
            $.template("sentence", sentence_content);
            $.tmpl("sentence").appendTo($('#tmpl-sentence'));
        }

        // 单词标签
        $('.icon-flags').children().each(function () {
            $(this).removeClass('icon-enabled').addClass('icon-disabled');
        })
        if (data.flag == 1) {
            $('.icon-ok').removeClass('icon-disabled').addClass('icon-enabled')
        } else if (data.flag == -1) {
            $('.icon-star').removeClass('icon-disabled').addClass('icon-enabled')
        }
        // console.log(data.flag)


        if (copy) {
            copy2Clipboard(word, "clipboard");
            // readText(word);
        }

        if (wordCount == wordIndex + 50 && repeatMode) {
            layer.msg('错误次数太多，将关闭重现模式😅')
            $('.repeat').click();
        }

        // echarts 画图
        let X = [0];
        let Y = [0];
        for (let i = 0; i < data.panHistory.length; i++) {
            let h = data.panHistory[i]
            X.push(i + 1);
            // if (i == 1) {
            //     Y[1] = h == '1' ? 1 : -1;
            //     continue;
            // }
            Y[i + 1] = Y[i] + (h == '1' ? 1 : -1);
        }
        let myChart = echarts.init(document.getElementById("echarts-left"));

        option = {
            title: {
                show: true,
                text: word,
                subtext: '复习历史',
                textStyle: {
                    color: "#757575",
                    fontWeight: "normal",
                },
                // textStyle: {
                //     color: "#333",
                // },
            },
            legend: {
                data: ['记忆曲线']
            },
            toolbox: {
                show: false,
                feature: {
                    mark: { show: true },
                    dataView: { show: true, readOnly: true },
                    magicType: { show: true, type: ['line', 'bar'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            xAxis: {
                show: false,
                type: 'category',
                boundaryGap: false,
                data: X,
            },
            yAxis: {
                // show: false,
                type: 'value',
                // axisLine: {
                //     lineStyle: {
                //         color: '#1a85ff'
                //     }
                // }
            },
            series: [
                {
                    data: Y,
                    type: 'line',
                    // areaStyle: {}
                    smooth: 0.2,
                    color: '#1a85ff',
                },
            ]
        };
        myChart.setOption(option);
        $('#echarts-left').addClass('d-none');
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
        if (response.status === 200) {
            wordArray = response.data;
            begin_index = response.begin_index;
            rawWordLength = wordArray.length;
            for (let i = 0; i < response.sort.length; i++) {
                $('.sort-array').each(function () {
                    if ($(this).text() == response.sort[i]) {
                        $(this).click();
                    }
                })
            }
        } else {
            layer.msg(response.msg)
        }
    })


    $('#meaning-box').on('click', function (e) {
        readText(word);
        $('.hide').removeClass('d-none');
    })
    $('#active-note').on('click', function (e) {
        if ($('#tmpl-note').hasClass('d-n-note')) {
            $('.hide').removeClass('d-n-note');
            $('#tmpl-note').select();
        }
    })

    // 往前查看单词时候看到更新后的信息
    function hotUpdate(remember) {
        let w = wordArray[wordIndex].fields;
        let word_tmp = wordArray[wordIndex]
        if ($('#tmpl-note').val() != word) {
            w.note = $('#tmpl-note').val();
        }
        if (!remember) {
            w.panForgetNum++;
            if (repeatMode) {
                if (wordIndex != wordArray.length - 1) {
                    wordArray.splice(wordIndex, 1);
                    let index_tmp = Math.round(Math.random() * (wordArray.length - wordIndex)) + wordIndex;
                    index_tmp += Math.min(wordArray.length - wordIndex - 1, 5); // 防止过快重现
                    word_tmp.repeat = true;
                    wordArray.splice(index_tmp, 0, word_tmp);
                }
                wordIndex--;
            }
        }
        w.panHistory += remember ? '1' : '0';
        w.panTotalNum++;
        w.panRate = w.panForgetNum / w.panTotalNum;

        // echarts 画图
        currentHistoryX.push(word);
        if (wordCount == 1) {
            currentHistoryY[1] = remember ? 1 : -1;
        } else {
            currentHistoryY.push(currentHistoryY[wordCount - 1] + (remember ? 1 : -1));
        }
        let myChart = echarts.init(document.getElementById("echarts-bottom"));

        option = {
            title: {
                show: true,
                text: '本轮复习记忆历史',
                textStyle: {
                    color: "#757575",
                    fontWeight: "normal",
                    fontSize: "14px",
                },
            },
            legend: {
                data: ['记忆曲线']
            },
            toolbox: {
                show: false,
                feature: {
                    mark: { show: true },
                    dataView: { show: true, readOnly: true },
                    magicType: { show: true, type: ['line', 'bar'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            xAxis: {
                // show: false,
                type: 'category',
                // boundaryGap: false,
                data: currentHistoryX.slice(Math.max(0, currentHistoryX.length - 10), currentHistoryX.length),
                axisLine: {
                    lineStyle: {
                        color: '#757575'
                    },
                    textStyle: {
                        fontSize: "10px",
                    },
                },
                axisLabel: {
                    interval: 0,
                    rotate: -30,
                },
                grid: {
                    left: '10%',
                    bottom: '40%',
                },
            },
            yAxis: {
                show: false,
                type: 'value',
            },
            series: [
                {
                    data: currentHistoryY.slice(Math.max(0, currentHistoryY.length - 10), currentHistoryY.length),
                    type: 'line',
                    smooth: 0.2,
                    color: '#bec980',
                },
            ]
        };
        myChart.setOption(option);
    }

    // 复习完成后更新后端数据库
    function review_finish_post() {
        $.ajax({
            url: '/review/review_list_finish',
            type: 'POST',
            data: {
                list: getQueryString('list'),
                book: book,
            }
        }).done(function (response) {
            if (response.status === 200) {
                readText('Mission completed!');
            } else {
                layer.msg(response.msg);
            }
        })
    }

    // 复习完一个单词
    $('.jump-btn').on('click', function (e) {
        e.preventDefault();
        if ($(this).text() == '我记得') {
            remember = true;
        } else if ($(this).text() == '不认识') {
            remember = false;
        }
        let note_now = $('#tmpl-note').val();
        $.ajax({
            url: '/review/review_a_word',
            type: 'POST',
            data: {
                remember: remember,
                word: word,
                list: wordArray[wordIndex].fields.LIST,
                book: book,
                note: (note == note_now || note_now == word) ? false : note_now,
                repeat: wordArray[wordIndex].repeat == true ? true : false,
            }
        }).done(function (response) {
            if (response.status === 200) {
                lastWord = word;
                wordCount++;
                hotUpdate(remember);
                if (wordIndex != wordArray.length - 1) {
                    wordIndex = selectWord();
                    $('.hide').addClass('d-none')
                    renderWord(wordArray[wordIndex]);
                } else {
                    review_finish_post();
                    readText('finished list' + (parseInt(getQueryString('list')) + begin_index));
                    layer.msg('背完了(●´∀｀●)ﾉ')
                    renderWord(wordArray[wordIndex], false);
                }
            } else {
                layer.msg(response.msg);
            }
        })
    })

    // 直接跳转
    $('.btn-jump').on('click', function (e) {
        let display = false;
        if ($(this).text() == '«') {
            if (wordIndex > 0) {
                layer.msg('跳转到上一个单词');
                wordIndex--;
                display = true;
            } else {
                layer.msg('这是第一个单词');
            }
        } else if ($(this).text() == '»') {
            if (wordIndex < wordArray.length - 1) {
                wordIndex++;
                layer.msg('跳转到下一个单词');
            } else {
                layer.msg('这是最后一个单词');
                review_finish_post();
                display = true;
            }
        }
        renderWord(wordArray[wordIndex]);
        if (display) {
            $('.hide').removeClass('d-none');
        } else {
            $('.hide').addClass('d-none');
        }
    })
    // 特定页跳转
    $('#btn-quick-jump').on('click', function (e) {
        let i = parseInt($('#jump-index').val());
        if (i <= wordArray.length && i > 0) {
            layer.msg('跳转到第' + i + '个单词')
            wordIndex = i - 1
        } else if (i <= 0) {
            wordIndex = 0;
        } else {
            wordIndex = wordArray.length - 1;
        }
        renderWord(wordArray[wordIndex]);
        $('#jump-index').val('');
    })
    $('#jump-index').keyup(function (e) {
        if (13 == e.keyCode) {
            $('#btn-quick-jump').click();
        }
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
                    wordArray.sort(compareField('panRate', -1));
                    break;
                case '次数序':
                    wordArray.sort(compareField('panTotalNum', 1));
                    break;
                default:
                    console.error('未知' + text);
            }
            $('.hide').addClass('d-none');
            sortMode = text;
            console.log(text);
            wordIndex = 0;
            renderWord(wordArray[wordIndex]);
        } else {
            layer.msg('已是' + text);
        }

    })
    // 重现模式
    $('.repeat').on('click', function () {
        if ($(this).text() == '重现模式:关') {
            repeatMode = true
            $(this).text('重现模式:开')
            layer.msg('重现模式已开')
        } else if ($(this).text() == '重现模式:开') {
            repeatMode = false
            $(this).text('重现模式:关')
            layer.msg('重现模式已关')
        } else {
            layer.msg('未知选择：' + $(this).text())
        }
    })

    // note 区焦点
    $("#tmpl-note").focus(function () {
        noteFocus = true;
    });
    $("#tmpl-note").blur(function () {
        noteFocus = false;
        let note_now = $('#tmpl-note').val();
        // let note_pre = note;
        // note = $('#tmpl-note').val();
        renderBreakWord(note_now);
        if (note_now != note) {
            $.ajax({
                url: '/review/update_note',
                type: 'POST',
                data: {
                    word: word,
                    note: note_now == word ? '' : note_now,
                }
            }).done(function (response) {
                if (response.status === 200) {
                    wordArray[wordIndex].fields.note = note;
                } else {
                    layer.msg(response.msg);
                }
            })
        }
    });

    // 更新单词的 flag：太简单、重难词
    $('.icon-flags').on('click', function () {
        let $icon = $(this).children();
        let flag = 0;
        if ($icon.hasClass('icon-star')) {
            if ($icon.hasClass('icon-disabled')) {
                flag = -1;
                layer.msg('将' + word + '设为重难词');
            } else if ($icon.hasClass('icon-enabled')) {
                flag = 0;
                layer.msg('取消设置' + word + '为重难词');
            } else {
                console.error('unknown class');
                console.error($icon);
            }
        } else if ($icon.hasClass('icon-ok')) {
            if ($icon.hasClass('icon-disabled')) {
                flag = 1;
                layer.msg('将' + word + '设为太简单');
            } else if ($icon.hasClass('icon-enabled')) {
                flag = 0;
                layer.msg('取消设置' + word + '为太简单');
            } else {
                console.error('unknown class');
                console.error($icon);
            }
        } else {
            console.error('unknown class');
            console.error($icon);
        }
        $.ajax({
            url: '/review/update_word_flag',
            type: 'POST',
            data: {
                list: wordArray[wordIndex].fields.LIST,
                book: wordArray[wordIndex].fields.BOOK,
                word: word,
                flag: flag,
            }
        }).done(function (response) {
            if (response.status === 200) {
                if (flag != 0) {
                    $('.icon-flags').children().each(function () {
                        $(this).removeClass('icon-enabled').addClass('icon-disabled');
                    })
                    $icon.removeClass('icon-disabled').addClass('icon-enabled');
                } else {
                    $icon.removeClass('icon-enabled').addClass('icon-disabled');
                }
                wordArray[wordIndex].fields.flag = flag;
            } else {
                layer.msg(response.msg);
            }
        })
    })

    // 快捷键
    $(document).keyup(function (e) {
        // console.log(noteFocus)
        // console.log(e.keyCode);
        // console.log(e.ctrlKey, e.altKey);
        if (!noteFocus) {
            if (37 == e.keyCode && e.shiftKey) { // shift + left arrow
                if (!previewMode) {
                    $('#btn-forget').click();
                } else {
                    layer.msg('当前处于预习模式，不是复习')
                }
            }
            else if (39 == e.keyCode && e.shiftKey) { // shift + right arrow
                if (!previewMode) {
                    $('#btn-remember').click();
                } else {
                    layer.msg('当前处于预习模式，不是复b习')
                }
            }
            else if (188 == e.keyCode && !e.shiftKey) { // <
                $('#jump-back').click();
                if (previewMode) { $('#meaning-box').click(); }
            }
            else if (190 == e.keyCode && !e.shiftKey) { // >
                $('#jump-forward').click();
                if (previewMode) { $('#meaning-box').click(); }
            }

            else if (82 == e.keyCode && !e.shiftKey) { // R
                $('.repeat').click();
            }
            else if (69 == e.keyCode && e.shiftKey && !e.ctrlKey) { // shift + E
                $('.icon-ok').click();
            }
            else if (72 == e.keyCode && e.shiftKey && !e.ctrlKey) { // shift + H
                $('.icon-star').click();
            }
            else if ((78 == e.keyCode || 13 == e.keyCode) && !e.shiftKey) { // N or enter
                $('.hide').removeClass('d-n-note');
                $('#tmpl-note').select();
            }
            else if (32 == e.keyCode || 191 == e.keyCode/*|| 13 == e.keyCode*/) { // blank or /
                $('#meaning-box').click();
            }
            else if (84 == e.keyCode) { // T
                window.open('http://www.wordsand.cn/lookup.asp?word=' + word);
            }
            else if (80 == e.keyCode) { // P
                previewMode = true;
            }

            if (previewMode) {
                if (188 == e.keyCode && e.shiftKey) { // shift + <
                    wordIndex = Math.floor((wordIndex - 1) / 10) * 10;
                    renderWord(wordArray[wordIndex]);
                    $('#meaning-box').click();

                }
                else if (190 == e.keyCode && e.shiftKey) { // shift + >
                    wordIndex = Math.ceil((wordIndex + 1) / 10) * 10;
                    renderWord(wordArray[wordIndex]);
                    $('#meaning-box').click();
                }
            }
        }
    });
})

window.onbeforeunload = function (event) {
    if ((wordIndex == 0 && wordArray.length == rawWordLength) || previewMode) {
        console.log('拜拜')
    } else if (wordIndex != wordArray.length - 1) {
        return "本轮被单词进度将会丢失😣";
    }
}