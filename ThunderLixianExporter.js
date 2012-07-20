// vim: set et sw=2 ts=2 sts=2 ff=unix fenc=utf8:
// Author: Binux<root@binux.me>
//         http://binux.me
// Created on Fri 20 Jul 2012 11:43:22 AM CST

var TLE = TLE || {};

(function(TLE) {
  TLE.down = function(_this, _do) {
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
        var todown = {};
        todown.gdriveid = getCookie("gdriveid");
        todown.tasklist = {};
        todown.tasklist[info.input] = {
          'taskname': info.taskname,
          'f_url': info.f_url,
          'cid': info.dcid,
          'size': parseInt(info.ysfilesize),
          'tasktype': info.d_tasktype,
          'status': info.d_status,
        };
        var filelist = [];
        $.each(data['Result'][info.input], function(n, e) {
          filelist.push({
            'title': e.title,
            'f_url': e.url,
            'downurl': e.downurl,
            'cid': e.cid,
            'gcid': e.gcid,
            'size': parseInt(e.filesize),
          });
        });
        todown.tasklist[info.input]['filelist'] = filelist;
        _do(todown);
      });
    } else {
      var todown = {}
      todown.gdriveid = getCookie("gdriveid");
      todown.tasklist = {};
      todown.tasklist[info.input] = {
        'taskname': info.taskname,
        'f_url': info.f_url,
        'cid': info.dcid,
        'size': parseInt(info.ysfilesize),
        'tasktype': info.d_tasktype,
        'status': info.d_status,
      };
      var filelist = [];
      filelist.push({
        'title': info.taskname,
        'f_url': info.f_url,
        'downurl': info.dl_url,
        'cid': info.dcid,
        'gcid': "",
        'size': parseInt(info.ysfilesize),
      });
      todown.tasklist[info.input]['filelist'] = filelist;
      _do(todown);
    };
  };

  TLE.batch_down = function() {
    //getCookie("gdriveid");
    //http://dynamic.cloud.vip.xunlei.com/interface/fill_bt_list?callback=batch_down_all&tid=119413404161,119413083905&g_net=1&uid=206665670
    //var req = INTERFACE_URL+"/fill_bt_list?callback=batch_down_all&tid="+bt_taskid+"&g_net="+G_section+"&uid="+G_USERID;
  };

  TLE.bt_down = function() {
  };


  TLE.getbtn = function(_this) {
    $(_this).parents(".TLE_get_btnbox").find(".TLE_p_getbtn").toggle();
    close_rightmenu_layer();
    return false;
  };

  TLE.text_pop = function(title, content) {
    $("#TLE_text_pop").tpl("TLE_text_tpl", {'title': title, 'content': content}).show().pop({
      onHide: function() { $(document.body).click(); },
    });
  };

  TLE.multiple_server_fix = function(url) {
    return "'"+url.replace("gdl", "'{gdl,dl.{f,g,h,i,twin}}'")+"'";
  }

  var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  TLE.escape_command = function(str) {
    var result = "";
    for (var i = 0; i < str.length; i++) {
      if (alpha.indexOf(str[i]) == -1)
        result += "\\"+str[i];
      else
        result += str[i];
    }
    return result;
  };


  function init() {
    $("head").append('<link type="text/css" rel="stylesheet" href="https://raw.github.com/binux/ThunderLixianExporter/master/ThunderLixianExporter.css"/>');
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
                    + '<a href="#" class="TLE_link_getic TLE-down-btn" onclick="return TLE.getbtn(this);"></a>'
                  + '</span>'
                  + '<div class="TLE_p_getbtn" style="display: none;">'
                    + '<a href="#" title="aria2" onmouseover="this.className=\'sel_on\'" onmouseout="this.className=\'\'" onclick="TLE.down(this, TLE.aria2)">Aria2</a>'
                    + '<a href="#" title="wget" onmouseover="this.className=\'sel_on\'" onmouseout="this.className=\'\'" onclick="TLE.down(this, TLE.wget)">wget</a>'
                  + '</div>'
                + '</div>');
    });

    $(document.body).bind("click",function(){$("div.TLE_p_getbtn").hide();});
    $("div.rw_list").click(function(e){$(".TLE_p_getbtn").hide()});
    $("div.TLE_get_btnbox").click(function(e){e.stopPropagation();});
  };
  init();
})(TLE);

TLE.aria2 = function(todown) {
  console.log(todown);
  var str = "";
  $.each(todown.tasklist, function(n, task) {
    $.each(task.filelist, function(l, file) {
      str += "aria2c -c -s10 -x10 --out "+TLE.escape_command(file.title)+" --header 'Cookie: gdriveid="+todown.gdriveid+";' '"+file.downurl+"'\n"; 
    });
  });
  TLE.text_pop("aria2 download command", str);
};

TLE.wget = function(todown) {
  console.log(todown);
  var str = "";
  $.each(todown.tasklist, function(n, task) {
    $.each(task.filelist, function(l, file) {
      str += "wget -c -O "+TLE.escape_command(file.title)+" --header 'Cookie: gdriveid="+todown.gdriveid+";' '"+file.downurl+"'\n";
    });
  });
  TLE.text_pop("wget download command", str);
};
