const BAR_LENGTH = 20; // スマホの表示的にこれぐらいがちょうどいい感じ
const WEBHOOK_URL = "URL";

const getYearStart = (year) => new Date(year, 0, 1);
const getYearEnd = (year) => new Date(year, 11, 31);

// mod 12の剰余で0:申~で求められる
const etoEmojis = ["🐵", "🐔", "🐶", "🐷", "🐭", "🐮", "🐯", "🐰", "🐲", "🐍", "🐴", "🐑"];

const getEtoEmoji = (year) => etoEmojis[year % 12];

const calculateEtoPosition = (progress) => {
    const position = Math.floor(progress * (BAR_LENGTH - 1));
    return Math.max(0, Math.min(position, BAR_LENGTH - 1));
};

// webhook周りはちゃんと非同期でやったほうがいいらしい
const postWebhook = async (url, data) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(`Failed to post webhook: ${response.status}`);
    }
}

const today = new Date();
const currentYear = today.getFullYear();

const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);

const yearStart = getYearStart(currentYear);
const yearEnd = getYearEnd(currentYear);

const totalYearMilliseconds = yearEnd - yearStart;
const todayProgress = (today - yearStart) / totalYearMilliseconds;
const todayProgressPercent = Math.floor(todayProgress * 100);
const yesterdayProgress = (yesterday - yearStart) / totalYearMilliseconds;
const yesterdayProgressPercent = Math.floor(yesterdayProgress * 100);

// 進捗率が昨日から変わった場合にのみ表示(n%が続くと嫌なので)
if (todayProgressPercent !== yesterdayProgressPercent) {
    const progressArray = Array(BAR_LENGTH).fill("＿");
    const etoEmoji = getEtoEmoji(currentYear);
    const etoPosition = calculateEtoPosition(todayProgress);
    
    if (etoPosition == 0 || etoPosition == BAR_LENGTH - 1) {
        progressArray[etoPosition] = etoEmoji;
    } else {
        progressArray[etoPosition - 1] = "…";
        progressArray[etoPosition] = etoEmoji;
    }

    const progressBar = `←${currentYear - 1}${progressArray.join('')}${currentYear + 1}→`;

    const message = `${currentYear} is ${todayProgressPercent}% complete. \n${progressBar}`;
    console.log(message);
    (async () => {
        await postWebhook(WEBHOOK_URL, {
            content: message,
        });
    }
    )();
}
