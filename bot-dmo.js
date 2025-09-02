let allowWalk = false;
let isRunning = false;
let fightingIntervalId = null;

let startFightLoop = false;
let startFightId = null;

let restIntervalId = null;

let walkIntervalId = null;

let positionIndex = 0;

let LOW_HP = 50
let LOW_MP = 50

let SIT_REST = false;
let WALK_TO_MONSTER = false;
let WLAK_TO_MONSTER_RANDOM = false;
let USE_SKILL = false;

let RANDOM_INTERVAL_I = 150
let RANDOM_INTERVAL_II = 180

function getRandomInterval() {
  return Math.floor(Math.random() * (RANDOM_INTERVAL_II - RANDOM_INTERVAL_I + 1)) + RANDOM_INTERVAL_I;
}

function closeOtherCharacterWindow() {
  const parent = document.getElementById('other-character');
  if (!parent) return;

  const closeWrapper = parent.querySelector('#button-circle-close');
  if (!closeWrapper) return;

  const closeButton = closeWrapper.querySelector('a');
  if (closeButton) {
    closeButton.click();
    console.log('คลิกปุ่มปิดใน #other-character แล้ว');
  }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function getCurrentHPPercent() {
  const powerDiv = document.querySelectorAll('.power')[0];
  if (!powerDiv) return null;

  const widthStr = powerDiv.style.width;
  if (!widthStr) return null;

  const widthNum = parseFloat(widthStr.replace('%', ''));
  return isNaN(widthNum) ? null : widthNum;
}

function getCurrentMPPercent() {
  const powerDiv = document.querySelectorAll('.power')[1];
  if (!powerDiv) return null;

  const widthStr = powerDiv.style.width;
  if (!widthStr) return null;

  const widthNum = parseFloat(widthStr.replace('%', ''));
  return isNaN(widthNum) ? null : widthNum;
}

function checkHP(minhp) {
  const hp = getCurrentHPPercent();
  if (hp === null) {
    return false;
  }

  if (hp < minhp) {
    return true; // HP ต่ำ
  }

  return false;
}

function checkMP(minmp) {
  const mp = getCurrentMPPercent();
  if (mp === null) {
    return false;
  }

  if (mp < minmp) {
    return true; // HP ต่ำ
  }

  return false;
}

async function fightMonsters() {
  
  let hp = checkHP(20)
  let mp = checkMP(20)

  if(!mp){

    const startEl = document.getElementById('START_FIGHTING');
    if (!startEl) return console.log('#START_FIGHTING ยังไม่เจอ...');

    const textDiv = startEl.querySelector('.text');
    if (!textDiv) return console.log('เจอ #START_FIGHTING แต่ไม่มี .text');

    const rawText = textDiv.innerText;
    const cleanedText = rawText.replace(/ตัว/g, '').trim();
    const number = parseInt(cleanedText, 10);

    if (isNaN(number) || number <= 0) return;
    const again = document.querySelector('.button-again2020');
    if(again){
      back2again();
    } else {
      const fightBtn = document.getElementById('ico_fighting');
      if (fightBtn) {
        if(USE_SKILL) uSkill(1,'F');
        if(!USE_SKILL) fightBtn.click();
      } else {

        let hitMonster = parseInt(localStorage.getItem('hitMonster')) || 0; // ดึงค่ามา ถ้าไม่มีให้เริ่ม 0
        hitMonster += 1; // เพิ่ม 1
        localStorage.setItem('hitMonster', hitMonster); // เซฟกลับ

        const infoDiv = document.querySelector('div.information');
        if (infoDiv) {
          infoDiv.textContent = `Hit monsters: ${hitMonster}`;
        }
        const goHomeBtn = document.querySelector('.button-go2home2020');
        const nextMonsterBtn = document.querySelector('.button-nextmonster2020');

        if (goHomeBtn) {
          goHomeBtn.click();
        } else if (nextMonsterBtn) {

          nextMonsterBtn.click();
        }
      }  
    }
  } else {

  }
  

  // if(!hp && !mp){
  //   const startEl = document.getElementById('START_FIGHTING');
  //   if (!startEl) return console.log('#START_FIGHTING ยังไม่เจอ...');

  //   const textDiv = startEl.querySelector('.text');
  //   if (!textDiv) return console.log('เจอ #START_FIGHTING แต่ไม่มี .text');

  //   const rawText = textDiv.innerText;
  //   const cleanedText = rawText.replace(/ตัว/g, '').trim();
  //   const number = parseInt(cleanedText, 10);

  //   if (isNaN(number) || number <= 0) return;
  //   const again = document.querySelector('.button-again2020');
  //   if(again){
  //     back2again();
  //   } else {
  //     const fightBtn = document.getElementById('ico_fighting');
  //     if (fightBtn) {
  //       for (let i = 0; i < number; i++) {
  //         fightBtn.click();
  //         // uSkill(1,'F');
  //       }
  //     } else {
        
  //       let hitMonster = parseInt(localStorage.getItem('hitMonster')) || 0; // ดึงค่ามา ถ้าไม่มีให้เริ่ม 0
  //       hitMonster += 1; // เพิ่ม 1
  //       localStorage.setItem('hitMonster', hitMonster); // เซฟกลับ

  //       const infoDiv = document.querySelector('div.information');
  //       if (infoDiv) {
  //           infoDiv.textContent = `Hit monsters: ${hitMonster}`;
  //       }
  //       const goHomeBtn = document.querySelector('.button-go2home2020');
  //       const nextMonsterBtn = document.querySelector('.button-nextmonster2020');

  //       if (goHomeBtn) {
  //         goHomeBtn.click();
  //       } else if (nextMonsterBtn) {

  //         nextMonsterBtn.click();
  //       }
  //     }  
  //   }
    
  // } else {
  //   const goHomeBtn = document.querySelector('.button-go2home2020');
  //   if(goHomeBtn) goHomeBtn.click();

    
  //   // const escapeBtn = document.querySelector('.button-escape2020');
  //   // if(escapeBtn) escapeBtn.click();
  // }
  
}

function isFightingVisible() {
  return document.getElementById('tools-fighting-me-area') !== null;
}

function startFightingLoop() {
  allowWalk = false
  fightingIntervalId = setInterval(() => {
    handleFightingPhase();
  }, getRandomInterval(RANDOM_INTERVAL_I,RANDOM_INTERVAL_II));
}

function stopFightingLoop() {
  clearInterval(fightingIntervalId);
  fightingIntervalId = null;
}

function startFight() {
  if(isRunning){
    closeOtherCharacterWindow();
    handleRightClickCleanup();

    const fightingVisible = isFightingVisible();

    if (fightingVisible && !fightingIntervalId) {
      console.log("เข้าสู่โหมดต่อสู้ เริ่ม");
      startFightingLoop(); // ✅ เริ่ม loop เฉพาะการต่อสู้
    }

    if (!fightingVisible && fightingIntervalId) {
      console.log("ออกจากโหมดต่อสู้");
      stopFightingLoop(); // ✅ หยุดเมื่อไม่ต่อสู้แล้ว
    }
  }
}

function startBotLoop() {
  clearInterval(walkIntervalId)
  walkIntervalId = null

  if (startFightLoop) return;
  startFightLoop = true;

  startFightId = setInterval(startFight, 250);
  console.log('🔁 เริ่ม การโจมตี');
}

async function stopBotLoop() {
  if (!startFightLoop) return;
  startFightLoop = false;
  stopFightingLoop()
  console.log('⛔ หยุด การโจมตี');

  clearInterval(startFightId);
  startFightId = null;
  
  allowWalk = false
}

function clickMonster(id) {
  const el = document.getElementById(id);
  if (!el) return;

  const rect = el.getBoundingClientRect();

  const event = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
    clientX: rect.left + rect.width / 2,
    clientY: rect.top + rect.height / 2
  });

  const target = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
  
  if (target) {
    target.dispatchEvent(event);
    console.log(`คลิกที่ ${id}`);
  }
}

