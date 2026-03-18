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

    // 扣鸡腿加能量（1个鸡腿 = 3点能量）
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
    
    // 获取输入的聊天内容
    const chatInput = document.getElementById("chatInput");
    const content = chatInput.value.trim();
    
    if (!content) {
        alert("不能发送空消息哦！");
        return;
    }
    
    // 获取聊天框元素
    const chatBox = document.getElementById("chatBox");
    
    // 添加用户消息气泡
    const userBubble = document.createElement("div");
    userBubble.className = "chat-bubble user";
    userBubble.textContent = content;
    chatBox.appendChild(userBubble);
    
    // 清空输入框
    chatInput.value = "";
    
    // 模拟奶龙回复
    setTimeout(() => {
        const nailongReplies = [
            "哇～😆",
            "你好有趣呀～",
            "鸡腿鸡腿！🍗",
            "好想和你一直玩～",
            "我超开心的！✨"
        ];
        const randomReply = nailongReplies[Math.floor(Math.random() * nailongReplies.length)];
        
        const nailongBubble = document.createElement("div");
        nailongBubble.className = "chat-bubble nailong";
        nailongBubble.textContent = "奶龙：" + randomReply;
        chatBox.appendChild(nailongBubble);
        
        // 滚动到聊天框底部
        chatBox.scrollTop = chatBox.scrollHeight;
        
        // 聊天次数+1（如果需要统计）
        chatCount++;
    }, 800);
    
    // 滚动到聊天框底部（用户消息）
    chatBox.scrollTop = chatBox.scrollHeight;
}