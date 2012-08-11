// ==UserScript==
// @name       ThunderLixianExporter
// @namespace  http://dynamic.cloud.vip.xunlei.com/
// @version    0.3
// @description  export thunder lixian url to aria2/wget
// @match      http://dynamic.cloud.vip.xunlei.com/user_task?*
// @run-at document-end
// @copyright  2012+, Binux <root@binux.me>
// ==/UserScript==

var script = document.createElement('script');
script.src = "https://raw.github.com/binux/ThunderLixianExporter/master/ThunderLixianExporter.js";
script.id = "TLE_script";
document.body.appendChild(script);
