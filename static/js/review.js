var word;
var wordArray;
var wordIndex = 0;
$(function () {
    function renderWord(data) {
        data = data.fields;
        word = data.word;
        console.log(word)
        $('#tmpl-word').text(word);
        $('.progress-bar').css("width", data.rate * 100 + "%");
        if (!data.rate == 0 || !data.rate == null) {
            $('#tmpl-progress').text(data.forget_num + '/' + data.total_num);
        } else {
            $('#tmpl-progress').text('');
        }

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

    // 页面初始渲染
    $.ajax({
        url: '/review/get_word',
        type: 'GET',
        data: { list: getQueryString('list') }
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

    $('.btn').on('click', function (e) {
        e.preventDefault();
        if ($(this).text() == '我记得') {
            var remember = true;
        } else if ($(this).text() == '不认识') {
            var remember = false;
        }
        $.ajax({
            url: '/review/review_a_word',
            type: 'POST',
            data: {
                remember: remember,
                word: word,
            }
        }).done(function (response) {
            if (response.status === 200) {
                // console.log(wordArray.pop(wordArray[wordIndex]));
                // console.log(wordArray)
                wordIndex = selectWord();
                $('#tmpl-content').addClass('d-none')

                renderWord(wordArray[wordIndex]);
            }
            layer.msg(response.msg);
        })
    })

})

