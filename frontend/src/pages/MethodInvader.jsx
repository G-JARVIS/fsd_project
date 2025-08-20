import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Rocket, Heart, Zap, AlertCircle, Skull, Snowflake } from 'lucide-react';

const bossChallenges = [
  {
    display: 'calculateSum(5, 10)',
    solution: 'public int calculateSum(int a, int b) { return a + b; }',
    hint: 'Return the sum of two integers',
  },
  {
    display: 'calculateArea(5, 10)',
    solution: 'public int calculateArea(int width, int height) { return width * height; }',
    hint: 'Return width times height',
  },
  {
    display: 'isEven(7)',
    solution: 'public boolean isEven(int num) { return num % 2 == 0; }',
    hint: 'Return true if the number is even',
  },
  {
    display: 'getMax(15, 23)',
    solution: 'public int getMax(int a, int b) { return a > b ? a : b; }',
    hint: 'Return the larger number (ternary or if/else)',
  },
  {
    display: 'reverseString("Code")',
    solution: 'public String reverseString(String str) { return new StringBuilder(str).reverse().toString(); }',
    hint: 'Reverse the input string',
  },
  {
    display: 'getMagnitude(-5)',
    solution: 'public int getMagnitude(int num) { return Math.abs(num); }',
    hint: 'Return the absolute value of the number',
  },
  {
    display: 'isPositive(1)',
    solution: 'public boolean isPositive(int num) { return num > 0; }',
    hint: 'Return true if the number is greater than zero',
  }
];

