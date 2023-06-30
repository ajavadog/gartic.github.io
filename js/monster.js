class Monster {
  constructor(name, baseHealth, skills, imagePath, evolveTo, evolveLevel, learnableSkills, type, level, prob) {
    this.name = name;
    this.nowHealth = baseHealth
    this.level = level;
    this.baseHealth = this.calculateBaseHealth(this.level);
    this.currentHealth = this.baseHealth;
    this.skills = skills;
    this.image = new Image();
    this.image.src = imagePath;
    this.evolveTo = evolveTo;
    this.evolveLevel = evolveLevel;
    this.experience = 0;
    this.maxExperience = this.calculateMaxExperience(this.level);
    this.animationInProgress = false;
    this.animationafterProgress = false;
    this.learnableSkills = learnableSkills;
    this.type = type;
    this.prob = prob;
  }

  calculateBaseHealth(level) {
    // Example: Calculate base health based on the current level
    // You can adjust the formula to control the health curve
    return Math.floor(this.nowHealth * (1 + 0.1 * (level - 1)));
  }


  draw(ctx, x, y, width, height) {
    if (this.evolving) {
      const flashFrequency = 10; // Adjust this value to control the speed of the flashing effect
      if (Math.floor(this.evolutionAnimationCounter / flashFrequency) % 2 === 0) {
        ctx.drawImage(this.image, x, y, width, height);
      }
      this.evolutionAnimationCounter++;
      if (this.evolutionAnimationCounter > this.evolutionAnimationDuration) {
        this.evolving = false;
        this.evolutionAnimationCounter = 0;
      } else if (this.evolutionAnimationCounter > this.evolutionAnimationDuration - 500){
        console.log("check it")
        this.evolve();
        ctx.drawImage(this.image, x, y, width, height);
        this.animationafterProgress = true;
      }
    } else {
      ctx.drawImage(this.image, x, y, width, height);
    }
  }


  evolve() {
    if (this.evolveTo !== null && this.level >= this.evolveLevel) {
      const evolvedMonsterData = monsterDictionary[this.evolveTo];
      this.name = evolvedMonsterData.name;
      this.nowHealth = evolvedMonsterData.baseHealth;
      this.baseHealth = this.calculateBaseHealth(this.level);
      this.currentHealth = evolvedMonsterData.baseHealth;
      this.skills = this.skills;
      this.image.src = evolvedMonsterData.imagePath;
      this.evolveTo = evolvedMonsterData.evolveTo;
      this.evolveLevel = evolvedMonsterData.evolveLevel;
      // console.log(`${this.name} has evolved to ${evolvedMonsterData.name}!`);
    }
  }

  async evolveAnimation() {
    this.evolving = true;
    this.evolutionAnimationCounter = 0;
    this.evolutionAnimationDuration = 700; // Adjust this value to control the duration of the animation
    this.animationInProgress = true;

    await new Promise((resolve) => {
      const interval = setInterval(() => {
        if (!this.evolving) {
          clearInterval(interval);
          resolve();
        }
      }, 1000 / 60); // 60 FPS
    });

    
    this.animationInProgress = false;
    this.animationafterProgress = false;
  }

  gainExperience(exp) {
    this.experience += exp;
    if (this.experience >= this.maxExperience) {
      this.levelUp();
    }
  }

  hasSkill(skillName) {
    return this.skills.some(skill => skill.name === skillName);
  }

  async levelUp() {
    this.level++;
    this.experience = 0;
    this.maxExperience = this.calculateMaxExperience(this.level);
    this.baseHealth = this.calculateBaseHealth(this.level);

    for (const skill of this.learnableSkills) {
      if (skill.level <= this.level) {
        this.learnSkill(skill.skill);
      }
    }

    if (this.evolveTo !== null && this.level >= this.evolveLevel) {
      await this.evolveAnimation();
    }
  }

  learnSkill(newSkill) {
    if (this.hasSkill(newSkill.name)) {
      return;
    }

    if (this.skills.length < 4) {
      this.skills.push(newSkill);
    } else {
      // You can implement a skill selection menu here for the player to choose which skill to replace
      const skillToReplaceIndex = 0; // Replace this with the player's choice
      this.skills[skillToReplaceIndex] = newSkill;
    }
  }

  calculateMaxExperience(level) {
    // Example: Calculate max experience based on the current level
    // You can adjust the formula to control the experience curve
    return Math.floor(50 * Math.pow(level, 1.2));
  }

  isAlive() {
    return this.currentHealth > 0;
  }
}



