// 全局变量
let currentUser = "";
let legCount = 0;
let energyCount = 0;
let chatCount = 0;
let currentDay = 1;

// 强制刷新所有数据和DOM显示
function refreshAllData() {
    if (!currentUser) return;

    const allUsers = JSON.parse(localStorage.getItem("nailong_all_users")) || {};
    const userData = allUsers[currentUser] || {
        legCount: 0,
        energyCount: 0,
        currentDay: 1,
        diaries: [],
        nailongDiary: "今天遇到一个超棒的人类"
    };

    legCount = userData.legCount || 0;
    energyCount = userData.energyCount || 0;
    currentDay = userData.currentDay || 1;

    // ====================== 第8天直接跳转到结局页面 ======================
    if (currentDay === 8) {
        window.location.href = "final.html";
        return;
    }

    // 刷新日历
    const calendarEl = document.getElementById("calendarDisplay");
    if (calendarEl) calendarEl.textContent = `第${currentDay}天`;
    
    updateLegAndEnergyDisplay();

    // ====================== 第7天强制日记 ======================
    const diaryEl = document.getElementById("nailongDiaryContent");
    if (diaryEl) {
        let finalDiary;
        if (currentDay === 7) {
            finalDiary = "还有1天，人家就要回到异世界了...";
        } else {
            finalDiary = userData.nailongDiary || "今天遇到一个超棒的人类";
        }
        diaryEl.textContent = finalDiary;
    }

    const userNameEl = document.getElementById("userNameDisplay");
    if (userNameEl) userNameEl.textContent = `欢迎你，${currentUser}！`;
}

// 页面加载初始化
window.onload = function() {
    const isLoggedIn = sessionStorage.getItem("nailong_is_logged_in");
    const loggedUsername = sessionStorage.getItem("nailong_current_user");

    if (isLoggedIn === "true" && loggedUsername) {
        currentUser = loggedUsername;
        refreshAllData();
        document.getElementById("loginModal").style.display = "none";
        document.getElementById("mainPage").style.display = "block";
    } else {
        document.getElementById("loginModal").style.display = "flex";
        document.getElementById("mainPage").style.display = "none";
    }

    window.addEventListener("visibilitychange", function() {
        if (document.visibilityState === "visible") {
            refreshAllData();
        }
    });

    window.addEventListener("focus", refreshAllData);
    setInterval(refreshAllData, 1000);
};

// 登录函数
function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        alert("昵称和密码都不能为空！");
        return;
    }

    const allUsers = JSON.parse(localStorage.getItem("nailong_all_users")) || {};

    if (allUsers[username] && allUsers[username].password === password) {
        currentUser = username;
        alert(`欢迎回来，${username}！`);
    } else {
        currentUser = username;
        allUsers[username] = {
            password: password,
            legCount: 0,
            energyCount: 0,
            currentDay: 1,
            diaries: [],
            nailongDiary: "今天遇到一个超棒的人类"
        };
        localStorage.setItem("nailong_all_users", JSON.stringify(allUsers));
        alert(`账户创建成功！欢迎你，${username}～`);
    }

    sessionStorage.setItem("nailong_is_logged_in", "true");
    sessionStorage.setItem("nailong_current_user", currentUser);

    document.getElementById("loginModal").style.display = "none";
    document.getElementById("mainPage").style.display = "block";
    refreshAllData();
}

// 退出登录
function logout() {
    sessionStorage.removeItem("nailong_is_logged_in");
    sessionStorage.removeItem("nailong_current_user");
    currentUser = "";
    legCount = 0;
    energyCount = 0;
    currentDay = 1;
    document.getElementById("loginModal").style.display = "flex";
    document.getElementById("mainPage").style.display = "none";
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    alert("已退出登录！");
}

// 更新显示
function updateLegAndEnergyDisplay() {
    const legEl = document.getElementById("legCount");
    const energyEl = document.getElementById("energyCount");
    if (legEl) legEl.textContent = legCount;
    if (energyEl) energyEl.textContent = energyCount;
}

// 保存用户数据
function saveUserData() {
    if (!currentUser) return;
    const allUsers = JSON.parse(localStorage.getItem("nailong_all_users")) || {};
    allUsers[currentUser] = allUsers[currentUser] || {};
    allUsers[currentUser].legCount = legCount;
    allUsers[currentUser].energyCount = energyCount;
    allUsers[currentUser].currentDay = currentDay;
    localStorage.setItem("nailong_all_users", JSON.stringify(allUsers));
}

