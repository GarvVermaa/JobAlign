let App = {};

App.setup = function () {

  const canvas = document.getElementById("particleCanvas");

  this.canvas = canvas;
  this.canvas.width = window.innerWidth;
  this.canvas.height = window.innerHeight;

  this.ctx = this.canvas.getContext("2d");

  this.width = this.canvas.width;
  this.height = this.canvas.height;

  this.dataToImageRatio = Math.max(this.width, this.height) / 1000;

  this.ctx.globalCompositeOperation = "lighter";
  this.ctx.imageSmoothingEnabled = false;

  this.xC = this.width / 2;
  this.yC = this.height / 2;

  this.lifespan = 340;
  this.popPerBirth = 5;
  this.maxPop = 1500;
  this.birthFreq = 1;

  window.addEventListener("resize", () => {

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.dataToImageRatio = Math.max(this.width, this.height) / 1000;

    this.xC = this.width / 2;
    this.yC = this.height / 2;

    this.ctx.globalCompositeOperation = "lighter";

    this.initDraw();

  });

};

App.start = function () {

  this.stepCount = 0;
  this.particles = [];
  this.drawnInLastFrame = 0;
  this.deathCount = 0;

  this.initDraw();

};

App.evolve = function () {

  this.stepCount++;

  if (
    this.stepCount % this.birthFreq == 0 &&
    this.particles.length + this.popPerBirth < this.maxPop
  ) {
    for (let n = 0; n < this.popPerBirth; n++) this.birth();
  }

  App.move();
  App.draw();

};

App.birth = function () {

  let x = -800 + 1600 * Math.random();
  let y = -800 + 1600 * Math.random();

  let hues = [185, 190, 195, 200, 205, 210, 40, 45, 50];
  let hue = hues[Math.floor(Math.random() * hues.length)];

  let particle = {

    hue: hue,
    sat: 70 + 25 * Math.random(),
    lum: 55 + 25 * Math.random(),

    x,
    y,

    xLast: x,
    yLast: y,

    xSpeed: 0,
    ySpeed: 0,

    age: 0,

    name: "p-" + Math.ceil(10000000 * Math.random())

  };

  this.particles.push(particle);

};

App.kill = function (name) {
  this.particles = this.particles.filter((p) => p.name !== name);
};

App.move = function () {

  for (let i = 0; i < this.particles.length; i++) {

    let p = this.particles[i];

    p.xLast = p.x;
    p.yLast = p.y;

    p.xSpeed = 0;
    p.ySpeed = 0;

    let eddies = [];
    let baseK = 7;

    eddies.push({ x: -300, y: -300, K: 10 * baseK, r0: 180 });
    eddies.push({ x: 300, y: -300, K: 15 * baseK, r0: 150 });
    eddies.push({ x: 300, y: 300, K: 10 * baseK, r0: 250 });
    eddies.push({ x: -300, y: 300, K: 15 * baseK, r0: 150 });
    eddies.push({ x: 0, y: 0, K: 5 * baseK, r0: 20 });

    for (let e = 0; e < eddies.length; e++) {

      let eddy = eddies[e];

      let dx = p.x - eddy.x;
      let dy = p.y - eddy.y;

      let r = Math.sqrt(dx * dx + dy * dy);

      let theta = Utils.segmentAngleRad(0, 0, dx, dy, true);

      let cos = Math.cos(theta);
      let sin = Math.sin(theta);

      let er = { x: cos, y: sin };
      let eO = { x: -sin, y: cos };

      let radialVelocity = (-0.003 * eddy.K * Math.abs(dx * dy)) / 3000;

      let sigma = 100;

      let azimutalVelocity =
        eddy.K * Math.exp(-Math.pow((r - eddy.r0) / sigma, 2));

      p.xSpeed += radialVelocity * er.x + azimutalVelocity * eO.x;
      p.ySpeed += radialVelocity * er.y + azimutalVelocity * eO.y;

    }

    p.speed = Math.sqrt(p.xSpeed * p.xSpeed + p.ySpeed * p.ySpeed);

    p.x += 0.1 * p.xSpeed;
    p.y += 0.1 * p.ySpeed;

    p.age++;

    if (p.age > this.lifespan) {
      this.kill(p.name);
      this.deathCount++;
    }

  }

};

App.initDraw = function () {

  this.ctx.clearRect(0, 0, this.width, this.height);

  this.ctx.beginPath();
  this.ctx.rect(0, 0, this.width, this.height);

  this.ctx.fillStyle = "#061833";
  this.ctx.fill();

  this.ctx.closePath();

};

