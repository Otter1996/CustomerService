//送出訊息
function SendMessage(text) {
let mytext = text;
    if (mytext != '') {
insertChat("you", mytext);
        document.getElementById("mytext").value = '';
        postmessagetocontroller(mytext);
    } else {
alert('訊息沒有正確傳送');
    }
}

///頭像設定
var admin = { };
admin.avatar = "/Img/CustomerService.png";

var user = { };
user.avatar = "/Img/animation.jpg";

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
    var date = formatAMPM(new Date()); //時間
    var newStr = getNewline(text);

    if (who == "admin")
    {
    control = '<li style="width:100%">' +
    '<div class="msj macro">' +
    '<div class="avatar"><img class="img-circle" style="width:100%;" src="' + admin.avatar + '" /></div>' +
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
    '<div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="img-circle" style="width:100%;" src="' + user.avatar + '" /></div>' +
    '</li>';
    }

    $('#chatwindow').append(control).scrollTop($('#chatwindow').prop('scrollHeight')); //串接文字高度
}


//換行方法
function getNewline(val) {
    var str = new String(val);
    var bytesCount = 0;
    var s = "";
    for (var i = 0, n = str.length; i < n; i++)
    {
        var c = str.charCodeAt(i);
        //統計字串長度
        if((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f))
        {
        bytesCount += 1;
        } 
        else
        {
        bytesCount += 2;
        }
        //换行
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

function parseCookie() {
    var cookieObj = {};
    var cookieAry = document.cookie.split(';');
    var cookie;

    for (var i = 0, l = cookieAry.length; i < l; ++i) {
        cookie = jQuery.trim(cookieAry[i]);
        cookie = cookie.split('=');
        cookieObj[cookie[0]] = cookie[1];
    }
    return cookieObj;
}


function getCookieByName(name) {
    var value = parseCookie()[name];
    if (value) {
        value = decodeURIComponent(value);
    }

    return value;
}

///送出訊息
function postmessagetocontroller(message) {
    $(document).ready(function () {
        $.ajax({
            url: "/Home/SendMessage",
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ 'Message': message, 'ResponseId': "管理員" }),
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

///把未讀訊息改成已讀訊息
function ChangeUnReadToRead(RequestId, ResponseId) {
    $.ajax({
        type: "POST",
        url: "/Home/UnreadToRead",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ 'Who': RequestId, 'ToWho': ResponseId }),
    })
}

///更新未讀訊息
setInterval(
    function readUnreadMessage() {
        if (getCookieByName('Test') != null) {
            document.getElementById('chatwindow').innerHTML = "";
            $.ajax({
                type: "POST", //傳送方式
                url: "/Home/ShowConversation", //傳送目的地
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ 'alreadyread': getCookieByName('Test') }),
                success: function (data) {
                    list = JSON.parse(data);//這個很重要!
                    list.forEach(function (value, index, array) {
                        if (array[index].RequestId == getCookieByName('Test') && array[index].ResponseId == "管理員") {
                            insertChat("user", array[index].Context);
                        } else if (array[index].RequestId == "管理員" && array[index].ResponseId == getCookieByName('Test')) {
                            insertChat("admin", array[index].Context);
                        }
                    })
                    ChangeUnReadToRead("管理員", getCookieByName('Test'));
                },
                error: function (xhr) {
                    console.log("對話紀錄沒有顯示");
                }
            })
        }
    }, 5000);