const students = [
    {
        name: "Aisy",
        className: "10-A",
        scores: [80, 90, 85],
        attendance: 90,
        hasViolation: false
    },
    {
        name: "Budi",
        className: "10-B",
        scores: [75, 90, 80],
        attendance: 90,
        hasViolation: false
    },
    {
        name: "Ujang",
        className: "10-C",
        scores: [70, 80, 80],
        attendance: 85,
        hasViolation: false
    }
];

const reportDate = new Date();

console.log('============================================');
console.log('       HSI STUDENT REPORT CARD              ');
console.log('============================================');
console.log(`Tanggal : ${reportDate.toLocaleDateString('id-ID')}\n`);

// Gunakan students.length (bukan .at.length)
for (let i = 0; i < students.length; i++) {
    let totalScore = 0;

    for (let j = 0; j < students[i].scores.length; j++) {
        totalScore += students[i].scores[j];
    }
    
    const average = totalScore / students[i].scores.length;
    
    let grade = "";
    if (average >= 90) {
        grade = "A";
    } else if (average >= 80) {
        grade = "B";
    } else if (average >= 70) {
        grade = "C";
    } else {
        grade = "D";
    }

    let status = "";
    if (average >= 75 && students[i].attendance >= 80 && !students[i].hasViolation) {
        status = "Lulus 🎉";
    } else {
        status = "Tidak Lulus ❌";
    }

    console.log(`Student #${i + 1}`);
    console.log(`Nama       : ${students[i].name}`);
    console.log(`Kelas      : ${students[i].className}`);
    console.log(`Nilai      : ${students[i].scores.join(', ')}`);
    console.log(`Total      : ${totalScore}`);
    console.log(`Rata-rata  : ${average.toFixed(2)}`);
    console.log(`Grade      : ${grade}`);
    console.log(`Kehadiran  : ${students[i].attendance}%`);
    console.log(`Pelanggaran: ${students[i].hasViolation ? "Ada" : "Tidak Ada"}`);
    console.log(`Status     : ${status}`);
    console.log(`-------------------------------------------`);
}