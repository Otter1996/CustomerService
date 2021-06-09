
//送出訊息
function SendMessage(text) {
let mytext = text;
    if (mytext != '') {
insertChat("you", mytext);
        document.getElementById("mytext").value = '';
        postmessagetocontroller(mytext);
    } else {
alert('送出訊息時發生錯誤');
    }
}

///頭像設定
var me = { };
me.avatar = "/Img/animation.jpg";

var you = { };
you.avatar = "/Img/CustomerService.png";

///設定時間
function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

//於聊天室窗中插入傳送訊息
function insertChat(who, text) {

    var control = "";
    var date = formatAMPM(new Date()); //自動時間(非發送訊息時間)
    var newStr = getNewline(text);

    if (who == "me") {
    control = '<li style="width:100%";>' +
    '<div class="msj macro">' +
    '<div class="avatar"><img class="img-circle" style="width:100%;" src="' + me.avatar + '" /></div>' +
    '<div class="text text-l">' +
    '<p>' + newStr + '</p>' +
    '<p><small>' + date + '</small></p>' +
    '</div>' +
    '</div>' +
    '</li>';
    }
    else
    {
    control = '<li style="width:100%;">' +
    '<div class="msj-rta macro">' +
    '<div class="text text-r">' +
    '<p>' + newStr + '</p>' +
    '<p><small>' + date + '</small></p>' +
    '</div>' +
    '<div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="img-circle" style="width:100%;" src="' + you.avatar + '" /></div>' +
    '</li>';
    }

    $('#chatwindow').append(control).scrollTop($('#chatwindow').prop('scrollHeight')); //串接文字高度
}
//換行方法，parameter : 傳送文字
function getNewline(val) {
    var str = new String(val);
    var bytesCount = 0;
    var s = "";
    for (var i = 0, n = str.length; i < n;i++)
    {
        var c = str.charCodeAt(i);
        //統計字串的長度
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f))
        {
            bytesCount += 1;
        } else
        {
            bytesCount += 2;
        }
        //換行
        s += str.charAt(i);
        if (bytesCount >= 21)
        {
            s = s + '<br>';
            //重置
            bytesCount = 0;
        }
    }
    return s;
}
//取得某用戶的對話紀錄
var RefreshUreadToRead = "/Home/UnreadToRead";
var RefreshUnreadMessage = "/Home/ShowConversation";
var UserId = "";
function readUnreadMessage(username) {
    UserId = username; //儲存點選的用戶名稱給btn用
    document.getElementById('chatwindow').innerHTML = "";
    $.ajax({
        type: "POST", //傳送方式
        url: RefreshUnreadMessage, //傳送目的地
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ 'alreadyread': username }),
        success: function (data) {
            list = JSON.parse(data);//這個很重要!
            list.forEach(function (value, index, array) {
                if (array[index].RequestId == username && array[index].ResponseId == "管理員") {
                    insertChat("me", array[index].Context);
                } else if (array[index].RequestId == "管理員" && array[index].ResponseId == username) {
                    insertChat("you", array[index].Context);
                }
            })
            $('#' + username + ' span').html('0');
            ChangeUnReadToRead(username, "管理員");
        },
        error: function (xhr) {
            console.log("Oops");
        }
    })
}

function ChangeUnReadToRead(RequestId, ResponseId) {
    $.ajax({
        type: "POST", //傳送方式
        url: RefreshUreadToRead, //傳送目的地
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ 'Who': RequestId, 'ToWho': ResponseId }),
        error: function (xhr) {
            console.log("Oops");
        }
    })
}

///送出訊息
function postmessagetocontroller(message) {
$(document).ready(function () {
    $.ajax({
        url: "/Home/SendMessage",
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ 'Message': message, 'ResponseId': UserId }),
        error: function (xhr) {
            console.log("hey!有些東西出錯了，沒有收到controller來的訊息");
        },
        success: function (response) {
            let boolean = JSON.parse(response)
            if (!response) {
                alert('請先登入使用者再使用聊天功能');
            }
        }
    });
});
}

//更新未讀清單，每5秒request一次
var list = "";
setInterval(
function () {
    $.ajax({
        type: "POST",
        url: "/Home/ReadMessage",
        success: function (result) {
            list = JSON.parse(result);//這個很重要!
            list.forEach(function (value, index, array) {
                if (document.getElementById(array[index].name)) {
                    $('#' + array[index].name + ' span').html(array[index].count);
                }
                else if (array[index].name != "管理員") {
                            
                    $('#list-group').append(
                        '<li class="list-group-item d-flex justify-content-between align-items-center btn" id="' + array[index].name + '"onclick="readUnreadMessage(\'' + array[index].name + '\')">'
                        + array[index].name +
                        '<span class="badge badge-primary badge-pill">' + array[index].count + '</span></li>')
                }
            })
        },
        error: function (xhr) {
            console.log("hey!有些東西出錯了，沒有收到controller來的訊息");
        },
    });
}, 5000);
