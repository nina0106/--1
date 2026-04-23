let clouds = [];
let tinyClouds = [];
let smileBirds = []; 
let iframe;
let closeBtn; 

// --- 連結保持不變 ---
let assignments = [
  { date: "0303", label: "Week 1", url: "https://nina0106.github.io/0303/" },
  { date: "0310", label: "Week 2", url: "https://nina0106.github.io/0310/" },
  { date: "0317", label: "Week 3", url: "https://nina0106.github.io/0317/" },
  { date: "0324", label: "Week 4", url: "https://nina0106.github.io/0324-1/" },
  { date: "0407", label: "Week 5", url: "https://nina0106.github.io/0407/" }
];

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0); 
  canvas.style('z-index', '1'); 

  // 1. 建立 iframe (優化：增加捲軸支援)
  iframe = createElement('iframe');
  iframe.style('border', '5px solid #fff');
  iframe.style('border-radius', '20px');
  iframe.style('box-shadow', '0 10px 30px rgba(0, 191, 255, 0.3)'); 
  iframe.style('background', '#fff');
  iframe.style('z-index', '5'); // 提高 iframe 層級
  iframe.hide();

  // 2. 建立「關閉按鈕」
  closeBtn = createButton('✖ 關閉視窗');
  closeBtn.style('background', '#FFB6C1'); 
  closeBtn.style('color', '#fff'); 
  closeBtn.style('border', 'none');
  closeBtn.style('border-radius', '20px'); 
  closeBtn.style('padding', '10px 20px');
  closeBtn.style('font-size', '16px');
  closeBtn.style('font-weight', 'bold');
  closeBtn.style('cursor', 'pointer');
  closeBtn.style('z-index', '100'); // 強制設為最高層級，避免不見
  closeBtn.hide(); 

  closeBtn.mousePressed(() => {
    iframe.hide();
    closeBtn.hide();
    iframe.attribute('src', ''); 
  });

  updateIframePosition();

  // 初始化雲朵
  let positions = [{x: 0.15, y: 0.25}, {x: 0.85, y: 0.25}, {x: 0.15, y: 0.75}, {x: 0.85, y: 0.75}, {x: 0.5,  y: 0.88}];
  for (let i = 0; i < assignments.length; i++) {
    clouds.push(new CloudIsland(width * positions[i].x, height * positions[i].y, assignments[i]));
  }
  for (let i = 0; i < 15; i++) tinyClouds.push(new TinyCloud());
  for (let i = 0; i < 8; i++) smileBirds.push(new CuteSmileBird());
}

function draw() {
  drawSky();
  for (let tc of tinyClouds) { tc.update(); tc.display(); }
  for (let b of smileBirds) { b.update(); b.display(); }
  for (let cloud of clouds) { cloud.update(); cloud.display(); }

  fill(70, 130, 180); 
  noStroke();
  textAlign(CENTER);
  textSize(24);
  textStyle(BOLD);
  text("☁️ 點擊雲朵島嶼查看作品 ☁️", width / 2, height * 0.1);
}

function drawSky() {
  for (let i = 0; i <= height; i++) {
    let inter = map(i, 0, height, 0, 1);
    let c = lerpColor(color('#00BFFF'), color('#F0F8FF'), inter); 
    stroke(c);
    line(0, i, width, i);
  }
}

