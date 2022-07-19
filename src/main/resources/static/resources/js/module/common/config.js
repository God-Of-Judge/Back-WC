let host = location.hostname;
let key = "";
let isRealServer = true;
let isSyncFlag = true; // 2019.06.07 Raccoon : /fav/sync 부분 로그인시 단 한번만 호출하기 위함

switch (host) {
    default:
        key = ""; //카카오 api key 등록
        isRealServer = false;
        break;
}
window.DAUMKEY = key;
window.isRealServer = isRealServer;
window.isSyncFlag = isSyncFlag;