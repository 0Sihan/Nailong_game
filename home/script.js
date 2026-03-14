// 全局变量
let currentUser = "";
let legCount = 0;
let energyCount = 0;
let chatCount = 0;
let currentDay = 1;

// 核心：强制刷新所有数据和DOM显示
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

    // ====================== 第8天 → 直接跳转到结局页面 ======================
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
        window.location.href = "make_leg_1.html";
    } else if (count === 1) {
        window.location.href = "co2ok.html";
    } else if (count === 2) {
        window.location.href = "cook3.html";
    } else {
        window.location.href = "cook.html";
    }
}

function jumpToAdventure() {
    window.location.href = "adventure.html";
}

// 加载日记
function loadDiary(diaries) {
}