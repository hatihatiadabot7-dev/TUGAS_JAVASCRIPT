// ========================================
// Student Data Processor
// Nama   : Ahmad Fauzan
// Kelas  : XI Rombel 1
// ========================================
// 📦 Data Awal
const studentName = "  aHmAd fAuZaN  ";
const ageText = "17 tahun";
const scoreText = "85.678";
const registrationText = "21-08-2026";

// 🧹 Clean the Name & Username
// Bersihin spasi dan rapihin huruf kapital
let words = studentName.trim().toLowerCase().split(" ");
let cleanFirstName = words[0].charAt(0).toUpperCase() + words[0].slice(1);
let cleanLastName = words[1].charAt(0).toUpperCase() + words[1].slice(1);
const cleanName = [cleanFirstName, cleanLastName].join(" ");

// Buat username dari clean name
const username = cleanName.toLowerCase().split(" ").join(".");

// 🔍 Analyze the Name
const containsAhmad = cleanName.includes("Ahmad");
const first5Chars = cleanName.slice(0, 5);
const replacementName = cleanName.replace("Ahmad", "Budi");

// 🎂 Process the Age & Birth Year
const age = parseInt(ageText);
const currentYear = new Date().getFullYear();
const birthYear = currentYear - age;

// 📊 Process the Score & Rounding
const originalScore = parseFloat(scoreText);
const formattedScore = originalScore.toFixed(2);

const roundScore = Math.round(originalScore);
const floorScore = Math.floor(originalScore);
const ceilScore = Math.ceil(originalScore);

// 🏆 Determine the Grade
let grade = "";
if (originalScore >= 90) {
    grade = "A";
} else if (originalScore >= 80) {
    grade = "B";
} else if (originalScore >= 70) {
    grade = "C";
} else if (originalScore >= 60) {
    grade = "D";
} else {
    grade = "E";
}

// 📅 Process Registration Date
const regParts = registrationText.split("-");
const regDay = Number(regParts[0]);
const regMonth = Number(regParts[1]);
const regYear = Number(regParts[2]);

// ⏰ Current Date & Time
const now = new Date();
const currentReportYear = now.getFullYear();
const currentReportMonth = now.getMonth() + 1; // getMonth() mulai dari 0
const currentReportDate = now.getDate();
const currentReportDay = now.getDay();

// Format jam dan menit dengan padStart
const hoursStr = String(now.getHours()).padStart(2, '0');
const minutesStr = String(now.getMinutes()).padStart(2, '0');
const timeFormatted = `${hoursStr}:${minutesStr}`;

// 📅 Create Date Formatter Function
function formatDate(date) {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = String(date.getFullYear());
    return `${d}/${m}/${y}`;
}
const formattedRegDate = `${String(regDay).padStart(2, '0')}/${String(regMonth).padStart(2, '0')}/${regYear}`;
const reportDateFormatted = formatDate(now);
// 🎲 Lucky Dice
const dice = Math.floor(Math.random() * 6) + 1;
let diceResult = "";

if (dice === 6) {
    diceResult = "🔥 JACKPOT!";
} else if (dice === 1) {
    diceResult = "💀 BAD LUCK!";
} else {
    diceResult = "😎 GOOD LUCK!";
}
// ⭐ BONUS KREATIVITAS — Generate Email & Status Kelulusan
const generatedEmail = `${username}@hsi.sch.id`;
const isPassed = originalScore >= 70 ? "LULUS 🎉" : "TIDAK LULUS ❌";


// 🖥️ FINAL REPORT
console.log("╔════════════════════════════════════╗");
console.log("║      🎓 STUDENT DATA PROCESSOR     ║");
console.log("╚════════════════════════════════════╝");

console.log("👤 STUDENT");
console.log("────────────────────────────────────");
console.log(`Original Name : "${studentName}"`);
console.log(`Clean Name    : ${cleanName}`);
console.log(`Username      : ${username}`);
console.log(`Email (Bonus) : ${generatedEmail}`);

console.log("\n🔎 NAME ANALYSIS");
console.log("────────────────────────────────────");
console.log(`Contains Ahmad : ${containsAhmad}`);
console.log(`First 5 chars  : ${first5Chars}`);
console.log(`Replacement    : ${replacementName}`);

console.log("\n🎂 AGE");
console.log("────────────────────────────────────");
console.log(`Age Text       : ${ageText}`);
console.log(`Age            : ${age}`);
console.log(`Birth Year     : ${birthYear}`);

console.log("\n📊 SCORE");
console.log("────────────────────────────────────");
console.log(`Original Score : ${originalScore}`);
console.log(`Formatted      : ${formattedScore}`);
console.log(`Round          : ${roundScore}`);
console.log(`Floor          : ${floorScore}`);
console.log(`Ceil           : ${ceilScore}`);
console.log(`Grade          : ${grade}`);
console.log(`Status (Bonus) : ${isPassed}`);

console.log("\n📅 REGISTRATION");
console.log("────────────────────────────────────");
console.log(`Date           : ${formattedRegDate}`);

console.log("\n🕐 REPORT GENERATED");
console.log("────────────────────────────────────");
console.log(`Date           : ${reportDateFormatted}`);
console.log(`Time           : ${timeFormatted}`);

console.log("\n🎲 LUCKY DICE");
console.log("────────────────────────────────────");
console.log(`Dice           : ${dice}`);
console.log(`Result         : ${diceResult}`);

console.log("╔════════════════════════════════════╗");
console.log("║       🚀 PROCESS COMPLETE!         ║");
console.log("╚════════════════════════════════════╝");