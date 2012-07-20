// ==UserScript==
// @name       ThunderLixianExporter
// @namespace  http://binux.me/
// @version    0.1
// @description  export thunder lixian url to aria2/wget
// @match      http://dynamic.cloud.vip.xunlei.com/user_task?*
// @run-at document-end
// @copyright  2012+, You
// ==/UserScript==

var script = document.createElement('script');
script.src = "https://raw.github.com/binux/ThunderLixianExporter/master/ThunderLixianExporter.js"
document.body.appendChild(script);