const skill1 = new Skill('棉花攻擊', 30, 30,'可愛', '敵人', 'assets/images/skills/carrot.png');//   高冷<->瑟瑟  ->可愛->帥氣->抖M->傲嬌
const skill2 = new Skill('漏電拳', 40, 20, '瑟瑟', '敵人', 'assets/images/skills/leafknife.png');
const skill3 = new Skill('棉花防守', 0, 20, '瑟瑟', '自身', 'assets/images/skills/thundershock.png');//來自敵人傷害減半2回合
const skill4 = new Skill('千鈞暴雷震', 150, 5, '瑟瑟', '敵人', 'assets/images/skills/bubble.png');//自傷1/5

const skill5 = new Skill('錨起來打', 30, 20, '可愛', '敵人', 'assets/images/skills/sandattack.png');
const skill6 = new Skill('髮束縛', 0, 5, '可愛', '敵人', 'assets/images/skills/firepunch.png');//使敵人75%無法動彈2回合
const skill7 = new Skill('大不列顛迴旋攻擊',120 ,10, '抖M', '敵人', 'assets/images/skills/razorleaf.png');//自傷1/5
const skill8 = new Heal('入土為安', 100, 5, '可愛', '自身', 'assets/images/skills/thunderpunch.png');//回總血量一半

const skill9 = new Skill('拔蘿蔔', 30, 30, '可愛', '敵人', 'assets/images/skills/watergun.png');// 1.5%即死
const skill10 = new Skill('too甜配cola', 0,2, '可愛', '敵人', 'assets/images/skills/sandtomb.png');//減少30%(5回)
const skill11 = new Skill('吃蘿蔔',70 ,5, '可愛', '自身', 'assets/images/skills/flamethrower.png');//回總血量1/3
const skill12 = new Skill('苗疆殺人兔',100, 5, '可愛', '敵人', 'assets/images/skills/leafblade.png');//命中率40%

const skill13 = new Skill('', 60, 8, '病嬌', '敵人', 'assets/images/skills/thunderbolt.png');
const skill14 = new Skill('', 60, 8, '瑟瑟', '敵人', 'assets/images/skills/waterpulse.png');
const skill15 = new Skill('', 60, 5, '帥氣', '敵人', 'assets/images/skills/scorchingsands.png');
const skill16 = new Skill('', 80, 8, '高冷', '敵人', 'assets/images/skills/blastburn.png');

const skill17 = new Skill('', 200, 8, '可愛', '敵人', 'assets/images/skills/leafstorm.png');
const skill18 = new Skill('', 80, 5, '病嬌', '敵人', 'assets/images/skills/thunder.png');
const skill19 = new Skill('', 80, 8, '瑟瑟', '敵人', 'assets/images/skills/wavecrash.png');