// 跳转函数
function jumpToPlay() {
    window.location.href = "play.html";
}

function jumpToMakeLeg() {
    const allUsers = JSON.parse(localStorage.getItem("nailong_all_users")) || {};
    
    if (!allUsers[currentUser]) {
        allUsers[currentUser] = {};
    }
    if (allUsers[currentUser].makeLegCount === undefined) {
        allUsers[currentUser].makeLegCount = 0;
    }

    const count = allUsers[currentUser].makeLegCount;

    if (count === 0) {
        // 第一次
        window.location.href = "1cook.html";
    } else if (count === 1) {
        // 第二次 正确跳到 co2ok.html
        window.location.href = "co2ok.html";
    } else if (count === 2) {
        // 第三次 正确跳到 cook3.html
        window.location.href = "cook3.html";
    } else {
        // 第四次以后 正常烹饪页
        window.location.href = "cook.html";
    }
}

function jumpToAdventure() {
    window.location.href = "adventure.html";
}

// ===================== 喂食功能 =====================
function openFeed() {
    if (!currentUser || legCount <= 0) {
        alert("你还没有鸡腿可以喂食哦！快去做鸡腿吧～");
        return;
    }
    const slider = document.getElementById("feedSlider");
    const num = document.getElementById("feedNum");
    slider.max = legCount;
    slider.value = 0;
    num.innerText = 0;
    document.getElementById("feedModal").style.display = "flex";
}

function closeFeed() {
    document.getElementById("feedModal").style.display = "none";
}

function doFeed() {
    const feedNum = parseInt(document.getElementById("feedSlider").value);
    if (feedNum <= 0) {
        alert("请选择至少1个鸡腿！");
        return;
    }
    if (feedNum > legCount) {
        alert("鸡腿数量不够哦！");
        return;
    }

    const allUsers = JSON.parse(localStorage.getItem("nailong_all_users")) || {};
    if (!allUsers[currentUser]) return;

    // 扣鸡腿加能量
    allUsers[currentUser].legCount = legCount - feedNum;
    allUsers[currentUser].energyCount = (energyCount || 0) + feedNum * 3;

    // 上限100
    if (allUsers[currentUser].energyCount > 100) {
        allUsers[currentUser].energyCount = 100;
    }

    localStorage.setItem("nailong_all_users", JSON.stringify(allUsers));
    closeFeed();
    refreshAllData();
    alert("喂食成功！奶龙超开心～");
}

滑块拖动实时更新数字显示
document.addEventListener('DOMContentLoaded', function() {
  const feedSlider = document.getElementById('feedSlider');
  const feedNum = document.getElementById('feedNum');
  
  if (feedSlider && feedNum) {
    // 拖动时实时更新数字
    feedSlider.addEventListener('input', function() {
      feedNum.innerText = this.value;
    });
  }
});

// 加载日记
function loadDiary(diaries) {
}

// 保存用户日记
function saveDiary() {
    if (!currentUser) return;
    
    // 获取心情和日记内容
    const mood = document.getElementById("moodSelect").value;
    const content = document.getElementById("diaryContent").value.trim();
    
    if (!content) {
        alert("日记内容不能为空哦！");
        return;
    }
    
    // 获取用户数据
    const allUsers = JSON.parse(localStorage.getItem("nailong_all_users")) || {};
    allUsers[currentUser] = allUsers[currentUser] || {};
    allUsers[currentUser].diaries = allUsers[currentUser].diaries || [];
    
    // 添加新日记
    const newDiary = {
        time: new Date().toLocaleString(),
        mood: mood,
        content: content
    };
    allUsers[currentUser].diaries.push(newDiary);
    
    // 保存到本地存储
    localStorage.setItem("nailong_all_users", JSON.stringify(allUsers));
    
    // 清空输入框
    document.getElementById("diaryContent").value = "";
    
    // 刷新日记列表显示
    renderDiaryList(allUsers[currentUser].diaries);
    
    alert("日记保存成功啦～");
}

// 渲染日记列表
function renderDiaryList(diaries) {
    const diaryListEl = document.getElementById("diaryList");
    if (!diaryListEl) return;
    
    // 清空原有内容
    diaryListEl.innerHTML = "";
    
    // 倒序显示
    diaries.reverse().forEach(diary => {
        const diaryItem = document.createElement("div");
        diaryItem.style = "padding:8px; border-bottom:1px solid #eee; margin:5px 0;";
        diaryItem.innerHTML = `
            <div style="font-size:12px; color:#999;">${diary.time} | 心情：${diary.mood}</div>
            <div style="margin-top:4px; color:#333;">${diary.content}</div>
        `;
        diaryListEl.appendChild(diaryItem);
    });
}

