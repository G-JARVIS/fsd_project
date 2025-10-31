// Test XP calculation logic
const testXPCalculation = (currentXP, currentLevel, xpEarned) => {
  console.log(`\n--- Test Case ---`);
  console.log(`Current XP: ${currentXP}, Current Level: ${currentLevel}, XP Earned: ${xpEarned}`);
  
  const totalXP = currentXP + xpEarned;
  console.log(`Total XP: ${totalXP}`);
  
  let newLevel = currentLevel;
  let finalXP = totalXP;
  let leveledUp = false;
  
  if (totalXP >= 1000) {
    const levelsToIncrease = Math.floor(totalXP / 1000);
    newLevel = currentLevel + levelsToIncrease;
    finalXP = totalXP % 1000;
    leveledUp = levelsToIncrease > 0;
  }
  
  console.log(`Result: Level ${newLevel}, XP: ${finalXP}, Leveled Up: ${leveledUp}`);
  
  return { newLevel, finalXP, leveledUp, totalXP };
};

// Test cases
console.log('=== XP Calculation Tests ===');

// Test case 1: Your example (980 + 80 = 1060)
testXPCalculation(980, 1, 80);

// Test case 2: No level up (500 + 300 = 800)
testXPCalculation(500, 1, 300);

// Test case 3: Multiple level ups (900 + 2200 = 3100)
testXPCalculation(900, 1, 2200);

// Test case 4: Exact level up (900 + 100 = 1000)
testXPCalculation(900, 1, 100);

// Test case 5: Already high level (1500 + 800 = 2300, but stored as 500 + 800 = 1300)
testXPCalculation(500, 2, 800);

console.log('\n=== Tests Complete ===');