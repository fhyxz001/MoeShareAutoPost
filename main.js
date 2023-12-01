// ==UserScript==
// @name         MoeShareAutoPost
// @namespace    https://github.com/fhyxz001/MoeShareAutoPost
// @version      0.2
// @description  萌享论坛资源区发贴格式化工具，用于帮助用户方便的进行资源发布
// @author       hexbkyoma&DIBAO
// @match        https://moeshare.cc/post.php?fid=22
// @match        https://moeshare.cc/post.php?fid=33
// @match        https://moeshare.cc/post.php?fid=28
// @match        https://moeshare.cc/post.php?fid=4
// @match        https://moeshare.cc/post.php?fid=42
// @match        https://moeshare.cc/post.php?fid=43
// @match        https://moeshare.cc/post.php?fid=3
// @match        https://www.moeshare.cc/post.php?fid=22
// @match        https://www.moeshare.cc/post.php?fid=33
// @match        https://www.moeshare.cc/post.php?fid=28
// @match        https://www.moeshare.cc/post.php?fid=4
// @match        https://www.moeshare.cc/post.php?fid=42
// @match        https://www.moeshare.cc/post.php?fid=43
// @match        https://www.moeshare.cc/post.php?fid=3
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481070/MoeShareAutoPost.user.js
// @updateURL https://update.greasyfork.org/scripts/481070/MoeShareAutoPost.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var attribute = [{key:1,label:'首发'},{key:2,label:'补档'}]
    var enAttribute = [{key:1,label:'首发'},{key:2,label:'补档'},{key:3,label:'二次分流'}]
    // 创建一个按钮
    var newButton = document.createElement("i");
    newButton.innerHTML = "发帖模板";
    newButton.onclick = autoPost;
    // 找到按钮容器
    var buttonContainer = document.querySelector(".wy_top_but");
    // 将新按钮插入到按钮容器中
    buttonContainer.appendChild(newButton);
    // 添加点击按钮时触发的函数
    function autoPost() {
        //弹出一个空白的窗口，用于填写信息 [作者] 漫画书名 [卷数][出版社][提取平台][网盘名称][其他信息]
        var postWindow = window.open("","","width=580,height=680");
        //postWindow的位置在屏幕中央的偏右
        postWindow.moveTo((window.screen.width-500)/2, (window.screen.height-500)/2);

        //获取当前页面的url，判断fid是多少，然后根据fid判断是哪个板块，不同模块有着不同的发贴模板
        var url = window.location.href;
        var fid = url.substring(url.indexOf("fid=")+4,url.length);
        //22,33,28属于电子分流区
        switch (fid) {
            case "22":case "28":case "33":
                //在窗口中添加一个中文电子分流区发帖模板标题
                postWindow.document.title = "中文电子分流区发帖模板";
                //标题输入框
                GenerateInput(postWindow,"作者","author","请输入作者名称");
                GenerateInput(postWindow,"漫画书名","book","请输入漫画名称");
                GenerateInput(postWindow,"卷数","volume","例如：1-7未、1-7完、单7未、单7完");
                GenerateInput(postWindow,"出版社","publisher","例如：台湾角川");
                GenerateInput(postWindow,"提取平台","platform","例如：BW、BW原档");
                GenerateInput(postWindow,"网盘名称","disk","例如：BD、百度");
                GenerateInput(postWindow,"其他信息","other","备注信息，可选项");
                //在窗口中添加一个按钮
                GenerateButton(postWindow,"生成标题",title_cn_electronic_area_create,"padding: 3px 8px; text-align: center; font-size: 18px; margin: 6px 110px; cursor: pointer");
                // 封面区输入框
                GenerateInput(postWindow,"封面","cover","请输入封面文件的图床链接");
                // 简介区输入框
                GenerateTextArea(postWindow,"简介","info","请在此输入简介内容","200px","80%");
                // 出售区输入框
                GenerateInput(postWindow,"售价(国库券)","sell","例如：0，代表帖子售价为0国库券");
                // MD可见区输入框
                GenerateInput(postWindow,"MD限制","md","例如：20，代表隐藏内容需20MD以上可见");
                // 下载链接区输入框
                GenerateTextArea(postWindow,"受限内容","download","可在此处输入下载链接、解压密码等信息","50px","80%");
                GenerateInput(postWindow,"自购证明","certification","请输入自购证明的图床链接");
                //生成简介按钮区**********
                GenerateButton(postWindow,"生成帖子",info_cn_electronic_area_info_create,"padding: 3px 8px; text-align: center; font-size: 18px; margin: 6px 110px; cursor: pointer");
                break;
            case "4":case "42":case "43":
                //在窗口中添加一个中文实体分流区发帖模板标题
                postWindow.document.title = "中文实体分流区发帖模板";
                GenerateInput(postWindow,"作者","author","请输入作者名称");
                GenerateInput(postWindow,"漫画书名","book","请输入漫画名称");
                GenerateInput(postWindow,"卷数","volume","例如：1-7未、1-7完、单7未、单7完");
                GenerateInput(postWindow,"出版社","publisher","例如：台湾角川");
                //扫描者
                GenerateInput(postWindow,"扫者","scanner","多位扫描者需要用&连接，例如：A&b&c");
                GenerateInput(postWindow,"网盘名称","disk","例如：BD、百度");
                //添加一个按钮，生成标题
                GenerateButton(postWindow,"生成标题",title_cn_entity_area_create,"padding: 3px 8px; text-align: center; font-size: 18px; margin: 6px 110px; cursor: pointer");
                //封面区输入框
                GenerateInput(postWindow,"封面","cover","请输入封面文件的图床链接");
                //简介区输入框
                GenerateTextArea(postWindow,"简介","info","请在此输入简介内容","200px","80%");
                //单卷信息输入框
                GenerateMoelistURL(postWindow,"moelist","moelistURL");
                GenerateTextArea(postWindow,"单卷信息","moelist","请在此输入单卷信息","200px","80%");
                //属性区输入框
                var selectValue = attribute[0].key;
                GenerateSwitch(postWindow,"资源属性","attribute",attribute,selectValue);
                GenerateInput(postWindow,"失效链接","certification","请输入失效链接，可选项，影响评分");
                //注释输入框
                GenerateTextArea(postWindow,"注释","note","格式：ID+moeshare，可选项，影响评分","50px","80%");
                // 出售区输入框
                GenerateInput(postWindow,"售价(国库券)","sell","例如：0，代表帖子售价为0国库券");
                // MD可见区输入框
                GenerateInput(postWindow,"MD限制","md","例如：20，代表隐藏内容需20MD以上可见");
                // 下载链接区输入框
                GenerateTextArea(postWindow,"受限内容","download","可在此处输入下载链接、解压密码等信息","50px","80%");
                //生成简介按钮区**********
                GenerateButton(postWindow,"生成帖子",info_cn_entity_area_create,"padding: 3px 8px; text-align: center; font-size: 18px; margin: 6px 110px; cursor: pointer");
                break;
            case "3":
                //在窗口中添加一个外文原版分享区发帖模板标题
                postWindow.document.title = "外文原版分享区发帖模板";
                GenerateInput(postWindow,"国家","country","例如：日本");
                GenerateInput(postWindow,"作者","author","请输入作者名称");
                GenerateInput(postWindow,"漫画书名","book","请输入漫画名称");
                GenerateInput(postWindow,"卷数","volume","例如：1-7未、1-7完、单7未、单7完");
                GenerateInput(postWindow,"网盘名称","disk","例如：BD、百度");
                //添加一个按钮，生成标题
                GenerateButton(postWindow,"生成标题",title_en_original_area_create,"padding: 3px 8px; text-align: center; font-size: 18px; margin: 6px 110px; cursor: pointer");
                //封面区输入框
                GenerateInput(postWindow,"封面","cover","请输入封面文件的图床链接");
                //简介区输入框
                GenerateTextArea(postWindow,"简介","info","请在此输入简介内容","200px","80%");
                //单卷信息输入框
                GenerateMoelistURL(postWindow,"moelist","moelistURL");
                GenerateTextArea(postWindow,"单卷信息","moelist","请在此输入单卷信息","200px","80%");
                //属性区输入框
                var enSelectValue = enAttribute[0].key;
                GenerateSwitch(postWindow,"资源属性","attribute",enAttribute,enSelectValue);
                //失效链接输入框
                GenerateInput(postWindow,"失效链接","certification","请输入失效链接，可选项，影响评分");
                //注释输入框
                GenerateTextArea(postWindow,"注释","note","格式：ID+moeshare，可选项，影响评分","50px","80%");
                // 出售区输入框
                GenerateInput(postWindow,"售价(国库券)","sell","例如：0，代表帖子售价为0国库券");
                // MD可见区输入框
                GenerateInput(postWindow,"MD限制","md","例如：20，代表隐藏内容需20MD以上可见");
                // 下载链接区输入框
                GenerateTextArea(postWindow,"受限内容","download","可在此处输入下载链接、解压密码等信息","50px","80%");
                //生成简介按钮区**********
                GenerateButton(postWindow,"生成帖子",info_en_original_area_create,"padding: 3px 8px; text-align: center; font-size: 18px; margin: 6px 110px; cursor: pointer");
                break;
            default:
                alert("请在萌享论坛资源区使用本脚本");
                return;
        }
        function info_en_original_area_create(){
            //外文原版分享区的帖子生成
            //获取Dom中id为textarea的元素，即简介输入框
            let finalInfo ="【封面】\n[img]"+postWindow.document.getElementById("cover").value+"[/img]";
            finalInfo+="\n";
            finalInfo+="[quote]【简介】\n"+postWindow.document.getElementById("info").value+"[/quote]";
            finalInfo+="\n";
            if(postWindow.document.getElementById("attribute").value !==""){
                var attributeKey =postWindow.document.getElementById("attribute").value
                if(attributeKey == 1) {
                    finalInfo += "[quote]【资源属性】\n【首發】[/quote]\n";
                }else if(attributeKey == 2){
                    finalInfo += "[quote]【资源属性】\n【補檔】 下附失效链接[/quote]\n";
                }else {
                    finalInfo += "[quote]【资源属性】\n【二次分流】[/quote]\n";
                }
            }
            if(postWindow.document.getElementById("certification").value !==""){
                finalInfo+="[quote]【失效链接】\n"+postWindow.document.getElementById("certification").value+"[/quote]\n";
            }
            if(postWindow.document.getElementById("note").value !==""){
                finalInfo+="[quote]【注释信息】\n已添加注释："+postWindow.document.getElementById("note").value+"[/quote]\n";
            }
            finalInfo+="[quote]【单卷信息】\n"+postWindow.document.getElementById("moelist").value+"[/quote]\n";
            if(postWindow.document.getElementById("md").value !=="") {
                finalInfo += "本下载链接需要" + postWindow.document.getElementById("md").value + "MD才能查看" + "\n";
                if (postWindow.document.getElementById("sell").value !== "") {
                    finalInfo += "[sell=" + postWindow.document.getElementById("sell").value + ",2]";
                    finalInfo += "[hide=" + postWindow.document.getElementById("md").value + ",rvrc]" + "\n";
                    finalInfo += postWindow.document.getElementById("download").value + "\n";
                    finalInfo += "[/hide][/sell]";
                } else {
                    finalInfo += "[hide=" + postWindow.document.getElementById("md").value + ",rvrc]" + "\n";
                    finalInfo += postWindow.document.getElementById("download").value + "\n";
                    finalInfo += "[/hide]";
                }
            }else {
                if (postWindow.document.getElementById("sell").value !== "") {
                    finalInfo += "本下载链接无MD限制\n";
                    finalInfo += "[sell=" + postWindow.document.getElementById("sell").value + ",2]";
                    finalInfo += postWindow.document.getElementById("download").value + "\n";
                    finalInfo += "[/sell]";
                } else {
                    finalInfo += postWindow.document.getElementById("download").value;
                }
            }
            var info = document.getElementById("textarea");
            info.value = finalInfo;
        }
        function title_en_original_area_create(){
            //外文原版分享区的标题生成
            //获取Dom中id为atc_title的元素，即标题输入框
            var title = document.getElementById("atc_title");
            //为title赋值，格式为[国家][作者][漫画名称][卷数][网盘名称]
            let finalTitle = "[" + postWindow.document.getElementById("country").value + "] " +
                "[" + postWindow.document.getElementById("author").value + "] " +
                "[" +postWindow.document.getElementById("book").value + "]" +
                " [" + postWindow.document.getElementById("volume").value + "]" +
                " [" +postWindow.document.getElementById("disk").value +"]";
            title.value = finalTitle;
        }
        function info_cn_entity_area_create(){
            //中文实体区域的帖子生成
            //获取Dom中id为textarea的元素，即简介输入框
            let finalInfo = "";
            finalInfo+="【封面】\n[img]"+postWindow.document.getElementById("cover").value+"[/img]";
            finalInfo+="\n";
            finalInfo+="[quote]【简介】\n"+postWindow.document.getElementById("info").value+"[/quote]";
            finalInfo+="\n";
            if(postWindow.document.getElementById("scanner").value !==""){
                var scanners = postWindow.document.getElementById("scanner").value.split("&")
                finalInfo+="[quote]【扫者】"
                for (let i = 0; i < scanners.length; i++) {
                    finalInfo+="Scan by "+scanners[i]+"\n";
                }
                finalInfo+=
                    "=========免責聲明==========\n" +
                    "●分享僅供試閱，如果想要收藏請支持且購買正版！！\n" +
                    "●請不要將分享的資源用於盈利或非法用途。\n" +
                    "●如將分享的資源用於盈利或非法用途，產生的任何法律責任請自行負責。\n" +
                    "●分享的資源由網路上轉載而來的，如有侵犯到原發佈者或掃圖者的地方，請傳訊告知。\n" +
                    "===========================\n" +
                    "\n" +
                    "  ～感謝掃者～[/quote]\n";
            }
            if(postWindow.document.getElementById("attribute").value !==""){
                var attributeKey =postWindow.document.getElementById("attribute").value
                if(attributeKey == 1) {
                    finalInfo += "[quote]【资源属性】\n【首發】[/quote]\n";
                }else {
                    finalInfo += "[quote]【资源属性】\n【補檔】 下附失效链接[/quote]\n";
                }
            }
            if(postWindow.document.getElementById("certification").value !==""){
                finalInfo+="[quote]【失效链接】\n"+postWindow.document.getElementById("certification").value+"[/quote]\n";
            }
            if(postWindow.document.getElementById("note").value !==""){
                finalInfo+="[quote]【注释信息】\n已添加注释："+postWindow.document.getElementById("note").value+"[/quote]\n";
            }
            finalInfo+="[quote]【单卷信息】\n"+postWindow.document.getElementById("moelist").value+"[/quote]\n";
            if(postWindow.document.getElementById("md").value !==""){
                finalInfo += "本下载链接需要"+postWindow.document.getElementById("md").value+"MD才能查看"+"\n";
                if(postWindow.document.getElementById("sell").value !==""){
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
                if(postWindow.document.getElementById("sell").value !=="") {
                    finalInfo += "本下载链接无MD限制\n";
                    finalInfo += "[sell=" + postWindow.document.getElementById("sell").value + ",2]";
                    finalInfo += postWindow.document.getElementById("download").value+"\n";
                    finalInfo += "[/sell]";
                }else {
                    finalInfo += postWindow.document.getElementById("download").value;
                }
            }
            var info = document.getElementById("textarea");
            info.value = finalInfo;
        }
        function title_cn_entity_area_create(){
            //中文实体区域的标题生成
            //获取Dom中id为atc_title的元素，即标题输入框
            var title = document.getElementById("atc_title");
            //为title赋值，格式为[作者][漫画书名][卷数][出版社][网盘名称]
            let finalTitle = "[" + postWindow.document.getElementById("author").value + "] " +
                " [" + postWindow.document.getElementById("book").value + "]" +
                " [" + postWindow.document.getElementById("volume").value + "]" +
                " [" +postWindow.document.getElementById("publisher").value +"]" +
                "["+postWindow.document.getElementById("scanner").value+"]"+
                " [" +postWindow.document.getElementById("disk").value +"]";
            title.value = finalTitle;
        }

        function info_cn_electronic_area_info_create(){
            var info = document.getElementById("textarea");
            let finalInfo = "";
            finalInfo += "[img]"+postWindow.document.getElementById("cover").value+"[/img]";
            finalInfo += "\n";
            finalInfo += postWindow.document.getElementById("info").value;
            finalInfo += "\n";
            if(postWindow.document.getElementById("md").value !==""){
                finalInfo += "本下载链接需要"+postWindow.document.getElementById("md").value+"MD才能查看"+"\n";
                if(postWindow.document.getElementById("sell").value !==""){
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
                if(postWindow.document.getElementById("sell").value !=="") {
                    finalInfo += "本下载链接无MD限制\n";
                    finalInfo += "[sell=" + postWindow.document.getElementById("sell").value + ",2]";
                    finalInfo += postWindow.document.getElementById("download").value+"\n";
                    finalInfo += "[/sell]";
                }else {
                    finalInfo += postWindow.document.getElementById("download").value;
                }
            }
            if(postWindow.document.getElementById("certification").value !=="") {
                finalInfo += "自购证明：\n";
                finalInfo += "[hide=999,credit][img]" +
                    postWindow.document.getElementById("certification").value + "[/img][/hide]";
            }
            info.value = finalInfo;
        }

        function title_cn_electronic_area_create(){
            //获取Dom中id为atc_title的元素，即标题输入框
            var title = document.getElementById("atc_title");
            //为title赋值，格式为[作者] 漫画书名 [卷数][出版社][提取平台][网盘名称][其他信息]
            let finalTitle = "[" + postWindow.document.getElementById("author").value + "] " +
                postWindow.document.getElementById("book").value +
                " [" + postWindow.document.getElementById("volume").value + "]" +
                " [" +postWindow.document.getElementById("publisher").value +"]" +
                " [" +postWindow.document.getElementById("platform").value +"]" +
                " [" +postWindow.document.getElementById("disk").value +"]";
            if(postWindow.document.getElementById("other").value !==""){
                finalTitle += " [" + postWindow.document.getElementById("other").value + "]";
            }
            title.value = finalTitle;
        }
    }
    function GenerateSwitch(postWindow,labelString,switchId,attribute,selectValue){
        var switchLabel = postWindow.document.createElement("label");
        switchLabel.innerHTML = labelString+"：";
        switchLabel.style.display = "inline-block";
        switchLabel.style.width = "20%";
        switchLabel.style.textAlign = "left";
        postWindow.document.body.appendChild(switchLabel);
        var switchSelect = postWindow.document.createElement("select");
        switchSelect.id = switchId;
        switchSelect.style.width = "40%";
        switchSelect.style.verticalAlign = "middle";
        for (let i = 0; i < attribute.length; i++) {
            let option = postWindow.document.createElement("option");
            option.value = attribute[i].key;
            option.innerHTML = attribute[i].label;
            if (attribute[i].key == selectValue) {
                option.selected = true;
            }
            switchSelect.appendChild(option);
        }
        postWindow.document.body.appendChild(switchSelect);
        postWindow.document.body.appendChild(postWindow.document.createElement("br"));
    }
    function GenerateButton(postWindow,buttonInnerHTML,buttonOnclick,buttonStyle){
        var button = postWindow.document.createElement("button");
        var br = postWindow.document.createElement("br");
        button.innerHTML = buttonInnerHTML;
        button.onclick = buttonOnclick;
        button.style = buttonStyle;
        postWindow.document.body.appendChild(button);
        postWindow.document.body.appendChild(br);
    }
    function GenerateMoelistURL(postWindow,labelString,inputId){
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
        a.innerHTML = "点击跳转到moelist页面（需要科学上网）";
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
        if (textareaId == "download") {authorLabel.style.color = "red";}
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
        textarea.style.verticalAlign = "middle";
        postWindow.document.body.appendChild(textarea);
        postWindow.document.body.appendChild(postWindow.document.createElement("br"));
    }
})();
