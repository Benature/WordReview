$(function () {

    wordArray = [{
        model: "review.review",
        pk: 27,
        fields: {
            word: "abandon",
            total_num: 4,
            forget_num: 0,
            rate: 0,
            LIST: 0,
            UNIT: 0,
            INDEX: 0,
            BOOK: "GRE3000",
            history: "1111",
            flag: 0,
            mean: " v.  (不顾责任、义务等)离弃，遗弃，抛弃;(不得已而)舍弃，丢弃，离开;停止(支持或帮助);放弃(信念).  放任;放纵  ",
            note: "",
            sentence: "added spices to the stew with complete abandon 肆无忌惮地向炖菜里面加调料\nabandon oneself to emotion 感情用事，abandon herself to a life of complete idleness 放纵自己过着闲散的生活\nabandon the ship/homes	弃船，离家↵the bad weather forced NASA to abandon the launch 坏天气迫使 NASA 停止了发射",
            webster: false,
            mnemonic: "【根】a- [ad-, to] + ban [v.&n. 禁令] + -don [v.&n.], to ban, 禁令下达后的结果 → v. 放弃；停止做某事；放弃 (理智、责任) → v.&n. 放纵",
            phonetic: "[ə'bændən]",
            panTotalNum: 4,
            panForgetNum: 0,
            panRate: 0,
            panHistory: "1111",
            panFlag: 0,
        }
    },
    {
        model: "review.review",
        pk: 28,
        fields: {
            word: "abase",
            total_num: 4,
            forget_num: 2,
            rate: 0.25,
            LIST: 0,
            UNIT: 0,
            INDEX: 1,
            BOOK: "GRE3000",
            history: "0101",
            flag: 0,
            mean: " v.  表现卑微;卑躬屈节;屈从  ",
            note: "",
            sentence: "was unwilling to abase himself by pleading guilty to a crime that he did not commit 不愿意屈就自己去承认一个莫须有的罪名",
            webster: false,
            mnemonic: "【根】a- [ad-, to] + base [底部], to base, 向底部 (降) → v. 降低 (地位、职位、威望或尊严)",
            phonetic: "[ə'beɪs]",
            panTotalNum: 10,
            panForgetNum: 2,
            panRate: 0.2,
            panHistory: "0101111111",
            panFlag: 0,
        }
    },
    {
        model: "review.review",
        pk: 88,
        fields: {
            word: "adventitious",
            total_num: 5,
            forget_num: 5,
            rate: 1,
            LIST: 0,
            UNIT: 6,
            INDEX: 1,
            BOOK: "GRE3000",
            history: "00000",
            flag: 0,
            mean: "外来的，后天的，非内在的：not inherent or innate",
            note: "",
            sentence: "Moral considerations are adventitious to the study of art.	道德的考量对于艺术研究来说是不必要的。",
            webster: false,
            mnemonic: "【根】ad- [to] + vent [come] + it + -ious [a.], “come” (instead of being innate) → a. 外来的，后天的，非内在的",
            phonetic: "[ˌædven'tɪʃəs]",
            panTotalNum: 8,
            panForgetNum: 7,
            panRate: 0.875,
            panHistory: "00000001",
            panFlag: 0
        }
    },
    ];
    begin_index = 0;
    rawWordLength = wordArray.length;
    let i = 0;
    $('.sort-array').each(function () {
        if (i == 0) {
            $(this).click();
            i++;
        }
    })
    console.log(wordArray[wordIndex])

    // 复习完一个单词
    $('.jump-btn-fake').on('click', function (e) {
        e.preventDefault();
        $('#jump-forward').click();
        layer.msg('你点了' + $(this).text())
    })

})
