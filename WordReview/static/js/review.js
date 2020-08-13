var word;
// var rawWordLength;
var wordCount = 0; // 本次复习的计数
// var book = getQueryString('book');
var wordArray;
var wordIndex = 0;
var lastWord = "";
var remember = true; // 这个单词是否记住了
var sortMode = ""; //排序模式
var note = "";
var begin_index;
var recentReviewedWordsArray;

var mode = {
  repeat: true,
  preview: false,
  yesterday: false,
  input: false,
};
var currentHistoryX = [""];
var currentHistoryY = [0];
var noteFocus = false;

var operationHistory = { word: null, index: null };

function compareField(att, direct) {
  return function (a, b) {
    var value1 = a.fields[att];
    var value2 = b.fields[att];
    return (value1 - value2) * direct;
  };
}

var tmp;

var progressColors = new Array();

[
  "palevioletred",
  "#d79cfe",
  "#9cdcfe",
  "#5396cd",
  "dodgerblue",
  "#63d966",
].forEach((c) => {
  progressColors.push("#fee890");
  progressColors.push(c);
});

function progressIndex(data = null) {
  var N = 3,
    offset = 1;
  if (data == null) {
    data = { flag: 1 };
  } else if (typeof data == "number") {
    data = { flag: 0, panRate: data };
  } else {
    data = data.fields;
  }
  // console.log(data)

  if (data.flag == -1) {
    offset = 0;
  }

  if (data.flag != 1) {
    let rate = 1 - data.panRate;
    if (rate == 0) {
      return 0 + offset;
    } else if (rate == 1) {
      return 2 * (N + 1) + offset;
    } else {
      return 2 * Math.ceil(rate * N) + offset;
    }
  } else {
    return 2 * (N + 2) + offset;
  }
}

function progressModify(oldRate, newRate) {
  var oldRateIndex = progressIndex(oldRate);
  var newRateIndex = progressIndex(newRate);
  if (oldRateIndex != newRateIndex) {
    let wholeWidth = $("#nav-progress").width();
    let $nps = $("#nav-progress").children();

    $nps.eq(oldRateIndex * 2).css(
      "width",
      (parseFloat(
        $.trim(
          $nps
            .eq(oldRateIndex * 2)
            .css("width")
            .replace("px", "")
        )
      ) /
        wholeWidth) *
        100 -
        100 / wordArray.length +
        "%"
    );

    $nps.eq(newRateIndex * 2).css(
      "width",
      (parseFloat(
        $.trim(
          $nps
            .eq(newRateIndex * 2)
            .css("width")
            .replace("px", "")
        )
      ) /
        wholeWidth) *
        100 +
        100 / wordArray.length +
        "%"
    );
  }
}

