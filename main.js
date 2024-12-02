const BAR_LENGTH = 20;

// 年初の日付を取得
const getYearStart = (year) => new Date(year, 0, 1);

// 年末の日付を取得
const getYearEnd = (year) => new Date(year, 11, 31);

// 干支の絵文字リスト（申年から始まる順）
const etoEmojis = ["🐵", "🐔", "🐶", "🐷", "🐭", "🐮", "🐯", "🐰", "🐲", "🐍", "🐴", "🐑"];

// 干支の絵文字を取得する関数
const getEtoEmoji = (year) => etoEmojis[year % 12];

// 進捗バーの位置を計算する関数
const calculateEtoPosition = (progress) => {
    const position = Math.floor(progress * (BAR_LENGTH - 1));
    return Math.max(0, Math.min(position, BAR_LENGTH - 1));
};

const today = new Date();
const currentYear = today.getFullYear();

// 昨日の日付を取得
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);

const yearStart = getYearStart(currentYear);
const yearEnd = getYearEnd(currentYear);

const totalYearMilliseconds = yearEnd - yearStart;
const todayProgress = (today - yearStart) / totalYearMilliseconds;
const todayProgressPercent = Math.floor(todayProgress * 100); // 百分率に変換
const yesterdayProgress = (yesterday - yearStart) / totalYearMilliseconds;
const yesterdayProgressPercent = Math.floor(yesterdayProgress * 100); // 百分率に変換

// 進捗率が昨日から変わった場合にのみ表示
if (todayProgressPercent !== yesterdayProgressPercent) {
    const progressArray = Array(BAR_LENGTH).fill("＿");
    const etoEmoji = getEtoEmoji(currentYear);
    const etoPosition = calculateEtoPosition(todayProgress);
    progressArray[etoPosition] = etoEmoji;

    const progressBar = `←${currentYear - 1}${progressArray.join('')}${currentYear + 1}→`;

    console.log(`今日で${currentYear}年の${todayProgressPercent}%が経過しました。\n${progressBar}`);
}
