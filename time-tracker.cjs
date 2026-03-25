const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const Table = require('cli-table3');

// --- НАЛАШТУВАННЯ ---
const DAILY_GOAL_HOURS = 4; // Ваша мета на день
const BREAK_MINUTES = 50;    // Нагадування про перерву
const STATS_FILE = path.join(process.cwd(), 'stats.json');

function loadStats() {
   if (!fs.existsSync(STATS_FILE)) return { sessions: [] };
   try {
      return JSON.parse(fs.readFileSync(STATS_FILE, 'utf8'));
   } catch (e) { return { sessions: [] }; }
}

function formatTime(totalSeconds) {
   const h = Math.floor(totalSeconds / 3600);
   const m = Math.floor((totalSeconds % 3600) / 60);
   const s = totalSeconds % 60;
   return `${String(h).padStart(2, '0')}г ${String(m).padStart(2, '0')}хв ${String(s).padStart(2, '0')}с`;
}

function createProgressBar(currentSec, goalHours) {
   const goalSec = goalHours * 3600;
   const percentage = Math.min(Math.floor((currentSec / goalSec) * 100), 100);
   const width = 12;
   const completed = Math.floor((percentage / 100) * width);
   const bar = chalk.green('█'.repeat(completed)) + chalk.gray('░'.repeat(width - completed));
   return `${bar} ${percentage}%`;
}

const arg = process.argv[2];

// --- ЛОГІКА ЗАПУСКУ ---
if (arg === 'start') {
   const startTime = Date.now();
   let isExiting = false;

   console.log('\n' + chalk.bgBlue.white(' TRACKER ') + chalk.cyan(' Сесія розпочата: ' + new Date().toLocaleTimeString()));

   const child = spawn('npx', ['vite'], { stdio: 'inherit', shell: true });

   // ТАЙМЕР ПЕРЕРВИ
   const breakTimer = setInterval(() => {
      process.stdout.write('\n' + chalk.bgRed.white.bold(' ☕ ПЕРЕРВА! ') + chalk.bold.red(` Ви працюєте вже ${BREAK_MINUTES} хв. Зробіть паузу!\n`));
   }, 1000 * 60 * BREAK_MINUTES);

   const handleExit = () => {
      if (isExiting) return;
      isExiting = true;
      clearInterval(breakTimer);

      const durationSec = Math.floor((Date.now() - startTime) / 1000);

      if (durationSec > 5) {
         const stats = loadStats();
         stats.sessions.push({
            start: new Date(startTime).toISOString(),
            duration: durationSec
         });
         fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
         process.stdout.write('\n' + chalk.bgGreen.black(' SAVED ') + ` Працювали: ${formatTime(durationSec)}\n`);
      }
      process.exit();
   };

   process.once('SIGINT', handleExit);
   child.on('exit', handleExit);
}

// --- ЛОГІКА СТАТИСТИКИ (БЛОК, ЯКОГО БРАКУВАЛО) ---
if (arg === 'stat') {
   const stats = loadStats();

   if (!stats.sessions || stats.sessions.length === 0) {
      console.log(chalk.yellow('\nℹ️ Статистика порожня. Попрацюйте трохи!'));
      process.exit();
   }

   const table = new Table({
      head: [chalk.blue('Дата'), chalk.blue('Час роботи'), chalk.blue('Прогрес дня')],
      style: { head: [], border: [] }
   });

   const dailyTotals = {};
   let totalSec = 0;

   stats.sessions.forEach(s => {
      const date = new Date(s.start).toLocaleDateString('uk-UA');
      dailyTotals[date] = (dailyTotals[date] || 0) + s.duration;
      totalSec += s.duration;
   });

   // Сортування дат та наповнення таблиці
   Object.keys(dailyTotals).sort((a, b) => {
      const parseDate = (d) => new Date(d.split('.').reverse().join('-'));
      return parseDate(a) - parseDate(b);
   }).forEach(date => {
      table.push([
         date,
         formatTime(dailyTotals[date]),
         createProgressBar(dailyTotals[date], DAILY_GOAL_HOURS)
      ]);
   });

   console.log(chalk.bold.magenta('\n📊 ВАШ ПРОГРЕС ПО ПРОЄКТУ:'));
   console.log(table.toString());
   console.log(chalk.bold.bgGreen.black(` УСЬОГО ВІДПРАЦЬОВАНО: ${formatTime(totalSec)} `) + '\n');
}