App.draw = function () {

  this.ctx.globalCompositeOperation = "source-over";

  this.ctx.fillStyle = "rgba(6,24,51,0.012)";
  this.ctx.fillRect(0, 0, this.width, this.height);

  this.ctx.globalCompositeOperation = "lighter";

  if (!this.particles.length) return;

  for (let i = 0; i < this.particles.length; i++) {

    let p = this.particles[i];

    let ageRatio = p.age / this.lifespan;

    let a = (0.1 + p.speed / 450) * (1 - Math.pow(ageRatio, 2));

    let last = this.dataXYtoCanvasXY(p.xLast, p.yLast);
    let now = this.dataXYtoCanvasXY(p.x, p.y);

    this.ctx.beginPath();

    this.ctx.strokeStyle =
      "hsla(" + p.hue + "," + p.sat + "%," + p.lum + "%," + a + ")";

    this.ctx.moveTo(last.x, last.y);
    this.ctx.lineTo(now.x, now.y);

    let size = 0.7 * Math.max(0.2, 1 - ageRatio);

    this.ctx.lineWidth = size * this.dataToImageRatio;

    this.ctx.stroke();

    this.ctx.closePath();

  }

};

App.dataXYtoCanvasXY = function (x, y) {

  const zoom = 0.82;

  return {
    x: this.xC + x * zoom * this.dataToImageRatio,
    y: this.yC + y * zoom * this.dataToImageRatio
  };

};

let Utils = {};

Utils.segmentAngleRad = (Xs, Ys, Xt, Yt, real) => {

  let r;

  if (Xs == Xt) {
    r = Ys == Yt ? 0 : Ys < Yt ? Math.PI / 2 : 3 * Math.PI / 2;
  }
  else if (Xs < Xt) {
    r = Math.atan((Yt - Ys) / (Xt - Xs));
  }
  else {
    r = Math.PI + Math.atan((Yt - Ys) / (Xt - Xs));
  }

  r = (r + 2 * Math.PI) % (2 * Math.PI);

  if (!real) r = 2 * Math.PI - r;

  return r;

};

const API_BASE_URL = "https://jobalign-backend-ak4j.onrender.com/api";

async function loadCompanies() {
  try {
    const res = await fetch(`${API_BASE_URL}/analysis/companies`);
    const data = await res.json();

    const companies = data.companies || data;

    const select = document.getElementById("company");
    select.innerHTML = '<option value="">Select Company</option>';

    companies.forEach((c) => {
      const option = document.createElement("option");
      option.value = c;
      option.textContent = c;
      select.appendChild(option);
    });

  } catch (err) {
    console.error("Error loading companies:", err);
  }
}

async function loadDesignations() {
  try {
    const res = await fetch(`${API_BASE_URL}/analysis/designations`);
    const data = await res.json();

    const roles = data.designations || data;

    const select = document.getElementById("designation");
    select.innerHTML = '<option value="">Select Role</option>';

    roles.forEach((r) => {
      const option = document.createElement("option");
      option.value = r;
      option.textContent = r;
      select.appendChild(option);
    });

  } catch (err) {
    console.error("Error loading roles:", err);
  }
}

async function analyzeSkills() {

  const company = document.getElementById("company").value;
  const designation = document.getElementById("designation").value;

  if (!company || !designation) {
    alert("Please select company and role");
    return;
  }

  document.getElementById("loading").style.display = "block";

  try {

    const res = await fetch(`${API_BASE_URL}/analysis/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ company, designation })
    });

    const data = await res.json();

    document.getElementById("loading").style.display = "none";
    document.getElementById("emptyState").style.display = "none";
    document.getElementById("results").style.display = "block";

    document.getElementById("displayCompany").textContent = company;
    document.getElementById("displayDesignation").textContent = designation;

    const skills = data.skills || [];

    document.getElementById("skillCount").textContent = skills.length;

    const container = document.getElementById("skillsContainer");
    container.innerHTML = "";


    skills.forEach((s) => {

      const div = document.createElement("div");
      div.className = "skill-pill";
      div.textContent = s.skill; 

      container.appendChild(div);

    });

    renderChart(skills);

  } catch (err) {
    console.error(err);
    document.getElementById("loading").style.display = "none";
  }
}

function renderChart(skills) {

  const ctx = document.getElementById("SkillsChart");

  if (skillsChart) {
    skillsChart.destroy();
  }

  skillsChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: skills.map((s) => s.skill),         
      datasets: [{
        label: "Skill Confidence %",
        data: skills.map((s) => s.percentage),    
        backgroundColor: "rgba(26,184,216,0.25)",
        borderColor: "rgba(77,217,240,0.8)",
        borderWidth: 1,
        borderRadius: 4,
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });

}

let skillsChart;

window.addEventListener("DOMContentLoaded", async () => {

  App.setup();
  App.start();

  (function frame() {
    App.evolve();
    requestAnimationFrame(frame);
  })();

  await loadCompanies();
  await loadDesignations();

});