function handleFightingPhase() {
  fightMonsters();
}

function handleRightClickCleanup() {
  const rightclick = document.getElementById("rightclick");
  if (rightclick) rightclick.remove();
}

function restHPMP(){
  let hp = checkHP(LOW_HP)
  let mp = checkMP(LOW_MP)

  if(!isFightingVisible()){
    if(hp || mp) {
      allowWalk = false
      const toolBtn = document.getElementById('button-mytools2');
      if (toolBtn) toolBtn.click();  
    }
  }
}

const cellSize = 20;

function gridToPixel(x, y) {
  // สมมติเพิ่ม offset y = 40px
  const offsetY = 40;

  return {
    px: x * cellSize,
    py: y * cellSize + offsetY
  };
}

function loadPositions() {
  const data = localStorage.getItem('clickedPositions');
  if (!data) return [];

  try {
    const positions = JSON.parse(data);
    if (Array.isArray(positions)) {
      return positions;
    } else {
      console.warn('ข้อมูล savedPositions ไม่ใช่ array');
      return [];
    }
  } catch (e) {
    console.error('โหลด savedPositions ผิดพลาด:', e);
    return [];
  }
}

function walkToMonster(){
  if(WLAK_TO_MONSTER_RANDOM && !WALK_TO_MONSTER){
    if(!allowWalk && !isFightingVisible()){
      const positions = loadPositions();

      const index = Math.floor(Math.random() * positions.length)
      let x = positions[index].x
      let y = positions[index].y
      const pixelPos = gridToPixel(x, y);

      const divMap = document.getElementById('divMap');

      const clickEvent = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true,
          clientX: pixelPos.px,  // กำหนดพิกัดถ้าต้องการ
          clientY: pixelPos.py
      });

      // ส่ง event click ไปที่ divMap
      divMap.dispatchEvent(clickEvent);
    }  
  }

  if(WALK_TO_MONSTER && !WLAK_TO_MONSTER_RANDOM){
    if(!allowWalk && !isFightingVisible()){
      console.log('walk')
      const randomNumber = Math.floor(Math.random() * 30) + 1;
      clickMonster('iconMonster'+randomNumber)  
    }
  }
  
}

