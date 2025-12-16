import { Task, DaySchedule } from '../models';

function task(id: string, name: string, start: string, end?: string, category?: Task['category'], contributesToDay = true): Task {
  return { id, name, start, end, category, contributesToDay, checked: false };
}

export function defaultDay(dateISO: string): DaySchedule {
  const tasks: Task[] = [
    task('t-6-alarm', '6 AM Alarm', '06:00', undefined, 'morning', false),
    task('t-m-drink', 'Drink water', '06:00', undefined, 'morning'),
    task('t-m-pray', 'Praying', '06:10', undefined, 'morning'),
    task('t-m-med', 'Meditation 3-6-9', '06:20', undefined, 'morning'),
    task('t-m-silence', 'Silence', '06:30', undefined, 'morning'),
    task('t-m-ex', 'Exercise', '06:45', undefined, 'morning'),
    task('t-m-visual', 'Visualize the day', '07:15', undefined, 'morning'),
    task('t-m-read', 'Reading/Podcast', '07:30', undefined, 'morning'),
    task('t-breakfast', 'Breakfast', '08:00', '08:30', 'breakfast'),
    task('t-code', 'Programming & coding study', '08:30', '12:00', 'work'),
    task('t-lunch', 'Lunch', '12:00', '12:30', 'lunch'),
    task('t-dutch', 'Dutch class', '13:00', '16:30', 'class'),
    task('t-light-ex', 'Light exercise', '17:00', '18:00', 'exercise'),
    task('t-dinner', 'Dinner', '18:30', '19:00', 'dinner'),
    task('t-22-alarm', '10 PM Alarm', '22:00', undefined, 'evening', false),
  ];
  return { dateISO, tasks, notes: '', expenses: [], alarms: { sixAM: true, tenPM: true } };
}

export function computeDayProgress(schedule: DaySchedule) {
  const contributing = schedule.tasks.filter(t => t.contributesToDay);
  const done = contributing.filter(t => t.checked);
  const percent = contributing.length ? Math.round((done.length / contributing.length) * 100) : 0;
  const morning = schedule.tasks.filter(t => t.category === 'morning' && t.contributesToDay);
  const morningDone = morning.filter(t => t.checked);
  const morningPercent = morning.length ? Math.round((morningDone.length / morning.length) * 100) : 0;
  return { percent, morningPercent };
}

export function computeWeekProgress(days: DaySchedule[]) {
  const all = days.map(d => computeDayProgress(d).percent);
  const avg = all.length ? Math.round(all.reduce((a,b)=>a+b,0) / all.length) : 0;
  return { average: avg, perDay: all };
}

export function computeRemaining(schedule: DaySchedule) {
  const remaining = schedule.tasks.filter(t => t.contributesToDay && !t.checked).length;
  const total = schedule.tasks.filter(t => t.contributesToDay).length;
  const percentRemaining = total ? Math.round((remaining / total) * 100) : 0;
  return { remaining, total, percentRemaining };
}