const MethodInvader = () => {
  const canvasRef = useRef(null);
  const codeEditorRef = useRef(null); 
  const [gameState, setGameState] = useState('menu'); // menu, playing, paused, gameOver
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentChallenge, setCurrentChallenge] = useState(bossChallenges[0]);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [userCode, setUserCode] = useState('');
  const [feedback, setFeedback] = useState('');
  const [highScore, setHighScore] = useState(0);
  const [isSupercharged, setIsSupercharged] = useState(false);
  const [isBossFrozen, setIsBossFrozen] = useState(false);
  const [isTyping, setIsTyping] = useState(false); 

  // Game objects
  const [player, setPlayer] = useState({ x: 375, y: 550, width: 50, height: 50 });
  const [boss, setBoss] = useState(null);
  const [bullets, setBullets] = useState([]);
  const [bossAttacks, setBossAttacks] = useState([]);
  const [particles, setParticles] = useState([]);
  const [powerups, setPowerups] = useState([]);
  const [powerupTimer, setPowerupTimer] = useState(0);

  // --- Core Game Functions ---

  const spawnBoss = () => {
    const BOSS_HEALTH = 1000; 
    setChallengeIndex(0);
    setCurrentChallenge(bossChallenges[0]);

    return {
      x: 300, y: 50, 
      width: 200, height: 100,
      health: BOSS_HEALTH,
      maxHealth: BOSS_HEALTH,
      attackSpeed: 90, // (1 second attack rate)
      attackTimer: 0,
      speed: 1.5,
      direction: 1, // 1 for right, -1 for left
    };
  };

  const nextChallenge = useCallback(() => {
    setChallengeIndex(prevIndex => {
        const newIndex = (prevIndex + 1) % bossChallenges.length;
        setCurrentChallenge(bossChallenges[newIndex]);
        return newIndex;
    });
  }, []);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setLives(3);
    setBullets([]);
    setBossAttacks([]);
    setParticles([]);
    setPowerups([]);
    setPowerupTimer(0);
    setIsSupercharged(false);
    setIsBossFrozen(false);
    setUserCode('');
    setFeedback('');
    setBoss(spawnBoss());
    setIsTyping(false);
  };

  const resetGame = () => {
    if (score > highScore) {
      setHighScore(score);
    }
    setGameState('menu');
  };
  
  // --- Update & Loop Logic ---

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      updateBullets();
      updateBossState();
      updateBossAttacks();
      updateParticles();
      updatePowerups();
      checkCollisions();
      
      // Update powerup spawn timer
      setPowerupTimer(prev => prev + 1);
      if (powerupTimer >= 600) { // 600 frames = 10 seconds at 60 FPS
        spawnPowerup();
        setPowerupTimer(0);
      }

    }, 1000 / 60); // 60 FPS

    return () => clearInterval(interval);
  }, [gameState, bullets, bossAttacks, particles, player, boss, powerups, powerupTimer, isBossFrozen, nextChallenge]);

  const updateBullets = () => {
    setBullets(prev => {
      const updatedBullets = prev.map(b => {
        // Add particles for charged shot
        if (b.isPowered && b.y % 10 === 0) {
            createExplosion(b.x, b.y + 10, '#ffccff', 5);
        }
        return { ...b, y: b.y - 12 };
      });
      return updatedBullets.filter(b => b.y > 0);
    });
  };

  const updateBossState = () => {
    setBoss(prev => {
      if (!prev) return null;
      let newBoss = { ...prev };

      // 1. Boss horizontal movement
      let newX = newBoss.x + newBoss.speed * newBoss.direction;
      let newDirection = newBoss.direction;

      if (newX <= 50 || newX >= 800 - newBoss.width - 50) {
          newDirection = -newBoss.direction;
      }
      newBoss.x = newX;
      newBoss.direction = newDirection;

      // 2. Boss attack timer (only updates if not frozen)
      if (!isBossFrozen) {
        newBoss.attackTimer = newBoss.attackTimer + 1;
        if (newBoss.attackTimer >= newBoss.attackSpeed) {
          newBoss.attackTimer = 0;
          doBossAttack(newBoss);
        }
      }
      
      return newBoss;
    });
  };

  const doBossAttack = (currentBoss) => {
    const attack = {
      x: currentBoss.x + currentBoss.width / 2 + (Math.random() - 0.5) * currentBoss.width / 2,
      y: currentBoss.y + currentBoss.height,
      width: 20,
      height: 30,
      speed: 4 + (1 - currentBoss.health / currentBoss.maxHealth) * 2, 
      color: '#ff00ff',
      type: 'projectile'
    };
    setBossAttacks(prev => [...prev, attack]);
  };

  const updateBossAttacks = () => {
    if (isBossFrozen) {
        // If frozen, attacks slow down dramatically
        setBossAttacks(prev => prev
            .map(attack => ({ ...attack, y: attack.y + 0.5 }))
            .filter(attack => attack.y < 600)
        );
    } else {
        setBossAttacks(prev => prev
            .map(attack => ({ ...attack, y: attack.y + attack.speed }))
            .filter(attack => attack.y < 600)
        );
    }
  };
  
  const spawnPowerup = () => {
    const powerup = {
        x: Math.random() * (700 - 100) + 100, // Random X position
        y: 0,
        width: 30,
        height: 30,
        speed: 2,
        type: 'freeze',
        color: '#60a5fa',
    };
    setPowerups(prev => [...prev, powerup]);
  };

  const updatePowerups = () => {
      setPowerups(prev => prev
          .map(p => ({ ...p, y: p.y + p.speed }))
          .filter(p => p.y < 600)
      );
  };


  const updateParticles = () => {
    setParticles(prev => prev
      .map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        life: p.life - 1
      }))
      .filter(p => p.life > 0)
    );
  };
  
  // --- Collision & Hit Logic ---

  const createExplosion = (x, y, color = '#fbbf24', count = 20) => {
    const newParticles = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      newParticles.push({
        x, y,
        vx: Math.cos(angle) * (count === 100 ? 4 : 2),
        vy: Math.sin(angle) * (count === 100 ? 4 : 2),
        size: count === 100 ? 5 : 3,
        life: 30,
        maxLife: 30,
        color: color
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  };

  const playerHit = () => {
    setLives(prev => {
      createExplosion(player.x + player.width / 2, player.y + player.height / 2, '#ef4444', 15);
      const newLives = prev - 1;
      if (newLives <= 0) {
        setGameState('gameOver'); 
      }
      return newLives;
    });
  };

  const activateFreeze = () => {
      setIsBossFrozen(true);
      setFeedback('BOSS FROZEN! 5 SECONDS to type your method!');
      
      setTimeout(() => {
          setIsBossFrozen(false);
          setFeedback('Freeze wore off. Boss is active!');
          setTimeout(() => setFeedback(''), 2000);
      }, 5000); // 5 seconds freeze time
  };

  const hitBoss = (bullet) => {
    const damage = bullet.isPowered ? 500 : 10; 

    setBoss(prev => {
      if (!prev) return null;

      const newHealth = prev.health - damage;
      // Emit a specific effect for charged hits
      if (bullet.isPowered) {
        createExplosion(bullet.x, bullet.y, '#ffffff', 50);
      } else {
        createExplosion(bullet.x, bullet.y, '#fbbf24');
      }

      setScore(s => s + (bullet.isPowered ? 50 : 10));

      if (newHealth <= 0) {
        createExplosion(prev.x + prev.width / 2, prev.y + prev.height / 2, '#ffffff', 100);
        setGameState('gameOver'); 
        return null;
      }

      return { ...prev, health: newHealth };
    });

    if (bullet.isPowered) {
      setIsSupercharged(false);
    }
  };

  const checkCollisions = () => {
    // 1. Bullet vs Boss Collision
    setBullets(prevBullets => {
      return prevBullets.filter(bullet => {
        if (!boss) return false;

        if (
          bullet.x > boss.x &&
          bullet.x < boss.x + boss.width &&
          bullet.y > boss.y &&
          bullet.y < boss.y + boss.height
        ) {
          hitBoss(bullet);
          return false; 
        }
        return true; 
      });
    });

    // 2. Boss Attack vs Player Collision
    setBossAttacks(prevAttacks => {
      return prevAttacks.filter(attack => {
        if (
          attack.x + attack.width > player.x &&
          attack.x < player.x + player.width &&
          attack.y + attack.height > player.y &&
          attack.y < player.y + player.height
        ) {
          playerHit();
          return false; 
        }
        return true; 
      });
    });
    
    // 3. Powerup vs Player Collision
    setPowerups(prevPowerups => {
        return prevPowerups.filter(powerup => {
            if (
                powerup.x + powerup.width > player.x &&
                powerup.x < player.x + player.width &&
                powerup.y + powerup.height > player.y &&
                powerup.y < player.y + player.height
            ) {
                activateFreeze();
                createExplosion(powerup.x + powerup.width/2, powerup.y + powerup.height/2, powerup.color, 10);
                return false;
            }
            return true;
        });
    });
  };
  
  // --- Input & Code Logic ---

  const shoot = () => {
    if (gameState !== 'playing' || isTyping) return;

    const isPowered = isSupercharged;

    setBullets(prev => [...prev, {
      x: player.x + 25,
      y: player.y,
      isPowered: isPowered,
      color: isPowered ? '#ff00ff' : '#fbbf24'
    }]);
  };

  const handleSubmitCode = () => {
    if (!currentChallenge || isSupercharged) return; 

    const simplified = userCode.replace(/\s+/g, ' ').trim().toLowerCase();
    const methodName = currentChallenge.display.split('(')[0].toLowerCase();

    // Check if the solution contains the required method name and a return type/return keyword
    const isCorrect = (
      simplified.includes(methodName) && 
      (simplified.includes('public') || simplified.includes('private')) &&
      (simplified.includes('return') || simplified.includes('void'))
    );
    
    // A much stricter check would be to check the exact solution, but the goal is to practice method structure.
    const solutionSimplified = currentChallenge.solution.replace(/\s+/g, ' ').trim().toLowerCase();
    const isPerfectMatch = simplified === solutionSimplified;


    if (isPerfectMatch || isCorrect) {
      setFeedback('✓ SUPERCHARGE ACTIVE! Fire with SPACE!');
      setIsSupercharged(true);
      setScore(prev => prev + 100);
      setUserCode('');
      nextChallenge();
      setTimeout(() => setFeedback(''), 3000);
    } else {
      setFeedback('✗ Incorrect method. Normal attack only.');
      setTimeout(() => setFeedback(''), 2000);
    }
    // Remove focus from the editor after submission
    if (codeEditorRef.current) {
        codeEditorRef.current.blur();
    }
    setIsTyping(false); 
  };

  const handleKeyPress = useCallback((e) => {
    // Only handle movement/shooting if we are playing and not actively typing
    if (gameState !== 'playing' || isTyping) return;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        setPlayer(prev => ({ ...prev, x: Math.max(0, prev.x - 20) }));
        break;
      case 'ArrowRight':
        e.preventDefault();
        setPlayer(prev => ({ ...prev, x: Math.min(800 - prev.width, prev.x + 20) }));
        break;
      case ' ':
        e.preventDefault();
        shoot();
        break;
    }
  }, [gameState, isTyping, shoot]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // --- Drawing Functions ---

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawStarfield(ctx);

    if (boss) {
        drawBoss(ctx, boss);
    }
    
    powerups.forEach(powerup => drawPowerup(ctx, powerup));
    bossAttacks.forEach(attack => drawBossAttack(ctx, attack));
    bullets.forEach(bullet => drawBullet(ctx, bullet));
    drawPlayer(ctx);
    particles.forEach(particle => drawParticle(ctx, particle));

  }, [player, bullets, boss, bossAttacks, particles, powerups, isBossFrozen]);

  const drawStarfield = (ctx) => {
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, 800, 600);
    
    for (let i = 0; i < 100; i++) {
      const x = (i * 137.5) % 800;
      const y = (i * 217.3) % 600;
      const size = (i % 3) * 0.5 + 0.5;
      ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + (i % 5) * 0.1})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawPlayer = (ctx) => {
    // Spaceship body
    ctx.fillStyle = isSupercharged ? '#ff00ff' : '#4ade80';
    ctx.beginPath();
    ctx.moveTo(player.x + 25, player.y);
    ctx.lineTo(player.x + 45, player.y + 40);
    ctx.lineTo(player.x + 5, player.y + 40);
    ctx.closePath();
    ctx.fill();

    // Cockpit
    ctx.fillStyle = '#60a5fa';
    ctx.beginPath();
    ctx.arc(player.x + 25, player.y + 15, 8, 0, Math.PI * 2);
    ctx.fill();

    // Wings
    ctx.fillStyle = isSupercharged ? '#ff00ff' : '#22c55e';
    ctx.beginPath();
    ctx.moveTo(player.x, player.y + 35);
    ctx.lineTo(player.x + 5, player.y + 25);
    ctx.lineTo(player.x + 5, player.y + 40);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(player.x + 50, player.y + 35);
    ctx.lineTo(player.x + 45, player.y + 25);
    ctx.lineTo(player.x + 45, player.y + 40);
    ctx.closePath();
    ctx.fill();
  };

  const drawBullet = (ctx, bullet) => {
    const color = bullet.isPowered ? '#ffff00' : '#fbbf24'; // Brighter charged color
    ctx.fillStyle = color;
    ctx.shadowBlur = bullet.isPowered ? 25 : 10;
    ctx.shadowColor = color;
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, bullet.isPowered ? 8 : 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  };
  
  const drawBossAttack = (ctx, attack) => {
    ctx.fillStyle = isBossFrozen ? '#00FFFF' : attack.color;
    ctx.shadowBlur = 15;
    ctx.shadowColor = isBossFrozen ? '#00FFFF' : attack.color;
    ctx.fillRect(attack.x - attack.width/2, attack.y, attack.width, attack.height);
    ctx.shadowBlur = 0;
  };

  const drawPowerup = (ctx, powerup) => {
      ctx.fillStyle = powerup.color;
      ctx.shadowBlur = 15;
      ctx.shadowColor = powerup.color;
      ctx.beginPath();
      ctx.arc(powerup.x + powerup.width/2, powerup.y + powerup.height/2, powerup.width/2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      
      // Draw snowflake icon (simple square cross for simplicity)
      ctx.fillStyle = '#fff';
      ctx.fillRect(powerup.x + 10, powerup.y + 14, 10, 2);
      ctx.fillRect(powerup.x + 14, powerup.y + 10, 2, 10);
  };

  const drawBoss = (ctx, boss) => {
    const size = 100; 
    const bodyColor = isBossFrozen ? '#60a5fa' : '#ef4444'; // Boss color changes when frozen

    // Boss Body
    ctx.fillStyle = bodyColor;
    ctx.shadowBlur = 20;
    ctx.shadowColor = bodyColor;
    ctx.beginPath();
    ctx.ellipse(boss.x + boss.width/2, boss.y + size/2 + 10, size, size * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = isBossFrozen ? '#93c5fd' : '#fef08a';
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(boss.x + boss.width/2 - 30, boss.y + 35, 15, 0, Math.PI * 2);
    ctx.arc(boss.x + boss.width/2 + 30, boss.y + 35, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Pupils
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(boss.x + boss.width/2 - 30, boss.y + 35, 5, 0, Math.PI * 2);
    ctx.arc(boss.x + boss.width/2 + 30, boss.y + 35, 5, 0, Math.PI * 2);
    ctx.fill();

    // Health bar
    const healthWidth = boss.width * (boss.health / boss.maxHealth);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(boss.x, boss.y - 15, boss.width, 10);
    ctx.fillStyle = boss.health > boss.maxHealth * 0.3 ? '#4ade80' : '#ef4444';
    ctx.fillRect(boss.x, boss.y - 15, healthWidth, 10);
    
    // Challenge text (positioned below boss)
    if (currentChallenge) {
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`TARGET: ${currentChallenge.display}`, boss.x + boss.width / 2, boss.y + boss.height + 40);
    }
  };


  const drawParticle = (ctx, particle) => {
    ctx.fillStyle = particle.color;
    ctx.globalAlpha = particle.life / particle.maxLife;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  };

  // --- Component Render ---

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {gameState === 'menu' && (
          <div className="text-center space-y-8 animate-fade-in text-white">
            <div className="space-y-4">
              <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                Method Boss Battle
              </h1>
              <p className="text-xl text-purple-300">Defeat the Invader with Supercharged Methods!</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 space-y-4 border border-purple-500/20">
              <h2 className="text-2xl font-bold text-purple-300">How to Play</h2>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div className="space-y-2">
                  <p className="text-purple-200">🎮 <strong>Controls:</strong></p>
                  <ul className="text-sm text-purple-300 space-y-1 ml-4 list-disc list-inside">
                    <li>← → Arrow keys to <b>DODGE</b> Boss Attacks</li>
                    <li>SPACE to fire <b>Normal attacks</b></li>
                    <li>Click or Tab out of the editor to regain ship control.</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="text-purple-200">🎯 <strong>Supercharge Objective:</strong></p>
                  <ul className="text-sm text-purple-300 space-y-1 ml-4 list-disc list-inside">
                    <li>Input the correct method to activate <b>Supercharge</b> (50x damage).</li>
                    <li>Collect the <b>Blue Power-up</b> (<Snowflake className='inline w-4 h-4 text-blue-400' />) to freeze the Boss for 5 seconds!</li>
                  </ul>
                </div>
              </div>
            </div>

            {highScore > 0 && (
              <div className="text-2xl text-yellow-400 flex items-center justify-center gap-2">
                <Skull className="w-6 h-6" />
                Highest Score: {highScore}
              </div>
            )}

            <button
              onClick={startGame}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xl rounded-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all shadow-lg"
            >
              <Rocket className="inline mr-2" /> Start Boss Fight
            </button>
          </div>
        )}

        {(gameState === 'playing' || gameState === 'gameOver') && (
          <div className="space-y-4">
            {/* Stats Bar */}
            <div className="flex justify-between items-center bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-purple-500/20">
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="text-white font-bold text-xl">{lives}</span>
                </div>
                <div className={`flex items-center gap-2 font-bold transition-colors ${isBossFrozen ? 'text-blue-400' : 'text-gray-400'}`}>
                    <Snowflake className='w-5 h-5' />
                    {isBossFrozen ? 'FROZEN!' : 'Active'}
                </div>
              </div>
              <div className="text-2xl font-bold text-yellow-400">Score: {score}</div>
              <div className="flex items-center gap-2">
                <Zap className={`w-5 h-5 ${isSupercharged ? 'text-yellow-400 animate-pulse' : 'text-gray-500'}`} />
                <span className={`font-bold ${isSupercharged ? 'text-yellow-400' : 'text-gray-400'}`}>
                  Supercharge: {isSupercharged ? 'READY' : 'CHARGING'}
                </span>
              </div>
            </div>

            {/* Game Canvas */}
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className="w-full border-4 border-purple-500/30 rounded-lg shadow-2xl"
            />

            {/* Code Editor */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-purple-500/20 space-y-3">
              {currentChallenge && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-purple-300">
                      Method Challenge: <span className="text-red-400">{currentChallenge.display}</span>
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-purple-400">
                      <AlertCircle className="w-4 h-4" />
                      {currentChallenge.hint}
                    </div>
                  </div>
                </div>
              )}
              
              <textarea
                ref={codeEditorRef}
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                onFocus={() => setIsTyping(true)}
                onBlur={() => setIsTyping(false)}
                placeholder="Write your method here (e.g., public int add(int a, int b) { return a+b; })..."
                className="w-full h-24 bg-slate-900 text-green-400 font-mono text-sm p-3 rounded border border-purple-500/30 focus:border-purple-500 focus:outline-none resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    e.preventDefault();
                    handleSubmitCode();
                  }
                }}
                disabled={isSupercharged}
              />
              
              <div className="flex justify-between items-center">
                <button
                  onClick={handleSubmitCode}
                  className={`px-6 py-2 font-bold rounded-lg transition-all ${isSupercharged 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                  disabled={isSupercharged}
                >
                  Execute Method (Ctrl+Enter)
                </button>
                
                {feedback && (
                  <div className={`font-bold text-center ${feedback.startsWith('✓') ? 'text-green-400' : (feedback.includes('FROZEN') ? 'text-blue-400' : 'text-red-400')}`}>
                    {feedback}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {gameState === 'gameOver' && (
          <div className="text-center space-y-8 animate-fade-in text-white">
            {boss && boss.health > 0 ? (
                <h2 className="text-5xl font-bold text-red-500">Mission Failed!</h2>
            ) : (
                <h2 className="text-5xl font-bold text-green-400">BOSS DEFEATED! Victory!</h2>
            )}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 space-y-4 border border-purple-500/20">
              <p className="text-3xl text-purple-300">Final Score: {score}</p>
              {score > highScore && (
                <p className="text-2xl text-yellow-400 flex items-center justify-center gap-2">
                  <Skull className="w-6 h-6" /> New High Score!
                </p>
              )}
            </div>
            <button
              onClick={resetGame}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xl rounded-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all"
            >
              Return to Menu
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MethodInvader;