import dotenv from 'dotenv';
import puppeteer from 'puppeteer';
import fs from 'fs-extra';

dotenv.config();

const { RU, SENHA } = process.env;

const homePage = 'https://univirtus.uninter.com/ava/web/#/';
const repositoryPath = './public/repository.json';
const subjectIdRegExp = /disciplina_(\d+)/;

await fs.ensureFile(repositoryPath);
const repository = JSON.parse(await fs.readFile(repositoryPath, 'utf-8') || '[]');

const browser = await puppeteer.launch({
  headless: !!(RU && SENHA),
  defaultViewport: null,
  protocolTimeout: 0
});

const page = (await browser.pages())[0];

const log = (message) => {
  console.clear();
  console.log(message);
};

const click = async (node) => {
  const element = typeof node === 'string' ? await page.$(node) : node;
  await page.evaluate((el) => el.click(), element);
};

const waitFor = async (...selectors) => {
  for (const selector of selectors) {
    await page.waitForSelector(selector, { timeout: 0 });
  }
};

const getText = async (parent, selector) => {
  const element = await parent.$(selector);
  const text = await page.evaluate((el) => el.innerHTML, element);
  return text;
};

async function* iterate(selector) {
  let i = 0;
  while (true) {
    const elements = await page.$$(selector);
    if (i >= elements.length) {
      break;
    }
    yield elements[i];
    i++;
  }
};

async function isRightAnswer(choiceElement, hasRightAnswer) {
  if (hasRightAnswer) {
    return (await (await choiceElement.getProperty('className')).jsonValue()).includes('question-choice-active');
  }
  if (await choiceElement.$('.label-default')) {
    return true;
  }
  return false;
}

const parseQuestions = async (btnAnswer, subjectId) => {
  await click(btnAnswer);
  await waitFor('#conteudoAvaliacao', 'div.show');

  const subjectName = await getText(page, '#sidebarCurrentArea span:first-child');
  const questionsElements = await page.$$('div.show');

  const subject = repository.find((item) => item.id === subjectId) || {
    id: subjectId,
    subject: subjectName,
    questions: []
  };

  for (const questionElement of questionsElements) {
    if (!await questionElement.$('.question-choice-label')) {
      break;
    }

    const questionId = await page.evaluate((el) => el.dataset.idq, questionElement);

    if (subject.questions.some((item) => item.id === questionId)) {
      break;
    }

    const isWrong = !!(await questionElement.$('.label-danger'));
    const hasRightAnswer = !!(await questionElement.$('.question-choice-active'));

    if (isWrong && !hasRightAnswer) {
      break;
    }

    const question = {
      id: questionId,
      description: [],
      options: []
    };

    const questionTexts = await questionElement.$$('.question-text');
    for (const questionText of questionTexts) {
      question.description.push(await page.evaluate((el) => el.innerHTML, questionText));
    }

    const choicesElements = await questionElement.$$('.question-choice');
    for (const choiceElement of choicesElements) {
      question.options.push({
        name: await getText(choiceElement, '.question-choice-label'),
        description: await getText(choiceElement, '.question-choice-body'),
        rightAnswer: await isRightAnswer(choiceElement, hasRightAnswer)
      });
    }

    subject.questions.push(question);
  }

  if (!repository.includes(subject)) {
    repository.push(subject);
  }

  await click('#avaliacaoUsuarioHistoricoVoltar');
  await waitFor('.btnDetalhes');
};

const parseExercise = async (detailLink, subjectId) => {
  await click(detailLink);
  await waitFor('.btnDetalhes');
  for await (const element of iterate('.corpoListaAvaliacaoUsuario')) {
    if (await element.$('.nota')) {
      await parseQuestions(await element.$('.btnDetalhes'), subjectId);
    }
  }
  await click('#avaliacaoUsuarioListaVoltar');
  await waitFor('#theList', '.detalhesAvaliacaoUsuario');
};

const parseSubject = async (id) => {
  await click(`#disciplina_${id} .link-disciplina`);
  await waitFor('#divMenuLateralSala', '#leftSidebarItemView header');
  await click((await page.$$('#leftSidebarItemView header a'))[1]);
  await waitFor('#theList', '.detalhesAvaliacaoUsuario, .alert-danger');
  for await (const element of iterate('.detalhesAvaliacaoUsuario')) {
    await parseExercise(element, id);
  }
  await click('a[href="#/ava"]');
  await waitFor('.titulo-status', '.sv-item');
};

log('Acessando AVA');
await page.goto(homePage, { timeout: 0 });
await waitFor('input#ru');
if (RU && SENHA) {
  await page.type('input#ru', RU);
  await page.type('input#senha', SENHA);
  await click('#loginBtn');
}
await waitFor('#loginBoxAva');
await click('#loginBoxAva');
await waitFor('#curso_634');
await click('#curso_634 a');
await waitFor('.titulo-status', '.sv-item');

const topics = await page.$$('.sv-item');
const subjects = [];

for (const topic of topics) {
  const id = await page.evaluate((el) => el.id, topic);
  if (subjectIdRegExp.test(id)) {
    subjects.push(id.match(subjectIdRegExp)[1]);
  }
}

for (const [i, id] of subjects.entries()) {
  log(`Realizando varredura: ${i + 1}/${subjects.length}`);
  await parseSubject(id);
}

log('Varredura finalizada');
await fs.writeFile(repositoryPath, JSON.stringify(repository));
await browser.close();
