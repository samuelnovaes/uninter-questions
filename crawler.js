import dotenv from 'dotenv';
import puppeteer from 'puppeteer';
import fs from 'fs/promises';

dotenv.config();

const { RU, SENHA } = process.env;

if(!RU || !SENHA) {
  throw new Error('RU e/ou senha não definido no arquivo .env');
}

const homePage = 'https://univirtus.uninter.com/ava/web/#/';
const repositoryPath = './public/repository.json';

const repository = JSON.parse(await fs.readFile(repositoryPath));

const browser = await puppeteer.launch({
  headless: true,
  defaultViewport: null,
  protocolTimeout: 0
});

const page = (await browser.pages())[0];

const log = (message) => {
  console.clear();
  console.log(message);
};

const click = async (node) => {
  const element = typeof node == 'string' ? await page.$(node) : node;
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

const parseQuestions = async (btnAnswer) => {
  await click(btnAnswer);
  await waitFor('#conteudoAvaliacao', 'div.show');

  const subjectName = await getText(page, '#sidebarCurrentArea span:first-child');
  const questionsElements = await page.$$('div.show');

  const subject = repository.find((item) => item.subject === subjectName) || {
    id: crypto.randomUUID(),
    subject: subjectName,
    questions: []
  };

  for (const questionElement of questionsElements) {
    const choicesElements = await questionElement.$$('.question-choice');
    const questionTexts = await questionElement.$$('.question-text');

    if (!await questionElement.$('.question-choice-label')) {
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

  if (!repository.includes(subject)) {
    repository.push(subject);
  }

  await click('#avaliacaoUsuarioHistoricoVoltar');
  await waitFor('.btnDetalhes');
};

const parseExercise = async (detailLink) => {
  await click(detailLink);
  await waitFor('.btnDetalhes');
  for await (const element of iterate('.corpoListaAvaliacaoUsuario')) {
    if (await element.$('.nota')) {
      await parseQuestions(await element.$('.btnDetalhes'));
    }
  }
  await click('#avaliacaoUsuarioListaVoltar');
  await waitFor('#theList', '.detalhesAvaliacaoUsuario');
};

const parseSubject = async (id) => {
  await click(`#${id} .link-disciplina`);
  await waitFor('#divMenuLateralSala', '#leftSidebarItemView header');
  await click((await page.$$('#leftSidebarItemView header a'))[1]);
  await waitFor('#theList', '.detalhesAvaliacaoUsuario, .alert-danger');
  for await (const element of iterate('.detalhesAvaliacaoUsuario')) {
    await parseExercise(element);
  }
  await click('a[href="#/ava"]');
  await waitFor('.titulo-status', '.sv-item');
};

log('Acessando AVA');
await page.goto(homePage, { timeout: 0 });
await waitFor('input#ru');

log('Entrando com RU e senha');
await page.type('input#ru', process.env.RU);
await page.type('input#senha', process.env.SENHA);
await click('#loginBtn');

log('Consultando cursos');
await waitFor('#loginBoxAva');
await click('#loginBoxAva');
await waitFor('#curso_634');

log('Acessando curso ADS');
await click('#curso_634 a');
await waitFor('.titulo-status', '.sv-item');

const subjects = await page.$$('.sv-item');

log('Realizando varredura: 0%');
for (const [i, element] of subjects.entries()) {
  const id = await page.evaluate((el) => el.id, element);
  if (/disciplina_\d+/.test(id)) {
    await parseSubject(id);
  }
  log(`Realizando varredura: ${parseInt(((i + 1) / subjects.length) * 100)}%`);
}

log('Finalizando');
await fs.writeFile(repositoryPath, JSON.stringify(repository));
await browser.close();
