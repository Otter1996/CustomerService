using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;
using System.Collections;
using Newtonsoft.Json;
using System.Text;
using System.Threading;
using CustomerService.Models;

using CustomerService.BusinessLogic;

namespace CustomerService.Controllers
{
    public class HomeController : Controller
    {
        CustomerServiceEntities db = new CustomerServiceEntities(); //連接EF
        public ActionResult Index()
        {
            ArrayList L = new ArrayList(); //用來紀錄Sessoin陣列
            Session["RecordEachMemberMessage"] = L; //用來保存L(Session[info])
            return View("Index");
        }

        public ActionResult Service()
        {
            return View("Service");
        }

        /// <summary>
        /// 登入使用者/管理員
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult Login(int id)
        {
            DateTime time = DateTime.Now;
            if (Request.Cookies["Test"] != null)
            {
                Response.Cookies["Test"].Expires = DateTime.Now.AddDays(-1);
            }
            HttpCookie userinfo = new HttpCookie("Test");
            ArrayList MemeberMessageHistory = new ArrayList();
            Session[Convert.ToString(id)] = MemeberMessageHistory; //用來保存JsonMessageHistory
            switch (id)
            {
                case 1:
                    /*注意此Cookie未加密*/
                    userinfo.Value = "小明";
                    userinfo.Expires = time.AddMinutes(30);
                    Response.Cookies.Add(userinfo);
                    ViewBag.Message = "Hi!小明,Welcome back!";
                    break;
                case 2:
                    /*注意此Cookie未加密*/
                    userinfo.Value = "小王";
                    userinfo.Expires = time.AddMinutes(30);
                    Response.Cookies.Add(userinfo);
                    ViewBag.Message = "Hi!小王,Welcome back!";
                    break;
                case 10:
                    userinfo.Value = "管理員";
                    userinfo.Expires = time.AddMinutes(30);
                    Response.Cookies.Add(userinfo);
                    ViewBag.Message = "Hi!管理員,今天也要保持快樂的心情喔!";
                    break;
            }
            if (id == 10) {
                return View("Service");
            }
            return View("Index");
        }
        /// <summary>
        /// 收到訊息
        /// </summary>
        /// <param name="Message"name ="ResponseId"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult SendMessage(string Message, string ResponseId)
        {
            try
            {
                var info = Request.Cookies["Test"].Value; //取的用戶ID or 管理員ID
                CustomerServiceModel customerServiceModel = new CustomerServiceModel();
                customerServiceModel.RequestId = info;
                customerServiceModel.Context = Message;
                customerServiceModel.ResponseId = ResponseId;
                customerServiceModel.Read = false;
                customerServiceModel.SendTime = DateTime.Now;
                db.CustomerService.Add(customerServiceModel);//存進一筆資料
                db.SaveChanges();
                return Json(true);
            }
            catch (Exception ex)
            {
                return Json(false);
            }
        }
        /// <summary>
        /// 更新未讀列表
        /// </summary>
        /// <returns>所有User的未讀列表</returns>
        [HttpPost]
        public JsonResult ReadMessage()
        {
            var currentMessage = db.CustomerService.Where(m => m.Read == false);
            List<string> list = new List<string>();
            foreach (var p in currentMessage)
            {
                list.Add(p.RequestId);
            }

            var query = (from num in
                    (
                    from name in list
                    group name by name into g
                    select new
                    {
                        name = g.Key,
                        count = g.Count()
                    }
                    )
                         orderby num.count descending
                         select new { num.name, num.count }).ToList();
            string result = JsonConvert.SerializeObject(query);
            return Json(result);
        }
        /// <summary>
        /// 點擊未讀訊息顯示所有對話內容
        /// </summary>
        /// <param name="alreadyread">即將要讀取某位User的id名稱</param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult ShowConversation(string alreadyread)
        {
            var allconversations = db.CustomerService.Where(m => m.RequestId == alreadyread || m.ResponseId == alreadyread);
            allconversations = allconversations.OrderBy(m => m.SendTime);
            List<ShowContext> contextlist = new List<ShowContext>();
            foreach (var m in allconversations)
            {
                contextlist.Add(new ShowContext() { Context = m.Context, RequestId = m.RequestId, ResponseId = m.ResponseId });
            }
            string result = JsonConvert.SerializeObject(contextlist);
            return Json(result);
        }

        [HttpPost]
        public void UnreadToRead(string Who,string ToWho)
        {
            var UserMessage = db.CustomerService.Where(m => m.RequestId == Who && m.ResponseId == ToWho && m.Read == false);
            foreach (var p in UserMessage)
            {
                p.Read = true;
            }
            db.SaveChanges();
        }

    }
    /// <summary>
    /// 用來裝載顯示對話內容方法所需回傳的字串值。
    /// </summary>
}