class Item {
  constructor(name, type, description, effect, spriteSrc, cost) {
    this.name = name;
    this.type = type;
    this.description = description;
    this.effect = effect;
    this.spriteSrc = spriteSrc;
    this.cost = cost;
  }

  use(target) {
    this.effect(target);
  }
}

class AncientCoin {
  constructor(name, description, imagePath) {
    this.name = name;
    this.description = description;
    this.image = new Image();
    this.image.src = imagePath;
  }
}

// Define item types
const ItemType = {
  CATCH_MONSTER: 'catch_monster',
  RECOVER_HEALTH: 'recover_health',
  REVIVE_MONSTER: 'revive_monster',
};

// Define items
const items = {
  catchMonster: new Item(
    '捕捉道具',
    ItemType.CATCH_MONSTER,
    'ˋ抓野生畫師用特殊道具，疑似媚藥',
    (target) => {
      // Implement the catch monster effect here
    },
    'assets/images/items/catchMonster.png',
    100
  ),

  recoverHealth: new Item(
    '一串團子',
    ItemType.RECOVER_HEALTH,
    '治療畫家50生命，雖然味道不是很好',
    (target) => {
      const recoverAmount = 50;
      if (target.isAlive()){
        target.currentHealth = Math.min(target.baseHealth, target.currentHealth + recoverAmount);
      }
    },
    'assets/images/items/recoverMonster.png',
    50
  ),

  reviveMonster: new Item(
    '復活畫家',
    ItemType.REVIVE_MONSTER,
    '復活你被榨乾的畫家，很神奇吧',
    (target) => {
      if (target.currentHealth === 0) {
        target.currentHealth = Math.floor(target.baseHealth * 0.5);
      }
    },
    'assets/images/items/reviveMonster.png',
    100
  ),

  ancientCoin: new AncientCoin(
    '金幣',
    'A rare and valuable ancient coin',
    'assets/images/catchMonster.png'
  ),
};
const bag = new Bag();

// 增加 金幣 和物品
bag.addAncientCoins(10);
bag.addItem(new Item('Potion', 'Restores 50 HP', () => console.log('HP restored!')), 3);
bag.addItem(new Item('Ether', 'Restores 50 MP', () => console.log('MP restored!')), 1);

// 更新頁面
updatePage();

function updatePage() {
  // 更新 金幣 的數量
  const coinCount = document.getElementById('coin-count');
  coinCount.innerText = bag.ancientCoins;

  // 更新物品列表
  const itemList = document.getElementById('item-list');
  itemList.innerHTML = '';

  Object.values(bag.items).forEach(({item, quantity}) => {
    const itemElem = document.createElement('li');
    const itemQuantityElem = document.createElement('span');
    const itemNameElem = document.createElement('span');
    const itemDescElem = document.createElement('span');

    itemQuantityElem.innerText = quantity + 'x ';
    itemNameElem.innerText = item.name;
    itemDescElem.innerText = ' - ' + item.description;

    itemElem.appendChild(itemQuantityElem);
    itemElem.appendChild(itemNameElem);
    itemElem.appendChild(itemDescElem);

    itemList.appendChild(itemElem);
  });
}