$(function () {
  var relatedWords = [
    { en: "derivative", zh: "派" },
    { en: "antonym", zh: "反" },
    { en: "synonym", zh: "近" },
  ];

  function noteText(text = null, tagName = "tmpl-note") {
    let node = document.getElementById(tagName);
    switch (node.tagName) {
      case "DIV":
        if (text != null) {
          if (text.indexOf("\n") != -1) {
            node.innerHTML =
              text.replace(/\n/g, "</div><div>").replace("</div>", "") +
              "</div>";
          } else {
            node.innerText = text;
          }
        } else {
          return node.innerHTML
            .replace(/<(div|br|span).*?>/g, "\n")
            .replace(/<\/(div|br|span)>/g, "");
        }
        break;
      case "TEXTAREA":
        if (text != null) {
          $("#" + tagName).val(text);
        } else {
          return $("#" + tagName).val();
        }
        break;
      default:
        break;
    }
  }

  /**
   * 渲染拆解单词内容
   */
  function renderBreakContents(break_content, explain_content) {
    break_content = break_content.replace(/(^\s|\s$)/g, "");
    explain_content = explain_content.replace(/(^\s|\s$)/g, "");
    let word_break = document.createElement("div");
    word_break.setAttribute("class", "word-break");
    word_break.innerText = break_content;
    let word_explain = document.createElement("div");
    word_explain.setAttribute("class", "word-explain");
    word_explain.innerText = explain_content;

    let word_block = document.createElement("span");
    word_block.setAttribute("class", "word-block");
    word_block.appendChild(word_break);
    word_block.appendChild(word_explain);
    return word_block;
  }

  /**
   * 一行语句生成拆词
   * @param {String} mem 匹配字符串
   * @param {DOM} fatherNode 父节点
   * @param {RegExp} regBreakPattern
   * @param {function} regOnlyWordFunc
   * @param {function} regWordExplainFunc
   * @param {RegExp} regReplace
   * @param {function} finalFunc
   */
  function renderBreakFromOneLine(
    mem,
    fatherNode,
    regBreakPattern,
    regOnlyWordFunc,
    regWordExplainFunc,
    regReplace,
    finalFunc = function (m) {
      return m;
    }
  ) {
    if (regBreakPattern.test(mem)) {
      let word_block = document.createElement("div");
      word_block.setAttribute("class", "break-words");
      while (true) {
        if (regOnlyWordFunc(mem)) {
          if (regWordExplainFunc(mem)) {
            mem = mem.replace(RegExp.lastMatch, "");
            word_block.appendChild(renderBreakContents(RegExp.$1, RegExp.$2)); //顺序一换影响 RegExp 的值，必须最后
          } else {
            mem = mem.replace(RegExp.lastMatch, "");
            word_block.appendChild(renderBreakContents(RegExp.lastMatch, ""));
          }
          mem = mem.replace(regReplace, "");
        } else {
          break;
        }
      }
      fatherNode.appendChild(word_block);
      mem = finalFunc(mem);
    }
    return mem;
  }

  /**
   * 渲染拆解单词
   */
  function renderBreakWord(text) {
    let tmpl_break_word = document.getElementById("tmpl-break-word");
    tmpl_break_word.innerHTML = "";
    let notes = text.split("\n");
    let noteMnemonic = false;
    for (let i = 0; i < notes.length; i++) {
      let note_break = notes[i].split("=");

      // word sand
      if (
        note_break.length == 1 &&
        (note_break[0].indexOf("＋") != -1 || note_break[0].indexOf("+") != -1)
      ) {
        renderBreakFromOneLine(
          note_break[0],
          tmpl_break_word,
          /^[a-z]+/g,
          function (m) {
            return /^([a-z\s-]+)/g.test(m);
          },
          function (m) {
            return /^([a-z-,\s]+)\s*[（\()](.+?)[）\)]/g.test(m);
          },
          /^[\s(＋|+)]*/,
          function (mem) {
            mem = mem.replace(/^([\s+,]*)/g, "");
            tmpl_break_word.innerHTML +=
              '<p class="note-mnemonic-explain">' + mem + "</p>";
            return mem;
          }
        );
        continue;
      }

      if (word == notes[i]) {
        continue;
      }
      if (word.indexOf(note_break[0]) == -1) {
        if (noteMnemonic != false) {
          tmpl_break_word.appendChild(noteMnemonic);
        }
        noteMnemonic = false;
        tmpl_break_word.innerHTML +=
          '<p class="note-mnemonic-explain">' + notes[i] + "</p>";
        continue;
      }

      if (noteMnemonic == false) {
        noteMnemonic = document.createElement("div");
        noteMnemonic.setAttribute("class", "break-words");
      }
      noteMnemonic.appendChild(
        renderBreakContents(
          note_break[0],
          note_break.length == 1 ? "" : note_break[1]
        )
      );
    }
    if (noteMnemonic != false) {
      tmpl_break_word.appendChild(noteMnemonic);
    }
  }

  /**
   * 渲染单词 页面
   * @param {object} data 单词数据
   * @param {bool} copy 是否复制
   */
  function renderWord(data, copy = true) {
    data = data.fields;
    word = data.word;
    console.log(word);

    $("#tmpl-sentence").empty().css("max-width", "50%");
    $("#word-sand").empty().css("display", "none");

    if (!mode.input) {
      $("#tmpl-word")[0].innerHTML = '<a class="word-display">' + word + "</a>";
    } else {
      $("#tmpl-word")[0].innerHTML = '<a class="word-display"></a>';
    }

    $("#tmpl-phonetic").text(data.phonetic);
    $("#tmpl-index").text(
      (data.LIST != null
        ? "L" + data.LIST + " U" + data.UNIT + " I" + data.INDEX + " "
        : "") +
        "[" +
        wordIndex +
        "/" +
        wordArray.length +
        "]"
    );
    $("#tmpl-last-word")
      .text(wordCount + "| " + lastWord)
      .removeClass(remember ? "last-forget" : "last-remember")
      .addClass(remember ? "last-remember" : "last-forget");
    // console.log(data.panRate);
    if (0 != data.panTotalNum) {
      $("#progress-bar-word").css("width", (1 - data.panRate) * 100 + "%");
      $("#tmpl-total-num").addClass("d-none");
      $("#tmpl-progress").text(
        data.panTotalNum - data.panForgetNum + "/" + data.panTotalNum
      );
      if (data.panTotalNum == data.panForgetNum) {
        $("#tmpl-progress").css("padding-left", "5px");
      } else {
        $("#tmpl-progress").css("padding-left", "0");
      }
      $("#tmpl-total-num").text("");
    } else {
      $("#progress-bar-word").css("width", "0%");
      $("#tmpl-total-num").removeClass("d-none");
      $("#tmpl-progress").text("");
      $("#tmpl-total-num").text(data.panTotalNum);
    }

    // 助记法
    let tmpl_mnemonic = document.getElementById("tmpl-mnemonic");

    tmpl_mnemonic.innerHTML = "";
    data.mnemonic.split("\n").forEach(function (mem) {
      let type = mem.match(/【.+】/g);
      type = type == null ? "" : type;
      mem = mem.replace(type, "");
      mem = renderBreakFromOneLine(
        mem,
        tmpl_mnemonic,
        /^([a-z-\(\)\s]+)[^\.]/g,
        function (m) {
          return /^([a-z\s-]+|[a-z\s-]*\([a-z\s-]*\)[a-z\s-]*)/g.test(m);
        },
        function (m) {
          return /^([a-z-\(\),\s]+)\s\[(.+?)\]/g.test(m);
        },
        // function (m) { return m.replace(/^[\s+]*/, ''); }
        /^[\s+]*/
      );
      mem = mem.replace(/^([\s+,]*)/g, "");
      tmpl_mnemonic.innerHTML +=
        '<p class="mnemonic-explain">' + type + mem + "</p>";
    });

    note = data.note;

    // Note区词根词缀拆解
    renderBreakWord(note);

    // note
    $("#tmpl-note").addClass("d-n-note");
    noteText(note == "" ? word : note);
    // $('#tmpl-note')[0].innerText = ($('#tmpl-break-word').text() == '') ? word : note;

    // 中文释义处理
    let means = data.mean.split("\n");
    var mean_content = data.webster ? '<a style="color: red;">  𝓦</a>' : "";
    for (let i = 0; i < means.length; i++) {
      mean_content += "<p>" + means[i] + "</p>";
    }
    $.template("mean", mean_content);
    $("#tmpl-content").empty();
    $.tmpl("mean").appendTo($("#tmpl-content"));

    // 单词标签
    $(".icon-flags")
      .children()
      .each(function () {
        $(this)
          .removeClass("icon-enabled")
          .addClass("icon-disabled")
          .removeClass("icon-pan-enabled");
      });
    let $flag = null,
      flagType = "-";
    switch (data.flag) {
      case 10:
        $flag = $(".icon-ok");
        break;
      case 2:
        $flag = $(".icon-cloud");
        break;
      case 1:
        $flag = $(".icon-circle");
        break;
      case -1:
        $flag = $(".icon-star");
        break;
      case 0:
        flagType = "-pan-";
        switch (data.panFlag) {
          case 10:
            $flag = $(".icon-ok");
            break;
          case 2:
            $flag = $(".icon-cloud");
            break;
          case 1:
            $flag = $(".icon-circle");
            break;
          case -1:
            $flag = $(".icon-star");
            break;
          default:
            flagType = false;
            break;
        }
        break;
      default:
        flagType = false;
        break;
    }
    if (flagType != false) {
      $flag
        .removeClass("icon" + flagType + "disabled")
        .addClass("icon" + flagType + "enabled");
    }

    // 相关词
    relatedWords.forEach((rw) => {
      let relatedWordsContent = data[rw.en];
      let relatedWordArrayTemp = data[rw.en].match(/[a-zA-Z-]+/g);
      if (relatedWordArrayTemp != null) {
        let overlapWords = relatedWordArrayTemp.filter((w) => {
          return recentReviewedWordsArray.includes(w);
        });
        overlapWords.forEach((w) => {
          relatedWordsContent = relatedWordsContent.replace(
            w,
            "<span class='recent'>" + w + "</span>"
          );
        });
      }
      if (data[rw.en] != "") {
        $("#tmpl-" + rw.en).html("【" + rw.zh + "】" + relatedWordsContent);
      } else {
        $("#tmpl-" + rw.en).text("");
      }
    });

    if (copy) {
      copy2Clipboard(word, "clipboard");
      // readText(word);
    }

    if (wordCount == wordIndex + 50 && mode.repeat) {
      $(".repeat").click();
      layer.msg("错误次数太多，将关闭重现模式😅");
    }

    $("#review-progress").html(
      '<div style="width: ' +
        (wordIndex / wordArray.length) * 100 +
        '%; background-color: #bfc6ce;" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" class="progress-bar"></div>'
    );

    // echarts 画图
    let X = [0];
    let Y = [0];
    for (let i = 0; i < data.panHistory.length; i++) {
      let h = data.panHistory[i];
      X.push(i + 1);
      // if (i == 1) {
      //     Y[1] = h == '1' ? 1 : -1;
      //     continue;
      // }
      Y[i + 1] = Y[i] + (h == "1" ? 1 : -1);
    }
    let myChart = echarts.init(document.getElementById("echarts-left"));

    option = {
      title: {
        show: true,
        text: word,
        subtext: "复习历史",
        textStyle: {
          color: "#757575",
          fontWeight: "normal",
        },
        // textStyle: {
        //     color: "#333",
        // },
      },
      legend: {
        data: ["记忆曲线"],
      },
      toolbox: {
        show: false,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: true },
          magicType: { show: true, type: ["line", "bar"] },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      xAxis: {
        show: false,
        type: "category",
        boundaryGap: false,
        data: X,
      },
      yAxis: {
        // show: false,
        type: "value",
        // axisLine: {
        //     lineStyle: {
        //         color: '#1a85ff'
        //     }
        // }
      },
      series: [
        {
          data: Y,
          type: "line",
          // areaStyle: {}
          smooth: 0.2,
          color: "#1a85ff",
        },
      ],
    };
    myChart.setOption(option);
    $("#echarts-left").addClass("d-none");

    // 例句
    let sentence = data.sentence
      .replace("‖", "\n")
      .replace("||", "\n")
      .split("\n");
    if (sentence != "") {
      var sentence_content = "";
      for (let i = 0; i < sentence.length; i++) {
        let eng = sentence[i].match(/^[a-z \-,.?!'’“”…"0-9—]+/gi);
        let zh = sentence[i].match(
          /[\u4e00-\u9fa5【】：，。《》()“”、 0-9—]+$/g
        );
        if (eng == null || eng == "nan" || eng == []) {
          eng = "";
        } else {
          eng = eng[0];
        }
        if (zh == null || eng == []) {
          zh = "";
        } else {
          zh = zh[0];
        }
        for (let j = 0; j < 3; j++) {
          let word_tmp = word.slice(0, word.length - j);
          let eng_tmp = eng.match(
            RegExp(
              "[\\s]*?([" +
                word_tmp[0] +
                word_tmp[0].toUpperCase() +
                "]" +
                word_tmp.slice(1, word_tmp.length) +
                word_tmp[word_tmp.length - 1] +
                "*(ies|es|s|ied|ed|d|ing|ng|ous|al|))(?=[\\s,\\.])*",
              "g"
            )
          );
          if (eng_tmp != null) {
            // console.log(eng_tmp)
            eng_tmp = Array.from(new Set(eng_tmp));
            eng_tmp.forEach(function (mat) {
              eng = eng.replace(
                RegExp(mat, "g"),
                '</span><span style="color:red;">' + mat + "</span><span>"
              );
            });
            break;
          }
        }
        sentence_content +=
          '<p class="flex-column d-flex"><span><span>' +
          eng +
          '</span></span><a class="sentence-zh">' +
          zh +
          "</a></p>";
      }
      document.getElementById("tmpl-sentence").innerHTML = sentence_content;
    } else if (data.sentence == "") {
      $.ajax({
        url: "/review/spider/other_dict",
        type: "POST",
        data: {
          word: word,
          url: "http://dict.cn/mini.php",
        },
      }).done(function (response) {
        if (response.status === 200) {
          document.getElementById("tmpl-sentence").innerHTML += response.data;
        } else {
          layer.msg(response.msg);
        }
      });
    }

    // let twoColumn = false;
    document.getElementById("word-mnemonic").innerHTML = "";
    $.ajax({
      url: "/review/spider/other_dict",
      type: "POST",
      data: {
        word: word,
        url: "https://mnemonicdictionary.com/",
      },
    }).done(function (response) {
      if (response.status === 200) {
        document.getElementById("word-mnemonic").innerHTML = "";
        let mnemonic = response.data;
        // console.log(mnemonic);
        if (mnemonic.length != 0) {
          // twoColumn = true;
          mnemonic.forEach((m, i) => {
            // console.log(m.up)
            document.getElementById("word-mnemonic").innerHTML +=
              '<div class="mnemonic-card"><div>' +
              m.text +
              '</div><div class="mnemonic-card-footer"><i class="icon-thumbs-up"></i>' +
              m.up +
              '<i class="icon-thumbs-down"></i>' +
              m.down +
              "</div></div>";
          });
        }
      } else {
        layer.msg(response.msg);
      }
    });
  }

  // =============================================================
  //                          页面初始渲染
  // =============================================================
  try {
    $.ajax({
      url: "/review/get_word",
      type: "GET",
      data: {
        list: getQueryString("list"),
        book: getQueryString("book"),
        limit: getQueryString("limit"),
      },
    }).done(function (response) {
      if (response.status === 200) {
        if (response.data.length == 0) {
          layer.msg("词表空");
          return false;
        }
        wordArray = response.data;
        begin_index = response.begin_index;
        recentReviewedWordsArray = response.recent_words;
        // rawWordLength = wordArray.length;
        for (let i = 0; i < response.sort.length; i++) {
          $(".sort-array").each(function () {
            if ($(this).text() == response.sort[i]) {
              $(this).click();
            }
          });
        }
        if (mode.preview) {
          $("#meaning-box").click();
        }

        // 进度条处理
        var progressCount = {};
        for (let i = 0; i <= progressIndex(); i++) {
          progressCount[i] = 0;
        }
        wordArray.forEach((w) => {
          progressCount[progressIndex(w)] += 1;
        });
        // console.log(progressCount)
        var progressDiv = document.getElementById("nav-progress");
        for (let i = 0; i <= progressIndex(); i++) {
          progressDiv.innerHTML +=
            '<div style="width: ' +
            (progressCount[i] / wordArray.length) * 100 +
            "%; background-color: " +
            progressColors[i] +
            ';" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" class="progress-bar"></div>';
          let width = i % 2 == 0 ? 0 : 3;
          progressDiv.innerHTML +=
            '<div style="width: ' +
            width +
            'px; background-color: white;" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" class="progress-bar"></div>';
        }
        if (response.mode == "yesterday") {
          console.log(response.msg);
          layer.msg(response.msg);
          mode.yesterday = true;
        }
      } else {
        layer.msg(response.msg);
      }
    });
  } catch (error) {
    console.error(error);
  }

  $("#meaning-box").on("click", function (e) {
    readText(word);
    $(".hide").removeClass("d-none");
    if (mode.input) {
      if ($.trim($("#tmpl-word").text()) == word) {
        $("#tmpl-word")[0].innerHTML =
          '<a class="word-display">' + word + "✔️</a>";
      } else {
        $("#tmpl-word")[0].innerHTML =
          '<a class="word-display">' + word + "×</a>";
      }
    }
  });
  $("#active-note").on("click", function (e) {
    if ($("#tmpl-note").hasClass("d-n-note")) {
      // $('.hide').removeClass('d-n-note');
      $("#tmpl-note").removeClass("d-n-note");
      // $('#tmpl-note').select();
      document.getElementById("tmpl-note").focus();
    }
  });

  // 往前查看单词时候看到更新后的信息
  function hotUpdate(remember) {
    let w = wordArray[wordIndex].fields;
    let word_tmp = wordArray[wordIndex];
    if (noteText() != word) {
      w.note = noteText();
    }
    if (!remember) {
      // 这个词不记得
      w.panForgetNum++;
      if (word_tmp.repeat == null) {
        word_tmp.repeat = 1;
      } else {
        word_tmp.repeat++;
      }

      if ((mode.repeat && word_tmp.repeat < 3) || word_tmp.repeat == 1) {
        if (wordIndex != wordArray.length - 1) {
          wordArray.splice(wordIndex, 1);
          let index_tmp =
            Math.round(Math.random() * (wordArray.length - wordIndex)) +
            wordIndex;
          index_tmp += Math.min(wordArray.length - wordIndex - 1, 5); // 防止过快重现
          wordArray.splice(index_tmp, 0, word_tmp);
        }
        wordIndex--;
      } else if (word_tmp.repeat == 3) {
        layer.msg("😡错不过三");
      }
    }
    w.panHistory += remember ? "1" : "0";
    w.panTotalNum++;
    var oldRate = w.panRate;
    w.panRate = w.panForgetNum / w.panTotalNum;
    progressModify(oldRate, w.panRate);

    // echarts 画图
    currentHistoryX.push(word);
    if (wordCount == 1) {
      currentHistoryY[1] = remember ? 1 : -1;
    } else {
      currentHistoryY.push(
        currentHistoryY[wordCount - 1] + (remember ? 1 : -1)
      );
    }
    let myChart = echarts.init(document.getElementById("echarts-bottom"));

    option = {
      title: {
        show: true,
        text: "本轮复习记忆历史",
        textStyle: {
          color: "#757575",
          fontWeight: "normal",
          fontSize: "14px",
        },
      },
      legend: {
        data: ["记忆曲线"],
      },
      toolbox: {
        show: false,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: true },
          magicType: { show: true, type: ["line", "bar"] },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      xAxis: {
        // show: false,
        type: "category",
        // boundaryGap: false,
        data: currentHistoryX.slice(
          Math.max(0, currentHistoryX.length - 10),
          currentHistoryX.length
        ),
        axisLine: {
          lineStyle: {
            color: "#757575",
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
          left: "10%",
          bottom: "40%",
        },
      },
      yAxis: {
        show: false,
        type: "value",
      },
      series: [
        {
          data: currentHistoryY.slice(
            Math.max(0, currentHistoryY.length - 10),
            currentHistoryY.length
          ),
          type: "line",
          smooth: 0.2,
          color: "#bec980",
        },
      ],
    };
    myChart.setOption(option);
  }

  // 复习完成后更新后端数据库
  function review_finish_post() {
    $.ajax({
      url: "/review/review_list_finish",
      type: "POST",
      data: {
        list: getQueryString("list"),
        book: getQueryString("book"),
        yesterday_mode: mode.yesterday,
      },
    }).done(function (response) {
      if (response.status === 200) {
        readText("Mission completed!");
      } else {
        layer.msg(response.msg);
      }
    });
  }

  // 复习完一个单词
  $(".jump-btn").on("click", function (e) {
    e.preventDefault();
    // console.log('lll')
    let word_tmp = wordArray[wordIndex];
    let last_forget_num = 0;
    if (word_tmp.repeat != null) {
      last_forget_num = word_tmp.repeat;
    }

    if ($(this).text() == "我记得") {
      remember = true;
    } else if ($(this).text() == "不认识") {
      remember = false;
      last_forget_num++;
    }
    let note_now = noteText();
    $.ajax({
      url: "/review/review_a_word",
      type: "POST",
      data: {
        remember: remember,
        word: word,
        list: wordArray[wordIndex].fields.LIST,
        book: getQueryString("book"),
        note: note == note_now || note_now == word ? false : $.trim(note_now),
        last_forget_num: last_forget_num,
        repeat: word_tmp.repeat != null ? true : false,
        yesterday_mode: mode.yesterday,
      },
    }).done(function (response) {
      if (response.status === 200) {
        lastWord = word;
        wordCount++;
        hotUpdate(remember);
        if (wordIndex != wordArray.length - 1) {
          wordIndex++;
          $(".hide").addClass("d-none");
          renderWord(wordArray[wordIndex]);
        } else {
          review_finish_post();
          readText(
            "finished list" + (parseInt(getQueryString("list")) + begin_index)
          );
          layer.msg("背完了(●´∀｀●)ﾉ");
          renderWord(wordArray[wordIndex], false);
        }
      } else {
        layer.msg(response.msg);
      }
    });
  });

  // 直接跳转
  $(".btn-jump").on("click", function (e) {
    let display = false;
    if ($(this).text() == "«") {
      if (wordIndex > 0) {
        layer.msg("跳转到上一个单词");
        wordIndex--;
        display = true;
      } else {
        layer.msg("这是第一个单词");
      }
    } else if ($(this).text() == "»") {
      if (wordIndex < wordArray.length - 1) {
        wordIndex++;
        if (!mode.preview) {
          layer.msg("跳转到下一个单词");
        }
      } else {
        layer.msg("这是最后一个单词");
        if (!mode.preview) {
          review_finish_post();
        }
        display = true;
      }
    }
    renderWord(wordArray[wordIndex]);
    if (display) {
      $(".hide").removeClass("d-none");
    } else {
      $(".hide").addClass("d-none");
    }
  });
  // 特定页跳转
  $("#btn-quick-jump").on("click", function (e) {
    let i = parseInt($("#jump-index").val());
    if (i <= wordArray.length && i > 0) {
      layer.msg("跳转到第" + i + "个单词");
      wordIndex = i - 1;
    } else if (i <= 0) {
      wordIndex = 0;
    } else {
      wordIndex = wordArray.length - 1;
    }
    renderWord(wordArray[wordIndex]);
    $("#jump-index").val("");
  });
  $("#jump-index").keyup(function (e) {
    if (13 == e.keyCode) {
      $("#btn-quick-jump").click();
    }
  });

  // 列表重排序
  $(".sort-array").on("click", function (e) {
    let text = $(this).text();
    if (text != sortMode) {
      wordArray = wordArray.slice(wordIndex);
      switch (text) {
        case "顺序":
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
          });
          break;
        case "乱序":
          wordArray.sort(function (a, b) {
            return Math.random() > 0.5 ? -1 : 1;
          });
          break;
        case "记忆序":
          wordArray.sort(compareField("panRate", -1));
          break;
        case "次数序":
          wordArray.sort(compareField("panTotalNum", 1));
          break;
        default:
          console.error("未知" + text);
      }
      $(".sort-array").removeClass("enabled");
      $(this).addClass("enabled");
      $(".hide").addClass("d-none");
      sortMode = text;
      console.log(text);
      wordIndex = 0;
      renderWord(wordArray[wordIndex]);
    } else {
      layer.msg("已是" + text);
    }
  });
  // 重现模式
  $(".repeat").on("click", function () {
    if ($(this).text() == "重现模式:关") {
      mode.repeat = true;
      $(this).text("重现模式:开").addClass("enabled");
      layer.msg("重现模式已开");
    } else if ($(this).text() == "重现模式:开") {
      mode.repeat = false;
      $(this).text("重现模式:关").removeClass("enabled");
      layer.msg("重现模式已关");
    } else {
      layer.msg("未知选择：" + $(this).text());
    }
  });

  // note 区焦点
  $("#tmpl-note").focus(function () {
    noteFocus = true;
  });
  $("#tmpl-note").blur(function () {
    noteFocus = false;
    let note_now = noteText();
    console.log(note_now);
    // let note_pre = note;
    // note = noteText();
    renderBreakWord(note_now);
    if (note_now != note) {
      $.ajax({
        url: "/review/update_note",
        type: "POST",
        data: {
          word: word,
          note: note_now == word ? "" : note_now,
        },
      }).done(function (response) {
        if (response.status === 200) {
          wordArray[wordIndex].fields.note = note_now;
        } else {
          layer.msg(response.msg);
        }
      });
    }
    $(this).addClass("d-n-note");
  });

  // 更新单词的 flag：太简单、重难词
  $(".icon-flags").on("click", function () {
    let $icon = $(this).children();
    let flag = 0;
    var oldWordInfo = JSON.parse(JSON.stringify(wordArray[wordIndex]));
    if ($icon.hasClass("icon-star")) {
      if ($icon.hasClass("icon-disabled")) {
        flag = -1;
        layer.msg("⭐️将" + word + "设为重难词");
      } else if ($icon.hasClass("icon-enabled")) {
        flag = 0;
        layer.msg("❌取消设置" + word + "为重难词");
      } else {
        console.error("unknown class");
        console.error($icon);
      }
    } else if ($icon.hasClass("icon-ok")) {
      if ($icon.hasClass("icon-disabled")) {
        flag = 10;
        layer.msg("✅将" + word + "设为太简单");
      } else if ($icon.hasClass("icon-enabled")) {
        flag = 0;
        layer.msg("❌取消设置" + word + "为太简单");
      } else {
        console.error("unknown class");
        console.error($icon);
      }
    } else if ($icon.hasClass("icon-circle")) {
      if ($icon.hasClass("icon-disabled")) {
        flag = 1;
        layer.msg("🟢将" + word + "设为已掌握");
      } else if ($icon.hasClass("icon-enabled")) {
        flag = 0;
        layer.msg("❌取消设置" + word + "为已掌握");
      } else {
        console.error("unknown class");
        console.error($icon);
      }
    } else if ($icon.hasClass("icon-cloud")) {
      if ($icon.hasClass("icon-disabled")) {
        flag = 2;
        layer.msg("☁️将" + word + "设为很熟悉");
      } else if ($icon.hasClass("icon-enabled")) {
        flag = 0;
        layer.msg("❌取消设置" + word + "为很熟悉");
      } else {
        console.error("unknown class");
        console.error($icon);
      }
    } else {
      console.error("unknown class");
      console.error($icon);
    }
    $.ajax({
      url: "/review/update_word_flag",
      type: "POST",
      data: {
        list: wordArray[wordIndex].fields.LIST,
        book: wordArray[wordIndex].fields.BOOK,
        word: word,
        flag: flag,
        last_flag: wordArray[wordIndex].fields.flag,
        yesterday_mode: mode.yesterday,
      },
    }).done(function (response) {
      if (response.status === 200) {
        if (flag != 0) {
          $(".icon-flags")
            .children()
            .each(function () {
              $(this).removeClass("icon-enabled").addClass("icon-disabled");
            });
          $icon.removeClass("icon-disabled").addClass("icon-enabled");
        } else {
          $icon.removeClass("icon-enabled").addClass("icon-disabled");
        }
        wordArray[wordIndex].fields.flag = flag;
        wordArray[wordIndex].fields.panFlag = flag;
        progressModify(oldWordInfo, wordArray[wordIndex]);
      } else {
        layer.msg(response.msg);
      }
    });
  });

  // 快捷键
  $(document).keyup(function (e) {
    // console.log(noteFocus)
    // console.log(e.keyCode);
    // console.log(e.ctrlKey, e.altKey);
    if (!noteFocus) {
      if (37 == e.keyCode && e.shiftKey) {
        // shift + left arrow
        if (mode.preview) {
          layer.msg("当前处于预习模式，不是复习");
        } else if ($("#tmpl-content").hasClass("d-none")) {
          console.log("急啥呢");
        } else {
          $("#btn-forget").click();
        }
      } else if (39 == e.keyCode && e.shiftKey) {
        // shift + right arrow
        if (mode.preview) {
          layer.msg("当前处于预习模式，不是复习");
        } else if ($("#tmpl-content").hasClass("d-none")) {
          console.log("急啥呢");
        } else {
          $("#btn-remember").click();
        }
      } else if (188 == e.keyCode && (!e.shiftKey || !mode.preview)) {
        // <
        $("#jump-back").click();
        if (mode.preview) {
          $("#meaning-box").click();
        }
      } else if (190 == e.keyCode && (!e.shiftKey || !mode.preview)) {
        // >
        $("#jump-forward").click();
        if (mode.preview) {
          $("#meaning-box").click();
        }
      } else if ((78 == e.keyCode || 13 == e.keyCode) && !e.shiftKey) {
        // N or enter
        $(".hide").removeClass("d-n-note");
        // $('#tmpl-note').removeClass('d-n-note');
        let noteNode = document.getElementById("tmpl-note");
        // let range = document.createRange();
        // let len = noteNode.childNodes.length;
        // range.setStart(noteNode, len);
        // range.setEnd(noteNode, len);
        // getSelection().addRange(range);
        noteNode.focus();
        // noteNode.selection.setRangeAtEndOf(len);
        // range.moveToElementText(noteNode);
        // range.select();
        // $('#tmpl-note').select();
      } else if (32 == e.keyCode || 191 == e.keyCode /*|| 13 == e.keyCode*/) {
        // blank or /
        $("#meaning-box").click();
      }

      if (mode.preview) {
        if (188 == e.keyCode && e.shiftKey) {
          // shift + <
          wordIndex = Math.floor((wordIndex - 1) / 10) * 10;
          renderWord(wordArray[wordIndex]);
          $("#meaning-box").click();
        } else if (190 == e.keyCode && e.shiftKey) {
          // shift + >
          wordIndex = Math.ceil((wordIndex + 1) / 10) * 10;
          renderWord(wordArray[wordIndex]);
          $("#meaning-box").click();
        }
      }
    }
  });
});

