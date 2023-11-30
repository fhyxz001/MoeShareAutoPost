// ==UserScript==
// @name         MoeShareAutoPost
// @namespace    https://github.com/fhyxz001/MoeShareAutoPost
// @version      0.1
// @description  萌享论坛资源区发贴格式化工具，用于帮助用户方便的进行资源发布
// @author       hexbkyoma
// @match        https://moeshare.cc/post.php?fid=22
// @match        https://moeshare.cc/post.php?fid=33
// @match        https://moeshare.cc/post.php?fid=28
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        GM_log
// ==/UserScript==

(function() {
    'use strict';
    // 创建一个按钮
    var newButton = document.createElement("i");
    newButton.innerHTML = "快捷发帖";
    newButton.onclick = autoPost;
    // 找到按钮容器
    var buttonContainer = document.querySelector(".wy_top_but");
    // 将新按钮插入到按钮容器中
    buttonContainer.appendChild(newButton);
    // 添加点击按钮时触发的函数
    function autoPost() {
        //弹出一个空白的窗口，用于填写信息 [作者] 漫画书名 [卷数][出版社][提取平台][网盘名称][其他信息]
        var postWindow = window.open("","","width=500,height=630");
        //postWindow的位置在屏幕中央的偏右
        postWindow.moveTo((window.screen.width-500)/2, (window.screen.height-500)/2);
        //在窗口中添加一个标题
        postWindow.document.title = "快捷发帖";
        //标题输入框
        GenerateInput(postWindow,"作者","author","请输入");
        GenerateInput(postWindow,"漫画书名","book","请输入漫画名称");
        GenerateInput(postWindow,"卷数","volume","例如：1-7未、1-7完、单7未、单7完");
        GenerateInput(postWindow,"出版社","publisher","例如：台湾角川");
        GenerateInput(postWindow,"提取平台","platform","例如：BW、BW原档");
        GenerateInput(postWindow,"网盘名称","disk","例如：BD、百度");
        GenerateInput(postWindow,"其他信息","other","备注信息，可选项");
        //在窗口中添加一个按钮
        var button = postWindow.document.createElement("button");
        button.innerHTML = "生成标题";
        button.onclick = titleCreate;
        postWindow.document.body.appendChild(button);
        postWindow.document.body.appendChild(postWindow.document.createElement("br"));

        // 封面区输入框
        GenerateInput(postWindow,"封面","cover","请输入封面文件图床链接");
        // 简介区输入框
        GenerateTextArea(postWindow,"简介","info","请输入简介内容","200px","80%");
        GenerateURL(postWindow,"moelist","moelistURL","","200px","80%");
        // moelist区
        GenerateTextArea(postWindow,"moelist","moelist","请输入moelist信息","200px","80%");

        // 出售区输入框
        GenerateInput(postWindow,"国库卷","sell","例如：0，代表0购买");
        // MD可见区输入框
        GenerateInput(postWindow,"MD可见","md","例如:20,代表20MD可见");
        // 下载链接区输入框
        GenerateTextArea(postWindow,"下载链接","download","请在此处输入下载链接及解压密码信息","50px","80%");

        //生成简介按钮区**********
        var button1 = postWindow.document.createElement("button");
        button1.innerHTML = "生成简介";
        button1.onclick = infoCreate;
        postWindow.document.body.appendChild(button1);
        postWindow.document.body.appendChild(postWindow.document.createElement("br"));



        function infoCreate(){
            var info = document.getElementById("textarea");
            let finalInfo = "";
            finalInfo += "[img]"+postWindow.document.getElementById("cover").value+"[/img]";
            finalInfo += "\n";
            finalInfo += postWindow.document.getElementById("info").value;
            finalInfo += "\n";
            finalInfo += postWindow.document.getElementById("moelist").value;
            finalInfo += "\n";
            if(postWindow.document.getElementById("md").value != ""){
                finalInfo += "本下载链接需要"+postWindow.document.getElementById("md").value+"MD才能查看"+"\n";
                if(postWindow.document.getElementById("sell").value != ""){
                    finalInfo +="[sell="+postWindow.document.getElementById("sell").value+",2]";
                    finalInfo +="[hide="+postWindow.document.getElementById("md").value+",rvrc]"+"\n";
                    finalInfo += postWindow.document.getElementById("download").value+"\n";
                    finalInfo += "[/hide][/sell]";
                }else {
                    finalInfo +="[hide="+postWindow.document.getElementById("md").value+",rvrc]"+"\n";
                    finalInfo += postWindow.document.getElementById("download").value+"\n";
                    finalInfo += "[/hide]";
                }
            }else {
                if(postWindow.document.getElementById("sell").value != "") {
                    finalInfo += "本下载链接无MD限制\n";
                    finalInfo += "[sell=" + postWindow.document.getElementById("sell").value + ",2]";
                    finalInfo += postWindow.document.getElementById("download").value+"\n";
                    finalInfo += "[/sell]";
                }else {
                    finalInfo += postWindow.document.getElementById("download").value;
                }
            }
            info.value = finalInfo;
        }

        function titleCreate(){
            //获取Dom中id为atc_title的元素，即标题输入框
            var title = document.getElementById("atc_title");
            //为title赋值，格式为[作者] 漫画书名 [卷数][出版社][提取平台][网盘名称][其他信息]
            let finalTitle = "[" + postWindow.document.getElementById("author").value + "] " +
                postWindow.document.getElementById("book").value +
                " [" + postWindow.document.getElementById("volume").value + "]" +
                " [" +postWindow.document.getElementById("publisher").value +"]" +
                " [" +postWindow.document.getElementById("platform").value +"]" +
                " [" +postWindow.document.getElementById("disk").value +"]";
            if(postWindow.document.getElementById("other").value != ""){
                finalTitle += " [" + postWindow.document.getElementById("other").value + "]";
            }
            title.value = finalTitle;

        }
    }
    function GenerateURL(postWindow,labelString,inputId,placeholderString,height,width){
        var authorLabel = postWindow.document.createElement("label");
        authorLabel.innerHTML = labelString+"：";
        authorLabel.style.display = "inline-block";
        authorLabel.style.width = "20%";
        authorLabel.style.textAlign = "left";
        postWindow.document.body.appendChild(authorLabel);
        var a = postWindow.document.createElement("a");
        a.id = inputId;
        a.href = "https://toolbox-8hz.pages.dev/moelist";
        a.target = "_blank";
        a.innerHTML = "点击跳转";
        postWindow.document.body.appendChild(a);
        postWindow.document.body.appendChild(postWindow.document.createElement("br"));
    }
    function GenerateInput(postWindow,labelString,inputId,placeholderString){
        var authorLabel = postWindow.document.createElement("label");
        authorLabel.innerHTML = labelString+"：";
        authorLabel.style.display = "inline-block";
        authorLabel.style.width = "20%";
        authorLabel.style.textAlign = "left";
        postWindow.document.body.appendChild(authorLabel);
        var input = postWindow.document.createElement("input");
        input.type = "text";
        input.style.width = "80%";
        input.id = inputId;
        input.placeholder = placeholderString;
        postWindow.document.body.appendChild(input);
        postWindow.document.body.appendChild(postWindow.document.createElement("br"));
    }
    function GenerateTextArea(postWindow,labelString,textareaId,placeholderString,height,width){
        var authorLabel = postWindow.document.createElement("label");
        authorLabel.innerHTML = labelString+"：";
        authorLabel.style.display = "inline-block";
        authorLabel.style.width = "20%";
        authorLabel.style.textAlign = "left";
        postWindow.document.body.appendChild(authorLabel);
        var textarea = postWindow.document.createElement("textarea");
        textarea.id = textareaId;
        textarea.placeholder = placeholderString;
        textarea.style.height = height;
        textarea.style.width = width;
        postWindow.document.body.appendChild(textarea);
        postWindow.document.body.appendChild(postWindow.document.createElement("br"));
    }
})();
