class Skill {
  constructor(name, damage, pp, type, effectType, spriteImagePath) {
    this.name = name;
    this.damage = damage;
    this.pp = pp;
    this.type = type;
    this.effectType = effectType;
    this.spriteImage = new Image();
    this.spriteImage.src = spriteImagePath;
  }

  getTypeMultiplier(attackerType, defenderType) {//   高冷<->瑟瑟  ->可愛->帥氣->抖M->傲嬌
    if (attackerType === '高冷' && defenderType === '瑟瑟') {
      return 2;
    } else if (attackerType === '可愛' && defenderType === '帥氣') {
      return 2;
    } else if (attackerType === '帥氣' && defenderType === '抖M') {
      return 2;
    } else if (attackerType === '抖M' && defenderType === '傲嬌') {
      return 2;
    } else if (attackerType === '傲嬌' && defenderType === '可愛') {
      return 2;
    } else if (attackerType === '瑟瑟' && defenderType === '高冷') {
      return 2;
    } else {
      return 1;
    }
  }

  calculateDamage(attackerLevel, attackerCurrentHealth, defenderType) {
    // Example: Calculate damage based on the attacker's level and current health
    // You can adjust the formula to control the damage calculation
    const levelFactor = 1 + attackerLevel / 10;
    const healthFactor = attackerCurrentHealth / 100;
    const typeMultiplier = this.getTypeMultiplier(this.type , defenderType)
    return Math.floor(this.damage * levelFactor * healthFactor * typeMultiplier);
  }

  drawEffect(ctx, startX, startY, endX, endY, progress, flip) {
    const x = startX + (endX - startX) * progress;
    const y = startY + (endY - startY) * progress;

    ctx.save();
    if (flip) {
      ctx.translate(x * 2, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(this.spriteImage, x, y, 40, 40);
    ctx.restore();
  }
}

// Example Skill - Heal
class Heal extends Skill {
  constructor(name, healAmount, pp, type, effectType, spriteImagePath) {
    super(name, 0, pp, type, effectType, spriteImagePath);
    this.healAmount = healAmount;
  }

  use(user,effectType) {
    user.currentHealth += this.healAmount;
    if (user.currentHealth > user.maxHealth) {
      user.currentHealth = user.maxHealth;
    }
    this.pp--;
    return `${user.name}使用了${this.name}，恢復了${this.healAmount}點生命值！`;
  }
}

// Example Skill - Paralyze
class Paralyze extends Skill {
  constructor(name, pp, type, effectType, spriteImagePath) {
    super(name, 0, pp, type, effectType, spriteImagePath);
  }

  use(user, target) {
    target.isParalyzed = true;
    this.pp--;
    return `${user.name}使用了${this.name}，${target.name}陷入麻痺狀態！`;
  }
}

// Example Skill - Weaken
class Weaken extends Skill {
  constructor(name, weakenAmount, pp, type, effectType, spriteImagePath) {
    super(name, 0, pp, type, effectType, spriteImagePath);
    this.weakenAmount = weakenAmount;
  }

  use(user, target) {
    target.damage -= this.weakenAmount;
    if (target.damage < 0) {
      target.damage = 0;
    }
    this.pp--;
    return `${user.name}使用了${this.name}，${target.name}攻擊力下降了${this.weakenAmount}點！`;
  }
}

// Example Skill - Shield
class Shield extends Skill {
  constructor(name, shieldAmount, pp, type, effectType, spriteImagePath) {
    super(name, 0, pp, type, effectType, spriteImagePath);
    this.shieldAmount = shieldAmount;
  }

  use(user, target) {
    user.shield += this.shieldAmount;
    this.pp--;
    return `${user.name}使用了${this.name}，獲得了${this.shieldAmount}點盾牌值！`;
  }
}
