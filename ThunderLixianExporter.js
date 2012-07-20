// vim: set et sw=2 ts=2 sts=2 ff=unix fenc=utf8:
// Author: Binux<root@binux.me>
//         http://binux.me
// Created on Fri 20 Jul 2012 11:43:22 AM CST

var TLE = TLE || {};

(function(TLE) {
  function get_taskinfo(p) {
    var taskid = p.attr("taskid");
    var info = {};
    p.find("input").each(function(n, e) {
      var key = e.getAttribute("id").replace(taskid, "");
      info[key] = e.getAttribute("value");
    });
    return info;
  };

  function build_normal_taskinfo(info) {
    var taskinfo = {
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
    taskinfo['filelist'] = filelist;

    return taskinfo;
  };
  function build_bt_taskinfo(info, rdata) {
    var taskinfo = {
      'taskname': info.taskname,
      'f_url': info.f_url,
      'cid': info.dcid,
      'size': parseInt(info.ysfilesize),
      'tasktype': info.d_tasktype,
      'status': info.d_status,
    };
    var filelist = [];
    $.each(rdata, function(n, e) {
      filelist.push({
        'title': e.title,
        'f_url': e.url,
        'downurl': e.downurl,
        'cid': e.cid,
        'gcid': e.gcid,
        'size': parseInt(e.filesize),
      });
    });
    taskinfo['filelist'] = filelist;
    return taskinfo;
  };

  TLE.down = function(_this, _do) {
    var p = $(_this).parents(".rw_list");
    var info = get_taskinfo(p);

    if (info.d_tasktype == "0") { //bt task
      show_tip("载入中...");
      $.getJSON(INTERFACE_URL+"/fill_bt_list?tid="+info.input+"&g_net="+G_section+"&uid="+G_USERID+"&callback=?", function(data) {
        hide_tip();
        var todown = {};
        todown.gdriveid = getCookie("gdriveid");
        todown.tasklist = {};
        todown.tasklist[info.input] = build_bt_taskinfo(info, data['Result'][info.input]);
        _do(todown);
      });
    } else {
      var todown = {}
      todown.gdriveid = getCookie("gdriveid");
      todown.tasklist = {};
      todown.tasklist[info.input] = build_normal_taskinfo(info);
      _do(todown);
    };
  };

  TLE.batch_down = function(_do) {
    var ck = document.getElementsByName("ck");
    var bt_task_list = [];
    var normal_task_list = [];
    $.each(ck, function(n, e) {
      if (e.checked == false) return;

      var taskid = e.value;
      var d_status = $("#d_status"+taskid).val();
      var d_tasktype = $("#d_tasktype"+taskid).val();
      var d_flag = $("#dflag"+taskid).val();
      if (d_flag != 4 && d_status == 2) {
        if (d_tasktype == 0) {
          bt_task_list.push(taskid);
        } else {
          normal_task_list.push(taskid);
        };
      };
    });

    if (bt_task_list.length) {
      show_tip("载入中...");
      $.getJSON(INTERFACE_URL+"/fill_bt_list?tid="+bt_task_list.join(",")+"&g_net="+G_section+"&uid="+G_USERID+"&callback=?", function(data) {
        hide_tip();
        var todown = {};
        todown.gdriveid = getCookie("gdriveid");
        todown.tasklist = {};
        $.each(data['Result'], function(n, e) {
          var info = get_taskinfo($("#tr_c"+n));
          todown.tasklist[n] = build_bt_taskinfo(info, e);
        });
        $.each(normal_task_list, function(n, e) {
          var info = get_taskinfo($("#tr_c"+e));
          todown.tasklist[e] = build_normal_taskinfo(info);
        });
        _do(todown);
      });
    } else {
      var todown = {};
      todown.gdriveid = getCookie("gdriveid");
      todown.tasklist = {};
      $.each(normal_task_list, function(n, e) {
        var info = get_taskinfo($("#tr_c"+e));
        todown.tasklist[e] = build_normal_taskinfo(info);
      });
      _do(todown);
    };
  };

  TLE.bt_down = function(_do) {
    var ck = document.getElementsByName("bt_list_ck");
    var files = [];
    $.each(ck, function(n, e) {
      if (e.checked == false) return;
      var fid = e.getAttribute("_i");
      var file = {
        'title': $("#bt_taskname"+fid).val(),
        'url': $("#bturl"+fid).val(),
        'downurl': $("#btdownurl"+fid).val(),
        'cid': $("#btcid"+fid).val(),
        'gcid': $("#btgcid"+fid).val(),
        'filesize': $("#bt_filesize"+fid).val(),
      };
      files.push(file);
    });
    var taskid = $("#view_bt_taskid").val();
    var info = get_taskinfo($("#tr_c"+taskid));

    var todown = {};
    todown.gdriveid = getCookie("gdriveid");
    todown.tasklist = {};
    todown.tasklist[taskid] = build_bt_taskinfo(info, files);
    console.log(todown);

    _do(todown);

    console.log("bt_down");
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
                    + '<a href="#" class="TLE_link_getic TLE-down-btn" onclick="return TLE.getbtn(this);"></a>'
                  + '</span>'
                  + '<div class="TLE_p_getbtn TLE_getbtn" style="display: none;">'
                    + '<a href="#" title="aria2" onmouseover="this.className=\'sel_on\'" onmouseout="this.className=\'\'" onclick="TLE.down(this, TLE.aria2)">Aria2</a>'
                    + '<a href="#" title="wget" onmouseover="this.className=\'sel_on\'" onmouseout="this.className=\'\'" onclick="TLE.down(this, TLE.wget)">wget</a>'
                  + '</div>'
                + '</div>');
    });

    $("#li_task_down").after('<a href="#" id="TLE_batch_down" title="批量导出" class="btn_m noit"><span><em class="icdwlocal">批量导出</em></span></a>')
                      .parents(".main_link").append(
                            '<div id="TLE_batch_getbtn" class="TLE_getbtn" style="top: 30px; display:none;">'
                            + '<a href="#" title="aria2" onmouseover="this.className=\'sel_on\'" onmouseout="this.className=\'\'" onclick="TLE.batch_down(TLE.aria2)">Aria2</a>'
                            + '<a href="#" title="wget" onmouseover="this.className=\'sel_on\'" onmouseout="this.className=\'\'" onclick="TLE.batch_down(TLE.wget)">wget</a>'
                          + '</div>');
    var _task_check_click = task_check_click;
    task_check_click = function() {
      _task_check_click();
      if ($("#li_task_down").hasClass("noit")) {
        $("#TLE_batch_down").addClass("noit").unbind("click");
      } else {
        $("#TLE_batch_down").removeClass("noit").unbind("click").click(function() {
          $("#TLE_batch_getbtn").css("left", $("#TLE_batch_down").position().left);
          $("#TLE_batch_getbtn").toggle();
          return false;
        });
      };
      console.log("task_check_click called");
    };
    $('input[name=ck]').click(task_check_click);

    $("#view_bt_list_nav_tpl").text($("#view_bt_list_nav_tpl").text().replace('<a href="#" class="btn_m noit" title="云转码"',
          '<a href="#" class="btn_m noit" title="批量导出" id="TLE_bt_down"><span><em class="icdwlocal">批量导出</em></span></a>'
          +'<div id="TLE_bt_getbtn" class="TLE_getbtn" style="top: 30px; display:none;">'
            + '<a href="#" title="aria2" onmouseover="this.className=\'sel_on\'" onmouseout="this.className=\'\'" onclick="TLE.bt_down(TLE.aria2)">Aria2</a>'
            + '<a href="#" title="wget" onmouseover="this.className=\'sel_on\'" onmouseout="this.className=\'\'" onclick="TLE.bt_down(TLE.wget)">wget</a>'
          + '</div>'
          +'<a href="#" class="btn_m noit" title="云转码"'));
    var _bt_view_nav = bt_view_nav;
    bt_view_nav = function() {
      _bt_view_nav();
      if ($("#view_bt_list_nav_down").hasClass("noit")) {
        $("#TLE_bt_down").addClass("noit").unbind("click");
      } else {
        $("#TLE_bt_down").removeClass("noit").unbind("click").click(function() {
          $("#TLE_bt_getbtn").css("left", $("#TLE_bt_down").position().left);
          $("#TLE_bt_getbtn").toggle();
          return false;
        });
      };
      $("#TLE_bt_getbtn").hide();
      console.log("bt_view_nav called");
    };

    $(document.body).bind("click",function(){
      $("div.TLE_p_getbtn, #TLE_batch_getbtn, #TLE_bt_getbtn").hide();
    });
    $("div.rw_list").click(function(e){
      $("div.TLE_p_getbtn, #TLE_batch_getbtn, #TLE_bt_getbtn").hide();
    });
    $("div.TLE_get_btnbox").click(function(e){e.stopPropagation();});
  };
  init();
})(TLE);

TLE.aria2 = function(todown) {
  console.log(todown);
  var str = "";
  $.each(todown.tasklist, function(n, task) {
    $.each(task.filelist, function(l, file) {
      if (file.downurl) str += "aria2c -c -s10 -x10 --out "+TLE.escape_command(file.title)+" --header 'Cookie: gdriveid="+todown.gdriveid+";' '"+file.downurl+"'\n"; 
    });
  });
  TLE.text_pop("aria2 download command", str);
};

TLE.wget = function(todown) {
  console.log(todown);
  var str = "";
  $.each(todown.tasklist, function(n, task) {
    $.each(task.filelist, function(l, file) {
      if (file.downurl) str += "wget -c -O "+TLE.escape_command(file.title)+" --header 'Cookie: gdriveid="+todown.gdriveid+";' '"+file.downurl+"'\n";
    });
  });
  TLE.text_pop("wget download command", str);
};
