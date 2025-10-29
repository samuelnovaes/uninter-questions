import fs from 'fs-extra';

const filePath = './public/repository.json';

const text = await fs.readFile(filePath, 'utf-8');

const repositories = text
  .replace(/(<<<<<<<|>>>>>>>).*/g, '')
  .split('=======')
  .map((part) => JSON.parse(part));

const subjects = [];

for (const r of repositories) {
  for (const s of r) {
    const subject = subjects.find((item) => item.id === s.id);
    if (subject) {
      for (const q of s.questions) {
        const question = subject.questions.find((item) => item.id === q.id);
        if(!question) {
          subject.questions.push(q);
        }
      }
    }
    else {
      subjects.push(s);
    }
  }
}

await fs.writeFile(filePath, JSON.stringify(subjects));
