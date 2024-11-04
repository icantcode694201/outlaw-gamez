function checkAchievements(score) {
    const achievements = [
        { name: "Candy Apprentice", threshold: 100 },
        { name: "Sweet Success", threshold: 500 },
        { name: "Sour Specialist", threshold: 1000 },
        { name: "Gummy Guru", threshold: 5000 },
        { name: "Lollipop Legend", threshold: 10000 },
        { name: "Candy Conqueror", threshold: 50000 }
    ];

    return achievements.filter(achievement => score >= achievement.threshold);
}