const skill20 = new Skill('', 80, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');
const skill21 = new Skill('', 200, 8, '可愛', '敵人', 'assets/images/skills/leafstorm.png');
const skill22 = new Skill('', 80, 5, '病嬌', '敵人', 'assets/images/skills/thunder.png');

const skill23 = new Skill('', 80, 8, '瑟瑟', '敵人', 'assets/images/skills/wavecrash.png');
const skill24 = new Skill('', 80, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');
const skill25 = new Skill('', 50, 8, '帥氣', '自身', 'assets/images/skills/earthquake.png');
const skill26 = new Skill('', 50, 8, '帥氣', '自身', 'assets/images/skills/earthquake.png');

const skill27 = new Skill('', 80, 8, '瑟瑟', '敵人', 'assets/images/skills/wavecrash.png');
const skill28 = new Skill('', 80, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');
const skill29 = new Skill('', 50, 8, '帥氣', '自身', 'assets/images/skills/earthquake.png');

const skill30 = new Skill('', 50, 8, '帥氣', '自身', 'assets/images/skills/earthquake.png');
const skill31 = new Skill('', 80, 8, '瑟瑟', '敵人', 'assets/images/skills/wavecrash.png');
const skill32 = new Skill('', 80, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');
const skill33 = new Skill('', 50, 8, '帥氣', '自身', 'assets/images/skills/earthquake.png');

const skill34 = new Skill('', 50, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');
const skill35 = new Skill('', 50, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');
const skill36 = new Skill('', 50, 8, '帥氣', '自身', 'assets/images/skills/earthquake.png');

const skill37 = new Skill('', 50, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');
const skill38 = new Skill('', 80, 8, '瑟瑟', '敵人', 'assets/images/skills/wavecrash.png');
const skill39 = new Skill('', 80, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');
const skill40 = new Skill('', 50, 8, '帥氣', '自身', 'assets/images/skills/earthquake.png');

const skill41 = new Skill('', 50, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');
const skill42 = new Skill('', 80, 8, '瑟瑟', '敵人', 'assets/images/skills/wavecrash.png');
const skill43 = new Skill('', 80, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');
const skill44 = new Skill('', 50, 8, '帥氣', '自身', 'assets/images/skills/earthquake.png');

const skill45 = new Skill('', 50, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');
const skill46 = new Skill('', 50, 8, '帥氣', '自身', 'assets/images/skills/earthquake.png');
const skill47 = new Skill('', 50, 8, '帥氣', '自身', 'assets/images/skills/earthquake.png');

const skill48 = new Skill('', 50, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');
const skill49 = new Skill('', 50, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');
const skill50 = new Skill('', 50, 8, '帥氣', '自身', 'assets/images/skills/earthquake.png');

const skill51 = new Skill('', 50, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');
const skill52 = new Skill('', 50, 8, '帥氣', '自身', 'assets/images/skills/earthquake.png');
const skill53 = new Skill('', 50, 8, '帥氣', '自身', 'assets/images/skills/earthquake.png');

const skill54 = new Skill('', 50, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');
const skill55 = new Skill('', 50, 8, '帥氣', '自身', 'assets/images/skills/earthquake.png');
const skill56 = new Skill('', 50, 8, '帥氣', '自身', 'assets/images/skills/earthquake.png');

const skill57 = new Skill('', 50, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');
const skill58 = new Skill('', 50, 8, '帥氣', '自身', 'assets/images/skills/earthquake.png');
const skill59 = new Skill('', 50, 8, '帥氣', '自身', 'assets/images/skills/earthquake.png');

const skill60 = new Skill('', 50, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');
const skill61 = new Skill('', 50, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');
const skill62 = new Skill('', 50, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');

const skill63 = new Skill('', 50, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');
const skill64 = new Skill('', 50, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');
const skill65 = new Skill('', 50, 8, '帥氣', '自身', 'assets/images/skills/earthquake.png');

const skill66 = new Skill('', 50, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');
const skill67 = new Skill('', 50, 8, '帥氣', '自身', 'assets/images/skills/earthquake.png');
const skill68 = new Skill('', 50, 8, '帥氣', '自身', 'assets/images/skills/earthquake.png');

const skill69 = new Skill('', 50, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');
const skill70 = new Skill('', 50, 8, '帥氣', '自身', 'assets/images/skills/earthquake.png');
const skill71 = new Skill('', 50, 8, '帥氣', '自身', 'assets/images/skills/earthquake.png');

const skill72 = new Skill('', 50, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');
const skill73 = new Skill('', 50, 8, '帥氣', '自身', 'assets/images/skills/earthquake.png');
const skill74 = new Skill('', 50, 8, '帥氣', '自身', 'assets/images/skills/earthquake.png');

const skill75 = new Skill('', 50, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');
const skill76 = new Skill('', 50, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');
const skill77 = new Skill('', 50, 8, '帥氣', '自身', 'assets/images/skills/earthquake.png');
const skill78 = new Skill('', 50, 8, '帥氣', '自身', 'assets/images/skills/earthquake.png');

const skill79 = new Skill('', 50, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');
const skill80 = new Skill('', 50, 8, '帥氣', '自身', 'assets/images/skills/earthquake.png');
const skill81 = new Skill('', 50, 8, '帥氣', '自身', 'assets/images/skills/earthquake.png');
const skill82 = new Skill('', 50, 8, '帥氣', '自身', 'assets/images/skills/earthquake.png');

const skill83 = new Skill('', 50, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');
const skill84 = new Skill('', 50, 8, '帥氣', '自身', 'assets/images/skills/earthquake.png');
const skill108 = new Skill('', 50, 8, '帥氣', '自身', 'assets/images/skills/earthquake.png');

const skill85 = new Skill('', 50, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');
const skill86 = new Skill('', 50, 8, '帥氣', '自身', 'assets/images/skills/earthquake.png');
const skill87 = new Skill('', 50, 8, '帥氣', '自身', 'assets/images/skills/earthquake.png');

const skill88 = new Skill('', 50, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');
const skill89 = new Skill('', 50, 8, '帥氣', '自身', 'assets/images/skills/earthquake.png');
const skill90 = new Skill('', 50, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');

const skill91 = new Skill('', 50, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');
const skill92 = new Skill('', 50, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');
const skill93 = new Skill('', 50, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');

const skill94 = new Skill('', 50, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');
const skill95 = new Skill('', 50, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');
const skill96 = new Skill('', 50, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');

const skill97 = new Skill('hanabi', 30, 8, '可愛', '敵人', 'assets/images/skills/earthquake.png');
const skill98 = new Skill('角角衝撞', 50, 8, '帥氣', '自身', 'assets/images/skills/earthquake.png');
const skill99 = new Skill('貓貓撒嬌', 50, 8, '帥氣', '自身', 'assets/images/skills/earthquake.png');
const skill100 = new Skill('零食的怨念', 50, 8, '帥氣', '自身', 'assets/images/skills/earthquake.png');

const skill101 = new Skill('', 50, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');
const skill102 = new Skill('', 50, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');
const skill103 = new Skill('', 50, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');
const skill104 = new Skill('', 50, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');

const skill105 = new Skill('', 50, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');
const skill106 = new Skill('', 50, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');
const skill107 = new Skill('', 50, 8, '帥氣', '敵人', 'assets/images/skills/earthquake.png');


const monsterDictionary = {
  1: { name: 'Han', baseHealth: 100, skills: [skill5], imagePath: 'assets/images/monster/1.png', evolveTo: 2, evolveLevel: 10, 
  learnableSkills: [{ level: 5, skill: skill6 }, { level: 12, skill: skill7 },{ level: 16, skill: skill8 }], type: '可愛', level: 1, prob: 0},
  2: { name: 'HanHan', baseHealth: 150, skills: [], imagePath: 'assets/images/monster/2.png', evolveTo: 3, evolveLevel: 15, 
  learnableSkills: [{ level: 12, skill: skill7 }], type: '可愛', level: 10, prob: 0},
  3: { name: 'RrHan', baseHealth: 385, skills: [], imagePath: 'assets/images/monster/3.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 16, skill: skill8 }], type: '可愛' , level: 15, prob: 0},

  4: { name: '兔肉乾', baseHealth: 100, skills: [skill9], imagePath: 'assets/images/monster/4.png', evolveTo: 5, evolveLevel: 10, 
  learnableSkills: [{ level: 5, skill: skill10 },{ level: 13, skill: skill11 },{ level: 17, skill: skill12 }], type: '可愛' , level: 1, prob: 0.12},
  5: { name: '兔肉火鍋', baseHealth: 115, skills: [skill1, skill10], imagePath: 'assets/images/monster/5.png', evolveTo: 6, evolveLevel: 15, 
  learnableSkills: [{ level: 13, skill: skill11 }], type: '可愛'  , level: 10, prob: 0},
  6: { name: 'peko', baseHealth: 125, skills: [skill9, skill10, skill11], imagePath: 'assets/images/monster/6.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 17, skill: skill12 }], type: '可愛'  , level: 15, prob: 0},

  7: { name: '09', baseHealth: 100, skills: [skill13], imagePath: 'assets/images/monster/7.png', evolveTo: 8, evolveLevel: 10, 
  learnableSkills: [{ level: 5, skill: skill14 },{ level: 13, skill: skill15 },{ level: 17, skill: skill16 }], type: '可愛' , level: 1, prob: 0.12},
  8: { name: '玖玖', baseHealth: 115, skills: [skill13, skill14], imagePath: 'assets/images/monster/8.png', evolveTo: 9, evolveLevel: 15, 
  learnableSkills: [{ level: 13, skill: skill15 }], type: '可愛' , level: 10, prob: 0},
  9: { name: '超級09', baseHealth: 125, skills: [skill13, skill14, skill15], imagePath: 'assets/images/monster/9.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 17, skill: skill16 }], type: '可愛' , level: 15, prob: 0},

  10: { name: 'Mao', baseHealth: 80, skills: [skill17], imagePath: 'assets/images/monster/10.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 7, skill: skill18 }, { level: 15, skill: skill19 }], type: '高冷' , level: 1, prob: 0.4},
  11: { name: '會長', baseHealth: 120, skills: [skill20], imagePath: 'assets/images/monster/11.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 5, skill: skill21 }, { level: 12, skill: skill22 }], type: '高冷' , level: 1, prob: 0.2},

  12: { name: '12', baseHealth: 80, skills: [skill23], imagePath: 'assets/images/monster/12.png', evolveTo: 13, evolveLevel: 10, 
  learnableSkills: [{ level: 8, skill: skill24 },{ level: 15, skill: skill25 }, { level: 17, skill: skill26 }], type: '抖M' , level: 1, prob: 0.3},
  13: { name: 'knightv12', baseHealth: 110, skills: [skill23, skill24], imagePath: 'assets/images/monster/13.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 15, skill: skill25 }, { level: 17, skill: skill26 }], type: '抖M' , level: 7, prob: 0},

  14: { name: '絲絲蛇', baseHealth: 80, skills: [skill27], imagePath: 'assets/images/monster/14.png', evolveTo: 15, evolveLevel: 13, 
  learnableSkills: [{ level: 8, skill: skill28 },{ level: 8, skill: skill29 }], type: '可愛' , level: 1, prob: 0.5},
  15: { name: '阿夸', baseHealth: 110, skills: [skill30], imagePath: 'assets/images/monster/15.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 15, skill: skill31 }, { level: 20, skill: skill32 }, { level: 20, skill: skill33 }], type: '抖M' , level: 1, prob: 0.4},
  16: { name: '西肉', baseHealth: 120, skills: [skill34], imagePath: 'assets/images/monster/16.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 12, skill: skill35 },{ level: 15, skill: skill36 }], type: '瑟瑟' , level: 1, prob: 0.5},

  17: { name: '凜風', baseHealth: 85, skills: [skill37], imagePath: 'assets/images/monster/17.png', evolveTo: 18, evolveLevel: 8, 
  learnableSkills: [{ level: 6, skill: skill38 },{ level: 13, skill: skill39 }, { level: 19, skill: skill40 }], type: '傲嬌' , level: 1, prob: 0.4},
  18: { name: '媚魔凜風', baseHealth: 110, skills: [skill1, skill6], imagePath: 'assets/images/monster/18.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 13, skill: skill39 }, { level: 19, skill: skill40}], type: '傲嬌' , level: 1, prob: 0},

  19: { name: '大醜', baseHealth: 90, skills: [skill41], imagePath: 'assets/images/monster/19.png', evolveTo: 20, evolveLevel: 10, 
  learnableSkills: [{ level: 11, skill: skill42 },{ level: 11, skill: skill43 },{ level: 11, skill: skill44 }], type: '瑟瑟' , level: 1, prob: 0.3},
  20: { name: '路人桑', baseHealth: 115, skills: [skill45], imagePath: 'assets/images/monster/20.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 13, skill: skill46 }, { level: 16, skill: skill47 }], type: '可愛' , level: 1, prob: 0.5},

  21: { name: '小安', baseHealth: 105, skills: [skill48], imagePath: 'assets/images/monster/21.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 13, skill: skill49 }, { level: 18, skill: skill50 }], type: '瑟瑟' , level: 1, prob: 0.5},
  22: { name: '骨頭', baseHealth: 105, skills: [skill51], imagePath: 'assets/images/monster/22.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 10, skill: skill52 },{ level: 10, skill: skill53 }], type: '高冷' , level: 1, prob: 0.5},

  23: { name: '小明', baseHealth: 100, skills: [skill54], imagePath: 'assets/images/monster/23.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 5, skill: skill55 }, { level: 8, skill: skill56 }], type: '瑟瑟' , level: 1, prob: 0.4},
  24: { name: 'MMM', baseHealth: 120, skills: [skill57], imagePath: 'assets/images/monster/24.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 13, skill: skill58 },{ level: 13, skill: skill59 }], type: '可愛' , level: 1, prob: 0.4},

  25: { name: '路', baseHealth: 105, skills: [skill60], imagePath: 'assets/images/monster/25.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 8, skill: skill61 }, { level: 10, skill: skill62 }], type: '可愛' , level: 1, prob: 0.5},
  26: { name: '亮晶晶', baseHealth: 120, skills: [skill63], imagePath: 'assets/images/monster/26.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 13, skill: skill64 }, { level: 20, skill: skill65 }], type: '瑟瑟' , level: 1, prob: 0.5},
  27: { name: '佐佐', baseHealth: 100, skills: [skill66], imagePath: 'assets/images/monster/27.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 7, skill: skill67 }, { level: 10, skill: skill68 }], type: '可愛' , level: 1, prob: 0.5}
  ,
  28: { name: 'yohane', baseHealth: 120, skills: [skill69], imagePath: 'assets/images/monster/28.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 13, skill: skill70 }, { level: 20, skill: skill71 }], type: '高冷' , level: 1, prob: 0.5},

  29: { name: '湊湊', baseHealth: 130, skills: [skill72], imagePath: 'assets/images/monster/29.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 10, skill: skill73 }, { level: 10, skill: skill74 }], type: '瑟瑟' , level: 15, prob: 0.5},

  30: { name: 'RR', baseHealth: 80, skills: [skill75], imagePath: 'assets/images/monster/30.png', evolveTo: 31, evolveLevel: 6, 
  learnableSkills: [{ level: 5, skill: skill76 },{ level: 8, skill: skill77 }, { level: 13, skill: skill78 }], type: '帥氣' , level: 1, prob: 0.2},
  31: { name: 'RR寶', baseHealth: 100, skills: [], imagePath: 'assets/images/monster/31.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 8, skill: skill77 }, { level: 13, skill: skill78 }], type: '帥氣' , level: 1, prob: 0},

  32: { name: '蛋包飯', baseHealth: 90, skills: [skill79], imagePath: 'assets/images/monster/32.png', evolveTo: 33, evolveLevel: 10, 
  learnableSkills: [{ level: 11, skill: skill80 }, { level: 13, skill: skill81 },{ level: 15, skill: skill82 }], type: '傲嬌' , level: 1, prob: 0.3},
  33: { name: '一合酥', baseHealth: 105, skills: [], imagePath: 'assets/images/monster/33.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 13, skill: skill81 }, { level: 15, skill: skill82 }], type: '傲嬌' , level: 1, prob: 0},

  34: { name: '豆漿', baseHealth: 110, skills: [skill85], imagePath: 'assets/images/monster/34.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 10, skill: skill86 }, { level: 15, skill: skill87 }], type: '傲嬌' , level: 1, prob: 0.5},
  35: { name: '變態', baseHealth: 110, skills: [skill88], imagePath: 'assets/images/monster/35.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 10, skill: skill89 }, { level: 15, skill: skill90}], type: '瑟瑟' , level: 1, prob: 0.5},
  36: { name: '唯真', baseHealth: 110, skills: [skill91], imagePath: 'assets/images/monster/36.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 10, skill: skill92 }, { level: 15, skill: skill93 }], type: '高冷' , level: 1, prob: 0.5},
  37: { name: '月月', baseHealth: 110, skills: [skill94], imagePath: 'assets/images/monster/37.png', evolveTo: null, evolveLevel: null,  
  learnableSkills: [{ level: 10, skill: skill95 }, { level: 15, skill: skill96 }], type: '可愛' , level: 1, prob: 0.5},

  38: { name: '炸虎斑斑', baseHealth: 100, skills: [skill97], imagePath: 'assets/images/monster/38.png', evolveTo: 39, evolveLevel: 12, 
  learnableSkills: [{ level: 12, skill: skill98 }, { level: 13, skill: skill99 }, { level: 16, skill: skill100 }], type: '可愛' , level: 1, prob: 0.2},
  39: { name: '炸蝦貓貓', baseHealth: 115, skills: [], imagePath: 'assets/images/monster/39.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 13, skill: skill99 }, { level: 16, skill: skill100 }], type: '可愛' , level: 1, prob: 0},

  40: { name: 'mumi', baseHealth: 100, skills: [skill101], imagePath: 'assets/images/monster/40.png', evolveTo: 41, evolveLevel: 15, 
  learnableSkills: [{ level: 12, skill: skill102 }, { level: 13, skill: skill103 },{ level: 13, skill: skill104 }], type: '抖M' , level: 1, prob: 0.12},
  41: { name: '姆咪', baseHealth: 115, skills: [], imagePath: 'assets/images/monster/41.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 13, skill: skill103 }, { level: 14, skill: skill104 }], type: '抖M' , level: 1, prob: 0},

  42: { name: '咩利羊', baseHealth: 100, skills: [skill1], imagePath: 'assets/images/monster/42.png', evolveTo: 43, evolveLevel: 10, 
  learnableSkills: [{ level: 12, skill: skill2 }, { level: 13, skill: skill3 }, { level: 15, skill: skill4 }], type: '瑟瑟' , level: 1, prob: 0.2},
  43: { name: '黑鍵', baseHealth: 115, skills: [], imagePath: 'assets/images/monster/43.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 13, skill: skill3 }, { level: 15, skill: skill4 }], type: '瑟瑟' , level: 1, prob: 0},
  
  44: { name: 'mumei', baseHealth: 100, skills: [skill105], imagePath: 'assets/images/monster/44.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 12, skill: skill106 }, { level: 18, skill: skill107 }], type: '高冷' , level: 1, prob: 0.2},

  45: { name: '鯊鯊', baseHealth: 100, skills: [skill83], imagePath: 'assets/images/monster/45.png', evolveTo: null, evolveLevel:null, 
  learnableSkills: [{ level: 12, skill: skill84 }, { level: 18, skill: skill108 }], type: '可愛' , level: 1, prob: 0.4},

  // ...
};

const monsterBookButton = document.getElementById('open-monster-book');
const monsterBook = document.getElementById('monster-book');
const monsterList = document.getElementById('monster-list');
const monsterDetails = document.getElementById('monster-details');

// populate monster list
for (const [key, monster] of Object.entries(monsterDictionary)) {
  const listButton = document.createElement('button');
  listButton.classList.add('monster-list-button');
  listButton.textContent = monster.name;
  listButton.setAttribute('data-key', key);
  monsterList.appendChild(listButton);
}

// add event listener for list button click
const listButtons = document.querySelectorAll('.monster-list-button');
for (const button of listButtons) {
  button.addEventListener('click', (event) => {
    const key = event.target.getAttribute('data-key');
    showMonsterDetails(key);
  });
}

// function to show monster details
function showMonsterDetails(key) {
  monsterDetails.innerHTML = '';
  const monster = monsterDictionary[key];

  // add monster image
  const img = document.createElement('img');
  img.setAttribute('src', monster.imagePath);
  monsterDetails.appendChild(img);

  // add monster name
  const name = document.createElement('h3');
  name.textContent = monster.name;
  monsterDetails.appendChild(name);

  // add monster stats
  const stats = document.createElement('p');
  stats.textContent = `類型: ${monster.type}, 基礎血量: ${monster.baseHealth}, 等級: ${monster.level}, 抽到機率: ${monster.prob}`;
  monsterDetails.appendChild(stats);

  // add monster skills
  const skillsHeading = document.createElement('h4');
  skillsHeading.textContent = 'Skills:';
  monsterDetails.appendChild(skillsHeading);
  const skills = document.createElement('ul');
  for (const skill of monster.skills) {
    const skillLI = document.createElement('li');
    skillLI.textContent = `技能: ${skill.name}, 傷害: ${skill.damage}, 類型: ${skill.type}, 目標: ${skill.effectType}`;
    skills.appendChild(skillLI);
  }

  // add learnable skills
  for (const learnable of monster.learnableSkills) {
    const { level, skill } = learnable;
    if (monster.level >= level) {
      const skillLI = document.createElement('li');
      skillLI.textContent = `學習技能: ${skill.name}, 傷害: ${skill.damage}, 類型: ${skill.type}, 目標: ${skill.effectType}, Learn at level ${level}`;
      skills.appendChild(skillLI);
    }
  }

  monsterDetails.appendChild(skills);

  // add evolution details
  if (monster.evolveTo && monster.evolveLevel) {
    const evolutionsHeading = document.createElement('h4');
    evolutionsHeading.textContent = '進化:';
    monsterDetails.appendChild(evolutionsHeading);

    const evolution = monsterDictionary[monster.evolveTo];
    const evolutionDetails = document.createElement('p');
    evolutionDetails.textContent = `進化成 ${evolution.name} 於等級 ${monster.evolveLevel}的時候`;
    monsterDetails.appendChild(evolutionDetails);

    const evolutionImg = document.createElement('img');
    evolutionImg.setAttribute('src', evolution.imagePath);
    monsterDetails.appendChild(evolutionImg);
  }
}

// add event listener for monster book button
monsterBookButton.addEventListener('click', () => {
  monsterBook.style.display = 'block';
});

// add event listener for 'E' key to open monster book
document.addEventListener('keydown', (event) => {
  if (event.key === 'e') {
    monsterBook.style.display = 'block';
  }
});
