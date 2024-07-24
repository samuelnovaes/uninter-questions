import puppeteer from 'puppeteer';
import fs from 'fs/promises';

const homePage = 'https://univirtus.uninter.com/ava/web/#/';
const repositoryPath = './repository.json';

const subjects = JSON.parse(await fs.readFile(repositoryPath));

const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: null,
  protocolTimeout: 0
});

const page = (await browser.pages())[0];

const getText = async (parent, selector) => {
  const element = await parent.$(selector);
  const text = await page.evaluate((el) => el.innerHTML, element);
  return text;
};

await page.goto(homePage);
await page.waitForSelector('a#logout', { timeout: 0 });

page.waitForSelector('#login-form', { timeout: 0 }).then(async () => {
  await fs.writeFile(repositoryPath, JSON.stringify(subjects, null, 2));
  process.exit();
});

(async function getQuestions () {
  await page.waitForSelector('#conteudoAvaliacao', { timeout: 0 });

  const subjectName = await getText(page, '#sidebarCurrentArea span:first-child');
  const questionsElements = await page.$$('div.show');

  const subject = subjects.find((item) => item.subject === subjectName) || {
    id: crypto.randomUUID(),
    subject: subjectName,
    questions: []
  };

  for (const questionElement of questionsElements) {
    const choicesElements = await questionElement.$$('.question-choice');
    const questionTexts = await questionElement.$$('.question-text');

    if(!await questionElement.$('.question-choice-label')) {
      break;
    }

    const question = {
      id: crypto.randomUUID(),
      description: [],
      options: []
    };

    for (const questionText of questionTexts) {
      question.description.push(await page.evaluate((el) => el.innerHTML, questionText));
    }

    if (subject.questions.some((item) => JSON.stringify(item.description) === JSON.stringify(question.description))) {
      break;
    }

    for (const choiceElement of choicesElements) {
      question.options.push({
        name: await getText(choiceElement, '.question-choice-label'),
        description: await getText(choiceElement, '.question-choice-body'),
        rightAnswer: (await (await choiceElement.getProperty('className')).jsonValue()).includes('question-choice-active')
      });
    }

    subject.questions.push(question);
  }

  if (!subjects.includes(subject)) {
    subjects.push(subject);
  }

  getQuestions();
})();
