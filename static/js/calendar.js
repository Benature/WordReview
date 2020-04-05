var EBBINGHAUS_DELTA;
var today;
var calendar_begin;
var calendar_end;
var showWeekNum = 4; // 一次显示多少个星期

function addDays(date, num) {
    var newDate = new Date();
    newDate.setTime(date.getTime() + (num * 24 * 60 * 60 * 1000) + 1);
    return newDate;
}

function dayDelta(d1, d2) {
    let d = (d1 - d2) / (1000 * 60 * 60 * 24);
    return parseInt(d);
}

function getDataRow(data, i, tag = 'td') {
    let row = document.createElement('tr');
    // row.setAttribute('style', 'min-height:30px;')
    for (let j = i * 7; j < (i + 1) * 7; j++) {
        let cell = document.createElement(tag);
        let date = addDays(calendar_begin, j)
        let bigDiv = document.createElement('div');
        bigDiv.innerHTML = '<div class="td-date">' + (date.getMonth() + 1) + '月' + date.getDate() + '日' + '</div>';

        let text = '<div class="d-flex flex-wrap">';
        for (let k = 0; k < data[j].length; k++) {
            let d = data[j][k];
            let l = (d.LIST + 1).toString();
            // l = l.length == 1 ? '0' + l : l;
            let cls = d.state ? 'undo' : 'done';
            let href = 'book=' + d.BOOK + '&list=' + d.LIST;
            text += '<div class="list ' + cls + '" href="' + href + '">' + d.abbr + l + '<sup>' + d.c + '</sup></div>';
        }
        bigDiv.innerHTML += text + '</div';

        bigDiv.setAttribute('class', 'td-div');
        cell.appendChild(bigDiv);
        cell.setAttribute('valign', 'top')
        row.appendChild(cell);
    }

    return row; //返回tr数据	 
}

function drawTable(data) {
    var tbody = document.getElementById('tbMain');
    for (var i = 0; i < showWeekNum; i++) {
        var trow = getDataRow(data, i);
        tbody.appendChild(trow);
    }
}

function pushCalendarData(list, j, state) {
    return {
        BOOK: list.BOOK,
        LIST: (list.LIST),
        c: j + list.begin_index,
        state: state,
        abbr: list.abbr,
    }
}

function renderCalendar(data) {
    today = new Date();
    calendar_begin = addDays(today, (-today.getDay() - 7));
    calendar_end = addDays(calendar_begin, 7 * showWeekNum);
    var calendar = new Array(7 * showWeekNum);
    for (let i = 0; i < calendar.length; i++) {
        calendar[i] = new Array();
    }
    for (let i = 0; i < data.length; i++) {
        list = data[i].fields;
        let last_review_date = new Date(list.last_review_date);
        for (let j = list.ebbinghaus_counter; j < EBBINGHAUS_DELTA.length; j++) {
            let next_day = addDays(last_review_date, EBBINGHAUS_DELTA[j]);
            if (dayDelta(next_day, calendar_end) >= 0) { break; }
            let index_tmp = dayDelta(next_day, calendar_begin) + 1;
            if (index_tmp < 0) {
                console.log('过期：', pushCalendarData(list, j, true));
                continue;
            }
            calendar[index_tmp].push(pushCalendarData(list, j, true));
            last_review_date = next_day;
        }
        let history = list.review_dates.split(';');
        for (let j = 0; j < history.length; j++) {
            let old_date = new Date(history[j]);
            let d = dayDelta(old_date, calendar_begin) + 1;
            if (d < 0) { continue; }
            calendar[d].push(
                pushCalendarData(list, j, false));
        }
    }
    drawTable(calendar);
}

$(function () {
    // 页面渲染
    $.ajax({
        url: '/review/get_calendar_data',
        type: 'GET',
        data: {}
    }).done(function (response) {
        if (response.status === 200) {
            EBBINGHAUS_DELTA = response.EBBINGHAUS_DELTA;
            renderCalendar(response.data);
        }
    })

    $('#tbMain').on('click', '.undo', function (e) {
        window.location = '/review/review?' + $(this).attr('href')
    })
})