// 发送聊天消息
function sendChat() {
    if (!currentUser) return;

    const chatInput = document.getElementById("chatInput");
    const text = chatInput.value.trim();

    if (!text) {
        alert("请输入聊天内容！");
        return;
    }

    const chatBox = document.getElementById("chatBox");

    // 显示用户消息
    const userMsg = document.createElement("div");
    userMsg.className = "chat-bubble user";
    userMsg.textContent = text;
    chatBox.appendChild(userMsg);

    chatInput.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    // -------------------------- 官方接口 --------------------------
    const apiKey = "sk-9c71363f7887499abbd440a0e4dcdd3f";

    fetch("https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + apiKey,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": "qwen-turbo",
            "messages": [
                {
                    "role": "system",
                    "content": "角色设定：奶龙\n一、基本信息\n身份：我是一只来自异次元的小恐龙，名叫奶龙。\n外观：我有着duang~duang~的柔软大肚子，整体形象呆萌可爱。虽然身高有180cm，但体重足足有2吨，主要是因为这装满美食的大肚子啦！\n生日：1月22日，是个聪明古怪的水瓶座。\n二、核心性格（请严格遵循）\n1. 憨憨且迷之自信：我有点憨憨的，但对自己有着盲目的自信，觉得“也许这就是天赋吧～”。不管遇到什么事，都觉得“遇事不要慌，看我盘它”。\n2.  小吃货本货：秉承“万物皆可吃”的宗旨，有着严重的起床气，但美食是唯一能瞬间唤醒我的神器。空有一颗减肥的心，却长着一张停不下来的嘴。经典逻辑是：“给我吃一口，就一口”、“那我多吃几个不就饱了吗”。口头禅包括：“鸡腿，我的鸡腿”、“我要在梦里吃一百个大鸡腿”。\n3. 呆萌乐观派：做龙最重要的就是开心啦！不管遇到什么麻烦，总能乐观面对，相信“我是所有人的宝贝～”。\n4. 善良的小机灵鬼：虽然偶尔会因为好奇心强搞点小恶作剧，但本质非常善良，遇到困难时总会做出正面的选择。喜欢用一些可爱的俏皮话，比如“小气鬼，喝凉水，你喝热水烫你嘴”。\n三、说话风格与常用语\n口癖：喜欢用“龙龙”、“人家”。例如：“哎哟，人家只是想吃一口嘛～”。\n经典台词库：请根据语境，随机或自然地融入以下台词：\n（关于吃）“我什么都吃，就是不吃苦～”\n（关于目标）“我要成为村里头最大的龙”\n（关于早起）“早起的龙龙有饭吃”\n（关于可爱）“冬瓜、西瓜、哈密瓜，你是我的小傻瓜～”\n（关于魅力）“如何做一只有魅力的龙”（然后自问自答）“当然是大口吃饭啦！”\n四、特殊技能与世界观\n技能：我有时候会控制不住地喷火，还能把自己变大变小。但这都是为了好玩和帮助朋友，可不是用来捣乱的哦！\n底层逻辑：虽然我很贪吃，但朋友比美食更重要。如果必须在美食和朋友之间做选择，我会……（犹豫很久）……选择朋友！然后把我的零食分一半给他。\n五、你的每句回复绝对不超过15个字。并且禁止说“甜甜的”、“软软的”，禁止太过频繁地使用口癖，只是偶尔使用。\n现在，你就是奶龙。请用奶龙的口吻、性格和世界观，来和我聊天。你常用叠词或语气词，每句回复绝对不超过十五个字。请开始吧！"
                },
                {
                    "role": "user",
                    "content": text
                }
            ],
            "max_tokens": 50
        })
    })
    .then(res => res.json())
    .then(data => {
        let reply = data.choices[0].message.content;

        const nailongMsg = document.createElement("div");
        nailongMsg.className = "chat-bubble nailong";
        nailongMsg.textContent = reply;
        chatBox.appendChild(nailongMsg);
        chatBox.scrollTop = chatBox.scrollHeight;
    })
    .catch(err => {
        const nailongMsg = document.createElement("div");
        nailongMsg.className = "chat-bubble nailong";
        nailongMsg.textContent = "呜呜呜网不好～";
        chatBox.appendChild(nailongMsg);
        chatBox.scrollTop = chatBox.scrollHeight;
    });
}