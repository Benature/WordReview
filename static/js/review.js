var word;
var wordCount = 0; // 本次复习的计数
var book = getQueryString('book');
var wordArray;
var wordIndex = 0;
var lastWord = '';
var remember = true; // 这个单词是否记住了
var sortMode = '乱序'; //排序模式

var currentHistoryX = new Array();
var currentHistoryY = new Array();


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
     * @param {bool} read 是否朗读
     */
    function renderWord(data, read = true) {
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
        $('#tmpl-content').empty();
        $.tmpl("mean").appendTo($('#tmpl-content'));

        if (read) {
            copy2Clipboard(word, "clipboard");
            readText(word);
        }

        // echarts 画图
        let X = new Array();
        let Y = new Array();
        for (let i = 0; i < data.history.length; i++) {
            let h = data.history[i]
            X.push(i);
            if (i == 0) {
                Y[0] = h == '1' ? 1 : -1;
                continue;
            }
            Y[i] = Y[i - 1] + (h == '1' ? 1 : -1);
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
        console.log(response)
        wordArray = response.data;
        // 乱序
        wordArray.sort(function (a, b) {
            return Math.random() > 0.5 ? -1 : 1;
        })
        let data = response.data[wordIndex];
        if (response.status === 200) {
            renderWord(data);
        } else {
            layer.msg(response.msg)
        }
    })


    $('#meaning-box').on('click', function (e) {
        $('.hide').removeClass('d-none')
    })

    // 往前查看单词时候看到更新后的信息
    function hotUpdate(remember) {
        let w = wordArray[wordIndex].fields;
        if (!remember) {
            w.forget_num++;
        }
        w.history += remember ? '1' : '0';
        w.total_num++;
        w.rate = w.forget_num / w.total_num;

        // echarts 画图
        console.log(wordCount)
        currentHistoryX.push(wordCount);
        console.log(currentHistoryX)
        if (wordCount == 1) {
            currentHistoryY[0] = remember ? 1 : -1;
        } else {
            currentHistoryY.push(currentHistoryY[wordCount - 2] + (remember ? 1 : -1));
        }
        let myChart = echarts.init(document.getElementById("echarts-bottom"));

        option = {
            title: {
                show: true,
                text: '本轮复习记忆历史',
                textStyle: {
                    color: "#757575",
                    fontWeight: "normal",
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
                data: currentHistoryX,
                axisLine: {
                    lineStyle: {
                        color: '#757575'
                    }
                }
            },
            yAxis: {
                show: false,
                type: 'value',
            },
            series: [
                {
                    data: currentHistoryY,
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
                    $('.hide').addClass('d-none')
                    renderWord(wordArray[wordIndex]);
                } else {
                    review_finish_post();
                    readText('finished list' + (parseInt(getQueryString('list')) + 1));
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
        if (display) {
            $('.hide').removeClass('d-none');
        } else {
            $('.hide').addClass('d-none');
        }
        renderWord(wordArray[wordIndex]);
    })
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
                    wordArray.sort(compareField('rate', -1));
                    break;
                case '次数序':
                    wordArray.sort(compareField('total_num', 1));
                    break;
                default:
                    console.error('未知' + text);
            }
            $('.hide').addClass('d-none');
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
    else if (32 == e.keyCode /*|| 13 == e.keyCode*/) {
        // blank
        $('#meaning-box').click();
        readText(word);
    }
});
