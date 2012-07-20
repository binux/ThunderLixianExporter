// vim: set et sw=2 ts=2 sts=2 ff=unix fenc=utf8:
// Author: Binux<huangkuan@duokan.com>
//         http://binux.me
// Created on Fri 20 Jul 2012 11:43:22 AM CST

function TLE_down(_this, _do) {
  a=_this;
  b=_do;
  var p = $(_this).parents(".rw_list");
  var taskid = p.attr("taskid");
  var info = {};
  p.find("input").each(function(n, e) {
    var key = e.getAttribute("id").replace(taskid, "");
    info[key] = e.getAttribute("value");
  });

  if (info.d_tasktype == "0") { //bt task
    show_tip("载入中...");
    $.getJSON(INTERFACE_URL+"/fill_bt_list?tid="+info.input+"&g_net="+G_section+"&uid="+G_USERID+"&callback=?", function(data) {
      hide_tip();
      console.log(data);
      console.log(info);
      TLE_text_pop(_do, JSON.stringify(data));
    });
  } else {
    TLE_text_pop(_do, JSON.stringify(info));
    console.log(info);
  };
};

function TLE_batch_down() {
  //getCookie("gdriveid");
  //http://dynamic.cloud.vip.xunlei.com/interface/fill_bt_list?callback=batch_down_all&tid=119413404161,119413083905&g_net=1&uid=206665670
  //var req = INTERFACE_URL+"/fill_bt_list?callback=batch_down_all&tid="+bt_taskid+"&g_net="+G_section+"&uid="+G_USERID;
};

function TLE_bt_down() {
};

function TLE_text_pop(title, content) {
  $("#TLE_text_pop").tpl("TLE_text_tpl", {'title': title, 'content': content}).show().pop({
    onHide: function() { $(document.body).click(); },
  });
};

function TLE_getbtn(_this) {
  $(_this).parents(".TLE_get_btnbox").find(".TLE_p_getbtn").toggle();
  close_rightmenu_layer();
  return false;
};

(function(TLE) {
  $("head").append('<link type="text/css" rel="stylesheet" href="http://127.0.0.1:8000/ThunderLixianExporter.css"/>');
  $("body").append('<div id="TLE_text_pop" class="pop_rwbox" style="display: none;margin: 0;"></div>');
  $("body").append('<textarea id="TLE_text_tpl" style="display: none;"></textarea>');
  $("#TLE_text_tpl").text('<div class="p_rw_pop">'
                          +'<div class="tt_box onlytitle">'
                            +'<h3>$[title]</h3>'
                          +'</div>'
                          +'<div class="psc_info">'
                            +'<textarea style="width: 100%; height: 260px;">$[content]</textarea>'
                          +'</div>'
                          +'<a href="#" class="close" title="关闭">关闭</a>'
                        +'</div>');
  $(".rwbtn.ic_redownloca").each(function(n, e) {
    $(e).after('<div class="TLE_get_btnbox">'
                + '<span class="TLE_getlink">'
                  + '<a href="#" class="TLE_link_gettxt TLE-down-text" style="padding-left: 20px; width: 57px;" onclick='+e.getAttribute("onclick")+'>取回本地</a>'
                  + '<a href="#" class="TLE_link_getic TLE-down-btn" onclick="return TLE_getbtn(this);"></a>'
                + '</span>'
                + '<div class="TLE_p_getbtn" style="display: none;">'
                  + '<a href="#" title="aria2" onmouseover="this.className=\'sel_on\'" onmouseout="this.className=\'\'" onclick="TLE_down(this, \'aria2\')">Aria2</a>'
                  + '<a href="#" title="wget" onmouseover="this.className=\'sel_on\'" onmouseout="this.className=\'\'" onclick="TLE_down(this, \'wget\')">wget</a>'
                + '</div>'
              + '</div>');
  });

  $(document.body).bind("click",function(){$("div.TLE_p_getbtn").hide();});
  $("div.rw_list").click(function(e){$(".TLE_p_getbtn").hide()});
  $("div.TLE_get_btnbox").click(function(e){e.stopPropagation();});
})();
