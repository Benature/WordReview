$.ajax({
    // timeout: 1, // set timeout but failed
    url: 'https://en.wikiquote.org/w/api.php?format=json&action=parse&prop=text&page=Main%20Page',
    dataType: "jsonp",
}).done(function (response) {
    let $qotd = $('#tmpl-qotd')
    let minH = 100;
    $qotd.html(response.parse.text['*']);
    $qotd.html($('#mf-qotd').html())

    // delete nodes
    $qotd.find('small').empty();
    $qotd.find('div').find('div')[0].innerHTML = '';

    //left align
    $qotd.find('td').find('td').eq(2).find('tr').eq(0).css('text-align', 'left');

    // adjust img
    let $img = $qotd.find('img');
    $img.css('margin-left', '5px');
    let w = $img.width();
    let h = $img.height();
    $img.height(minH);
    $img.width(minH / h * w);

    let H = $qotd.height();
    if (H > minH) {
        $img.height(H);
        $img.width(H / h * w);
    }
})