// ==UserScript==
// @name       ThunderLixianExporter
// @namespace  http://dynamic.cloud.vip.xunlei.com/
// @version    0.35
// @description  export thunder lixian url to aria2/wget
// @match      http://dynamic.cloud.vip.xunlei.com/user_task?*
// @match      http://61.147.76.6/iplay.html?*
// @match      http://222.141.53.5/iplay.html?*
// @run-at document-end
// @copyright  2012+, Binux <root@binux.me>
// ==/UserScript==

var script = document.createElement('script');
script.id = "TLE_script";
if (location.host == "dynamic.cloud.vip.xunlei.com") {
  script.src = "https://raw.github.com/binux/ThunderLixianExporter/master/ThunderLixianExporter.js";
} else {
  script.src = "https://raw.github.com/binux/ThunderLixianExporter/master/vod_html5.js";
}
document.body.appendChild(script);