function mousePressed() {
  if (iframe.style('display') === 'none') {
    for (let cloud of clouds) {
      if (cloud.isMouseOver()) {
        iframe.attribute('src', cloud.assignment.url);
        iframe.show();
        closeBtn.show(); 
        break;
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateIframePosition();
}

// --- 關鍵修正：修正按鈕消失的問題 ---
function updateIframePosition() {
  let w = windowWidth * 0.9;
  let h = windowHeight * 0.85;
  let iframeX = (windowWidth - w) / 2;
  let iframeY = (windowHeight - h) / 2;
  
  iframe.position(iframeX, iframeY);
  iframe.size(w, h);
  
  if (closeBtn) {
    // 修正：按鈕改為絕對定位，確保在螢幕視線內
    closeBtn.position(iframeX + w - 120, iframeY + 15);
    // 這裡確保按鈕始終顯示在最上層
    closeBtn.style('display', iframe.style('display')); 
  }
}

// --- 類別定義保持不變 ---
class CloudIsland {
  constructor(x, y, assignment) {
    this.baseX = x; this.baseY = y; this.x = x; this.y = y;
    this.assignment = assignment; this.angle = random(TWO_PI); this.size = 90;
  }
  update() { this.y = this.baseY + sin(this.angle) * 10; this.angle += 0.03; }
  display() {
    push(); translate(this.x, this.y);
    if (this.isMouseOver()) { scale(1.1); cursor(HAND); }
    noStroke(); fill(255, 255, 255, 250);
    ellipse(0, 0, this.size * 1.6, this.size);
    ellipse(-30, -5, this.size * 0.9, this.size * 0.9);
    ellipse(30, -5, this.size * 0.9, this.size * 0.9);
    ellipse(0, -15, this.size * 1.1, this.size);
    fill(255, 182, 193); triangle(-10, -25, 10, -25, 0, -40);
    fill(255, 255, 240); rect(-8, -25, 16, 15);
    fill(70, 130, 180); textAlign(CENTER); textSize(18); textStyle(BOLD);
    text(this.assignment.date, 0, 35);
    pop();
  }
  isMouseOver() { return dist(mouseX, mouseY, this.x, this.y) < this.size * 0.9; }
}

class TinyCloud {
  constructor() { this.reset(); this.y = random(height); }
  reset() {
    this.x = random(width); this.y = height + random(50, 200);
    this.speed = random(0.5, 1.2); this.size = random(20, 50);
    this.c = color(255, 255, 255, 150); this.seed = random(100);
  }
  update() { this.y -= this.speed; this.x += sin(frameCount * 0.01 + this.seed) * 0.3; if (this.y < -50) this.reset(); }
  display() { noStroke(); fill(this.c); ellipse(this.x, this.y, this.size, this.size * 0.8); }
}

class CuteSmileBird {
  constructor() { this.reset(); }
  reset() {
    this.dir = random() > 0.5 ? 1 : -1;
    this.pos = createVector(this.dir === 1 ? -100 : width + 100, random(height * 0.2, height * 0.8));
    this.vel = createVector(this.dir * random(1.5, 2.5), random(-0.3, 0.3));
    this.size = random(35, 45);
    this.seed = random(1000);
    this.bodyColor = color(255, 245, 150);
  }
  update() {
    this.pos.add(this.vel);
    if (this.pos.x > width + 200 || this.pos.x < -200) this.reset();
  }
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    if (this.dir === -1) scale(-1, 1);
    let wingAngle = sin(frameCount * 0.15 + this.seed) * PI / 6;
    noStroke();
    fill(255);
    push(); rotate(-wingAngle); beginShape(); vertex(this.size*-0.2, this.size*-0.1); bezierVertex(this.size*-0.5, this.size*-0.5, this.size*-1.2, this.size*-0.2, this.size*-0.9, this.size*0.2); bezierVertex(this.size*-0.6, this.size*0.4, this.size*-0.3, this.size*0.2, this.size*-0.2, this.size*0.1); endShape(CLOSE); pop();
    push(); rotate(wingAngle); beginShape(); vertex(this.size*0.2, this.size*-0.1); bezierVertex(this.size*0.5, this.size*-0.5, this.size*1.2, this.size*-0.2, this.size*0.9, this.size*0.2); bezierVertex(this.size*0.6, this.size*0.4, this.size*0.3, this.size*0.2, this.size*0.2, this.size*0.1); endShape(CLOSE); pop();
    fill(this.bodyColor); ellipse(0, 0, this.size * 1.3, this.size * 0.9);
    fill(255, 180, 200); ellipse(this.size * 0.3, this.size * 0.1, this.size * 0.4, this.size * 0.2); 
    fill(255, 100, 150); triangle(this.size*0.6, -2, this.size*0.8, 2, this.size*0.6, 6); 
    stroke(80); strokeWeight(2); noFill(); arc(this.size * 0.2, -this.size * 0.15, 10, 8, 0, PI); arc(this.size * 0.5, -this.size * 0.15, 10, 8, 0, PI);
    pop();
  }
}