chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ color: '#3aa757' }, function () {
        console.log("The color is green.");
    });
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { urlContains: 'wjx.cn' },
                })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

var content = ''
chrome.extension.onMessage.addListener(function (request, sender, sendMessage) {
    if (request.action == "wordsand") {

        const req = new XMLHttpRequest();
        const baseUrl = "http://www.wordsand.cn/lookup.asp?word=" + request.word;
        // const baseUrl = "http://www.wordsand.cn/lookup.asp";
        // const urlParams = `data=abandon`;

        req.open("POST", baseUrl, true);
        // req.send(urlParams);
        req.send();

        req.onreadystatechange = function () { // Call a function when the state changes.
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                // console.log((this))
                content = this.response
                sendMessage({
                    status: 'done',
                    content: this.response,
                });
                // chrome.storage.sync.set({ wordsand: this.response }, function () {
                //     console.log("set storage");
                // });
            }
        }
        return true; // asynchronously return message: https://developer.chrome.com/extensions/messaging
    }
});

console.log(new Date());