hotkeys("C, N, S, P, I, T, V, M, R", function (event, handler) {
  if (!noteFocus) {
    switch (handler.key) {
      case "C":
        if (/<font.*?>([\s\S]*?)<[hb]r>/.test($("#word-sand")[0].innerHTML)) {
          copy2Clipboard(RegExp.$1, "clipboard");
          $(".hide").removeClass("d-n-note");
          document.getElementById("tmpl-note").focus();
        }
        break;
      case "P":
        if (!mode.preview) {
          mode.preview = true;
          layer.msg("学习/预习模式");
        } else {
          mode.preview = false;
          layer.msg("恢复到复习模式");
        }
        break;
      case "I":
        if (!mode.input) {
          layer.msg("听写模式：开");
          // console.log("input mode: on");
          mode.input = true;
          $("#tmpl-word")[0].contentEditable = true;
          $("#tmpl-content").removeClass("hide").removeClass("d-none");
        } else {
          layer.msg("听写模式：关");
          // console.log("input mode: off");
          mode.input = false;
          $("#tmpl-word")[0].contentEditable = false;
          $("#tmpl-content").addClass("hide");
        }
        break;
      case "R":
        $(".repeat").click();
        break;

      case "S":
        window.open("https://www.thesaurus.com/browse/" + word + "?s=t");
        break;
      case "M":
        window.open("https://mnemonicdictionary.com/?word=" + word);
        break;
      case "T":
      case "V":
        window.open("http://www.wordsand.cn/lookup.asp?word=" + word);
        break;
    }
  }
});

hotkeys("shift+E, shift+H, shift+G, shift+F", function (event, handler) {
  if (!noteFocus) {
    switch (handler.key) {
      case "shift+E":
        $(".icon-ok").click();
        break;
      case "shift+H":
        $(".icon-star").click();
        break;
      case "shift+G":
        $(".icon-circle").click();
        break;
      case "shift+F":
        $(".icon-cloud").click();
        break;
    }
  }
});

window.onbeforeunload = function (event) {
  if (wordCount == 0 || wordIndex == wordArray.length - 1 || mode.preview) {
    console.log("拜拜");
  } else if (wordIndex != wordArray.length - 1) {
    return "本轮背单词进度将会丢失😣";
  }
};
