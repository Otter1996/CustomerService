using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CustomerService.BusinessLogic
{
    public class BusinessLogic
    {
    }

    /// <summary>
    /// 用來裝載顯示對話內容方法所需回傳的字串值。
    /// </summary>
    public class ShowContext
    {
        public string Context { get; set; }
        public string RequestId { get; set; }
        public string ResponseId { get; set; }
    }
}