function startBot() {
  if (isRunning) {
    console.log('บอทกำลังทำงานอยู่แล้ว');
    return;
  }

  isRunning = true;
  console.log('เริ่มทำงานบอท');

  walkToMonster()

  if(SIT_REST) restIntervalId = setInterval(restHPMP, 100);
}

// ✅ ฟังก์ชันหยุดบอท
function stopBot() {
  if (!isRunning) {
    console.log('บอทยังไม่ได้ทำงาน');
    return;
  }

  clearInterval(fightingIntervalId);
  fightingIntervalId = null;

  clearInterval(startFightId);
  startFightId = null;

  clearInterval(restIntervalId);
  restIntervalId = null

  clearInterval(walkIntervalId);
  walkIntervalId = null

  isRunning = false;
  console.log('หยุดการทำงานบอทแล้ว');
}

const observer = new MutationObserver(() => {
  const fightingVisible = document.getElementById('tools-fighting-me-area') !== null;
  const mytarget = document.getElementById('myTarget') !== null;

  if (fightingVisible) {
    startBotLoop();
  } else {
    stopBotLoop();
  }
  if(!mytarget && !fightingVisible && !allowWalk && isRunning){
    walkToMonster()
    document.querySelectorAll('#warp1, #warp2').forEach(el => el.remove());
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

const powerDiv = document.querySelectorAll('.power')[0];
if (powerDiv) {
  const observer = new MutationObserver(() => {
    const hp = getCurrentHPPercent();
    console.log(hp)
  });

  observer.observe(powerDiv, {
    attributes: true,
    attributeFilter: ['style'],
  });
}

// ฟังก์ชันอัปเดต div แสดง hitMonster
function updateHitMonsterDiv() {
    let hitMonster = parseInt(localStorage.getItem('hitMonster')) || 0;

    let hitDiv = document.getElementById('hitMonsterDiv');
    if (!hitDiv) {
        hitDiv = document.createElement('div');
        hitDiv.id = 'hitMonsterDiv';
        hitDiv.style.position = 'fixed';
        hitDiv.style.bottom = '10px';
        hitDiv.style.left = '10px';
        hitDiv.style.backgroundColor = 'rgba(0,0,0,0.7)';
        hitDiv.style.color = 'white';
        hitDiv.style.padding = '5px 10px';
        hitDiv.style.borderRadius = '5px';
        hitDiv.style.zIndex = '9999';
        document.body.appendChild(hitDiv);
    }

    hitDiv.textContent = `โจมตีมอนเตอร์ทั้งหมด: ${hitMonster} ตัว`;
}

// เรียก update div ทุก 1 วินาที
setInterval(updateHitMonsterDiv, 1000);

// เพิ่มปุ่มในหน้าเว็บ
const toggleBotBtn = document.createElement('button');
toggleBotBtn.innerText = '▶ เริ่มบอท';
toggleBotBtn.style.position = 'fixed';
toggleBotBtn.style.bottom = '20px';
toggleBotBtn.style.right = '20px';
toggleBotBtn.style.padding = '10px 16px';
toggleBotBtn.style.zIndex = '9999';
toggleBotBtn.style.backgroundColor = '#28a745';
toggleBotBtn.style.color = '#fff';
toggleBotBtn.style.border = 'none';
toggleBotBtn.style.borderRadius = '6px';
toggleBotBtn.style.cursor = 'pointer';
toggleBotBtn.style.fontSize = '16px';
toggleBotBtn.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';

toggleBotBtn.addEventListener('click', () => {
  if (isRunning) {
    stopBot();
    toggleBotBtn.innerText = '▶ เริ่มบอท';
    toggleBotBtn.style.backgroundColor = '#28a745'; // เขียว
  } else {
    startBot();
    toggleBotBtn.innerText = '⏹ หยุดบอท';
    toggleBotBtn.style.backgroundColor = '#dc3545'; // แดง
  }
});

document.body.appendChild(toggleBotBtn);

// ===================== SELECT เดินหา Monster =====================
const walkModeSelect = document.createElement('select');
walkModeSelect.style.position = 'fixed';
walkModeSelect.style.bottom = '105px';
walkModeSelect.style.right = '20px';
walkModeSelect.style.padding = '8px 12px';
walkModeSelect.style.zIndex = '9999';
walkModeSelect.style.border = '1px solid #ccc';
walkModeSelect.style.borderRadius = '6px';
walkModeSelect.style.fontSize = '14px';
walkModeSelect.style.backgroundColor = '#fff';

const optWalkDefault = new Option('เลือกโหมดเดิน...', '');
const optWalk = new Option('เดินตามมอนเตอร์บนแมพ', 'WALK_TO_MONSTER');
const optWalkRandom = new Option('เดินแบบตามพิกัด', 'WALK_TO_MONSTER_RANDOM');

walkModeSelect.appendChild(optWalkDefault);
walkModeSelect.appendChild(optWalk);
walkModeSelect.appendChild(optWalkRandom);

// โหลดค่าเก่า
const savedWalkMode = localStorage.getItem('BOT_WALK_MODE');
if (savedWalkMode) {
  walkModeSelect.value = savedWalkMode;
  applyWalkMode(savedWalkMode);
}

walkModeSelect.addEventListener('change', (e) => {
  const value = e.target.value;
  localStorage.setItem('BOT_WALK_MODE', value);
  applyWalkMode(value);
});

function applyWalkMode(mode) {
  WALK_TO_MONSTER = false;
  WLAK_TO_MONSTER_RANDOM = false;

  if (mode === 'WALK_TO_MONSTER') {
    WALK_TO_MONSTER = true;
  } else if (mode === 'WALK_TO_MONSTER_RANDOM') {
    WLAK_TO_MONSTER_RANDOM = true;
  }
}

document.body.appendChild(walkModeSelect);


// ===================== SELECT SIT_REST =====================
const sitRestSelect = document.createElement('select');
sitRestSelect.style.position = 'fixed';
sitRestSelect.style.bottom = '65px';
sitRestSelect.style.right = '20px';
sitRestSelect.style.padding = '8px 12px';
sitRestSelect.style.zIndex = '9999';
sitRestSelect.style.border = '1px solid #ccc';
sitRestSelect.style.borderRadius = '6px';
sitRestSelect.style.fontSize = '14px';
sitRestSelect.style.backgroundColor = '#fff';

const optSitDefault = new Option('ไม่นั่งพักฟื้น', 'OFF');
const optSitOn = new Option('นั่งพักฟื้น', 'ON');

sitRestSelect.appendChild(optSitDefault);
sitRestSelect.appendChild(optSitOn);

// โหลดค่าเก่า
const savedSitRest = localStorage.getItem('BOT_SIT_REST');
if (savedSitRest) {
  sitRestSelect.value = savedSitRest;
  applySitRest(savedSitRest);
}

sitRestSelect.addEventListener('change', (e) => {
  const value = e.target.value;
  localStorage.setItem('BOT_SIT_REST', value);
  applySitRest(value);
});

function applySitRest(value) {
  SIT_REST = false;
  if (value === 'ON') {
    SIT_REST = true;
  } else {
  }
}

document.body.appendChild(sitRestSelect);

// ===================== SELECT USE_SKILL =====================
const useSkillSelect = document.createElement('select');
useSkillSelect.style.position = 'fixed';
useSkillSelect.style.bottom = '145px';
useSkillSelect.style.right = '20px';
useSkillSelect.style.padding = '8px 12px';
useSkillSelect.style.zIndex = '9999';
useSkillSelect.style.border = '1px solid #ccc';
useSkillSelect.style.borderRadius = '6px';
useSkillSelect.style.fontSize = '14px';
useSkillSelect.style.backgroundColor = '#fff';

// ตัวเลือก ON/OFF
const optSkillOff = new Option('ไม่ใช้งานสกิล', 'OFF');
const optSkillOn = new Option('ใช้งานสกิล', 'ON');

useSkillSelect.appendChild(optSkillOff);
useSkillSelect.appendChild(optSkillOn);

// โหลดค่าเก่า
const savedUseSkill = localStorage.getItem('BOT_USE_SKILL');
if (savedUseSkill) {
  useSkillSelect.value = savedUseSkill;
  applyUseSkill(savedUseSkill);
}

useSkillSelect.addEventListener('change', (e) => {
  const value = e.target.value;
  localStorage.setItem('BOT_USE_SKILL', value);
  applyUseSkill(value);
});

// ฟังก์ชันเซ็ตค่า
function applyUseSkill(value) {
  if (value === 'ON') {
    USE_SKILL = true;
  } else {
    USE_SKILL = false;
  }
}

document.body.appendChild(useSkillSelect);

// ===================== SPEED SELECT =====================

const speedSelect = document.createElement('select');
speedSelect.style.position = 'fixed';
speedSelect.style.bottom = '185px'; // สูงกว่าช่อง useSkillSelect
speedSelect.style.right = '20px';
speedSelect.style.padding = '8px 12px';
speedSelect.style.zIndex = '9999';
speedSelect.style.border = '1px solid #ccc';
speedSelect.style.borderRadius = '6px';
speedSelect.style.fontSize = '14px';
speedSelect.style.backgroundColor = '#fff';

// ตัวเลือกความเร็ว
const speedOptions = [
  { text: 'เร็วมาก', value: 'very_fast' },
  { text: 'เร็ว', value: 'fast' },
  { text: 'ปกติ', value: 'normal' },
  { text: 'ช้า', value: 'slow' }
];
speedOptions.forEach(opt => speedSelect.appendChild(new Option(opt.text, opt.value)));

// อัปเดตค่าเมื่อเลือก
speedSelect.addEventListener('change', e => {
  switch(e.target.value) {
    case 'very_fast': RANDOM_INTERVAL_I = 100; RANDOM_INTERVAL_II = 100; break;
    case 'fast': RANDOM_INTERVAL_I = 120; RANDOM_INTERVAL_II = 150; break;
    case 'normal': RANDOM_INTERVAL_I = 150; RANDOM_INTERVAL_II = 180; break;
    case 'slow': RANDOM_INTERVAL_I = 200; RANDOM_INTERVAL_II = 250; break;
  }
  localStorage.setItem('BOT_SPEED', e.target.value);
  console.log('RANDOM_INTERVAL_I =', RANDOM_INTERVAL_I, ', RANDOM_INTERVAL_II =', RANDOM_INTERVAL_II);
});

// โหลดค่าเก่า ถ้ามี
const savedSpeed = localStorage.getItem('BOT_SPEED');
if(savedSpeed){
  speedSelect.value = savedSpeed;
  speedSelect.dispatchEvent(new Event('change'));
}

document.body.appendChild(speedSelect);

function createGridBox(divId) {
  const div = document.getElementById(divId);
  if (!div) return;

  // โหลดพิกัดจาก localStorage หรือเริ่มเป็น array ว่าง
  let clickedPositions = JSON.parse(localStorage.getItem('clickedPositions') || '[]');

  // ลบกริดเก่าก่อน
  const oldGrid = div.querySelector('#gridContainer');
  if (oldGrid) oldGrid.remove();

  const w = div.clientWidth;
  const h = div.clientHeight;
  const cellSize = 20;

  const container = document.createElement('div');
  container.id = 'gridContainer';
  container.style.position = 'relative';
  container.style.width = w + 'px';
  container.style.height = h + 'px';

  const cols = Math.floor(w / cellSize);
  const rows = Math.floor(h / cellSize);

  for(let y=0; y < rows; y++) {
    for(let x=0; x < cols; x++) {
      const cell = document.createElement('div');
      cell.style.position = 'absolute';
      cell.style.left = (x * cellSize) + 'px';
      cell.style.top = (y * cellSize) + 'px';
      cell.style.width = cellSize + 'px';
      cell.style.height = cellSize + 'px';
      cell.style.boxSizing = 'border-box';
      cell.style.border = '1px solid #ccc';
      cell.style.backgroundColor = 'transparent';
      cell.dataset.gridX = x;
      cell.dataset.gridY = y;

      // ถ้าพิกัดนี้อยู่ใน clickedPositions ให้ไฮไลต์ตอนโหลด
      if (clickedPositions.some(pos => pos.x === x && pos.y === y)) {
        cell.style.backgroundColor = 'rgba(100,150,250,0.5)';
        cell.classList.add('selected');
      }

      cell.addEventListener('click', (e) => {
        e.stopPropagation();

        const gx = parseInt(cell.dataset.gridX) - 1;
        const gy = parseInt(cell.dataset.gridY) - 1;

        const index = clickedPositions.findIndex(pos => pos.x === gx && pos.y === gy);

        if (index === -1) {
          clickedPositions.push({x: gx, y: gy});
          cell.style.backgroundColor = 'rgba(100,150,250,0.5)';
          cell.classList.add('selected');
        } else {
          clickedPositions.splice(index, 1);
          cell.style.backgroundColor = 'transparent';
          cell.classList.remove('selected');
        }

        // บันทึกลง localStorage ทุกครั้งที่เปลี่ยนแปลง
        localStorage.setItem('clickedPositions', JSON.stringify(clickedPositions));
        console.log('Clicked positions:', clickedPositions);
      });

      container.appendChild(cell);
    }
  }

  div.appendChild(container);
}

const createGridBtn = document.createElement('button');
createGridBtn.innerText = 'สร้างกริด';
createGridBtn.style.position = 'fixed';
createGridBtn.style.bottom = '20px';
// วางไว้ด้านซ้าย toggleBotBtn ประมาณ 110px
createGridBtn.style.right = '140px';
createGridBtn.style.padding = '10px 16px';
createGridBtn.style.zIndex = '9999';
createGridBtn.style.backgroundColor = '#007bff';
createGridBtn.style.color = '#fff';
createGridBtn.style.border = 'none';
createGridBtn.style.borderRadius = '6px';
createGridBtn.style.cursor = 'pointer';
createGridBtn.style.fontSize = '16px';
createGridBtn.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';

// กดปุ่มเรียกฟังก์ชัน createGridBox
createGridBtn.addEventListener('click', () => {
    createGridBox('divMap');
});

document.body.appendChild(createGridBtn);

// ปุ่มเคลียร์ clickedPositions
const clearGridBtn = document.createElement('button');
clearGridBtn.innerText = 'ล้างกริด';
clearGridBtn.style.position = 'fixed';
clearGridBtn.style.bottom = '20px';
// วางด้านซ้ายของปุ่ม createGridBtn ประมาณ 140px + 110px = 250px จากขวา
clearGridBtn.style.right = '250px';
clearGridBtn.style.padding = '10px 16px';
clearGridBtn.style.zIndex = '9999';
clearGridBtn.style.backgroundColor = '#dc3545';
clearGridBtn.style.color = '#fff';
clearGridBtn.style.border = 'none';
clearGridBtn.style.borderRadius = '6px';
clearGridBtn.style.cursor = 'pointer';
clearGridBtn.style.fontSize = '16px';
clearGridBtn.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';

// กดปุ่มล้างกริด
clearGridBtn.addEventListener('click', () => {
    localStorage.removeItem('clickedPositions'); // ลบข้อมูลเก่า
    // รีโหลดกริดเพื่อเคลียร์ highlight
    createGridBox('divMap');
    console.log('Cleared clicked positions');
});

document.body.appendChild(clearGridBtn);

document.addEventListener("keydown", function(e) {
  if (e.key === "1") {
    uSkill(1,'F');
  }
  if (e.key === "2") {
    uSkill(2,'F');
  }
});