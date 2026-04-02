/**
 * ⚡ 閃電水電行 - 魔王挑戰版 ⚡
 */

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('⚡ 閃電水電行 ⚡')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function solveProblem(missionId, battery, bulb) {
  let isSuccess = false;
  let responseText = ""; 
  let star = "⭐";
  let logicNote = "";

  const missionDb = {
    // --- 持久組 ---
    "阿嬤的鬧鐘": { logic: "電池並聯：體力變持久。", win: "「太專業了！」王阿嬤要送你一包茶葉！", lose: "「老闆...鬧鐘兩天就停了。」", target: { bat: "並聯" } },
    "露營客": { logic: "電池並聯：讓營地燈可以連續亮好幾晚。", win: "「專業！」這組燈撐過了大雪山三天兩夜！", lose: "「老闆，第一晚就沒電了。」", target: { bat: "並聯" } },
    "玩具收藏家": { logic: "電池並聯：保護珍貴收藏。", win: "「完美！」音樂盒的聲音穩定又持久。", lose: "「才聽幾次就沒電力了...」", target: { bat: "並聯" } },
    "外送員阿強": { logic: "電池並聯：亮整晚的好夥伴。", win: "「謝啦老闆！」阿強說跑宵夜場完全不擔心。", lose: "「老闆，跑到一半燈就熄了。」", target: { bat: "並聯" } },
    "路燈管理員": { logic: "電池並聯：穩定撐到日出。", win: "「管理處很滿意！」路燈現在非常穩定。", lose: "「路燈半夜就滅了。」", target: { bat: "並聯" } },
    // --- 力量組 ---
    "小明的賽車": { logic: "電池串聯：疊加力量爆發速度。", win: "「衝啊！」小明拿了第一名！", lose: "「老闆，這速度慢死了...」", target: { bat: "串聯" } },
    "警衛大叔": { logic: "電池串聯：讓手電筒射得又遠又亮。", win: "「太亮了！」大叔連停車場小貓都看得到。", lose: "「老闆，這光照不到十步遠。」", target: { bat: "串聯" } },
    "燈籠小妹": { logic: "電池串聯：爆發出最閃耀的亮度。", win: "「我是螢光小公主！」小妹開心得跳舞。", lose: "「我的燈籠暗暗的...」", target: { bat: "串聯" } },
    "攝影師阿賓": { logic: "電池串聯：提供瞬間高壓。", win: "「這就是我要的光！」攝影師超滿意。", lose: "「補光力道不足。」", target: { bat: "串聯" } },
    // --- 獨立組 ---
    "陳伯伯": { logic: "燈泡並聯：互不干擾，壞一顆也亮。", win: "「太安心了！」壞了一顆還能繼續看報。", lose: "「一顆燈壞全家黑，我差點絆倒。」", target: { bul: "並聯" } },
    "聖誕小精靈": { logic: "燈泡並聯：一顆壞掉也不毀掉全場。", win: "「聖誕節得救了！」整棵樹閃閃發亮。", lose: "「老闆，一顆不亮全線陣亡。」", target: { bul: "並聯" } },
    "地下室住戶": { logic: "燈泡並聯：走道燈必須獨立供電。", win: "「很有安全感！」老闆萬歲！", lose: "「上次壞一顆就全黑，困在裡面超久！」", target: { bul: "並聯" } },
    // --- 柔光組 ---
    "林阿姨": { logic: "燈泡串聯：分電讓光線柔和不刺眼。", win: "「就是這個光！」溫馨又不刺眼。", lose: "「太亮了！眼睛快瞎了。」", target: { bul: "串聯" } },
    "科展同學": { logic: "燈泡串聯：實驗分壓原理。", win: "「報告拿高分！」精準觀察到亮度變化。", lose: "「接法錯了，結果跟課本不一樣。」", target: { bul: "串聯" } },
    "睡前讀者": { logic: "燈泡串聯：打造舒眠的暗光。", win: "「好舒服。」讀者說現在能安穩睡著。", lose: "「這亮度像工地，根本睡不著！」", target: { bul: "串聯" } },
    // --- 魔王題 ---
    "演唱會歌手": {
      logic: "最強組合：電池串聯(最強推力) + 燈泡並聯(最強亮度)。",
      win: "「震撼全場！」最強光芒讓觀眾瘋狂，老闆太強了！",
      middle: "「還可以，但總覺得老闆技術還能再精進？」對了一半。",
      lose: "「這燈光微弱到在過清明節嗎？」全場噓聲。",
      target: { bat: "串聯", bul: "並聯" }
    }
  };

  const m = missionDb[missionId];
  logicNote = m.logic;

  if (missionId === "演唱會歌手") {
    if (battery === m.target.bat && bulb === m.target.bul) { isSuccess = true; responseText = m.win; star = "⭐⭐⭐"; }
    else if (battery === m.target.bat || bulb === m.target.bul) { responseText = m.middle; star = "⭐⭐"; }
    else { responseText = m.lose; star = "⭐"; }
  } else {
    const isBatOk = m.target.bat ? (battery === m.target.bat) : true;
    const isBulOk = m.target.bul ? (bulb === m.target.bul) : true;
    if (isBatOk && isBulOk) { isSuccess = true; responseText = m.win; star = "⭐⭐⭐"; }
    else { responseText = m.lose; star = "⭐"; }
  }

  return { success: isSuccess, text: responseText, rank: star, logic: logicNote };
}
