import dotenv from 'dotenv';
import puppeteer from 'puppeteer';
import fs from 'fs-extra';
import chalk from 'chalk';
import inquirer from 'inquirer';

dotenv.config();

const { RU, SENHA } = process.env;
const login = !!(RU && SENHA);

const answers = await inquirer.prompt([
  {
    type: 'confirm',
    name: 'all',
    message: 'Deseja varrer todas as disciplinas, mesmo as já concluídas?',
    default: true
  }
]);

const homePage = 'https://univirtus.uninter.com/ava/web/#/';
const repositoryPath = './public/repository.json';
const subjectIdRegExp = /disciplina_(\d+)/;

await fs.ensureFile(repositoryPath);
const repository = JSON.parse(await fs.readFile(repositoryPath, 'utf-8') || '[]');

const browser = await puppeteer.launch({
  headless: login,
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

const parseQuestions = async (btnAnswer, subjectId, subjectName) => {
  await click(btnAnswer);
  await waitFor('#conteudoAvaliacao', 'div.show, div.alert-warning');

  const questionsElements = await page.$$('div.show');

  const subject = repository.find((item) => item.id === subjectId) || {
    id: subjectId,
    subject: subjectName,
    questions: []
  };

  for (const questionElement of questionsElements) {
    if (!await questionElement.$('.question-choice-label')) {
      continue;
    }

    const questionId = await page.evaluate((el) => el.dataset.idq, questionElement);

    if (subject.questions.some((item) => item.id === questionId)) {
      continue;
    }

    const isWrong = !!(await questionElement.$('.label-danger'));
    const hasRightAnswer = !!(await questionElement.$('.question-choice-active'));

    if (isWrong && !hasRightAnswer) {
      continue;
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

    if (!question.options.some(option => option.rightAnswer)) {
      continue;
    }

    subject.questions.push(question);
  }

  if (!repository.includes(subject)) {
    repository.push(subject);
  }

  await click('#avaliacaoUsuarioHistoricoVoltar');
  await waitFor('.btnDetalhes');
};

const parseExercise = async (detailLink, subjectId, subjectName) => {
  await click(detailLink);
  await waitFor('.btnDetalhes');
  for await (const element of iterate('.corpoListaAvaliacaoUsuario')) {
    if (await element.$('.nota')) {
      await parseQuestions(await element.$('.btnDetalhes'), subjectId, subjectName);
    }
  }
  await click('#avaliacaoUsuarioListaVoltar');
  await waitFor('#theList', '.detalhesAvaliacaoUsuario');
};

const progress = (part, total) => {
  const length = 10;
  const p = Math.round((part / total) * length);
  const bar = '|'.repeat(p).padEnd(length, '_');
  return `${bar} [${part}/${total}]`;
};

const logProgress = (
  subjectIndex,
  subjectTotal,
  exerciseIndex,
  exerciseTotal,
  subjectName,
  exerciseName
) => {
  log(
    'Realizando varredura...\n\n' +
    `${progress(subjectIndex, subjectTotal)} ${subjectName}\n` +
    (exerciseName ? `${chalk.gray(`${progress(exerciseIndex, exerciseTotal)} ${exerciseName}`)}\n` : '\n')
  );
};

const parseSubject = async (id, index) => {
  await click(`#disciplina_${id} .link-disciplina`);
  await waitFor('#divMenuLateralSala', '#leftSidebarItemView header');
  await click((await page.$$('#leftSidebarItemView header a'))[1]);
  await waitFor('#theList', '.titulo-avaliacao, .alert-danger');
  const subjectName = await getText(page, '#sidebarCurrentArea span:first-child');
  const length = (await page.$$('.detalhesAvaliacaoUsuario')).length;
  let i = 1;
  if (length === 0) {
    logProgress(index, subjects.length, i, length, subjectName);
  }
  for await (const element of iterate('.detalhesAvaliacaoUsuario')) {
    const parent = await (await (await element.getProperty('parentNode')).getProperty('parentNode')).getProperty('parentNode');
    const exerciseName = (await getText(parent, '.text-muted')).replace('<strong>Título: </strong>', '').trim();
    logProgress(index, subjects.length, i, length, subjectName, exerciseName);
    await parseExercise(element, id, subjectName);
    i++;
  }
  await click('a[href="#/ava"]');
  await waitFor('.titulo-status', '.sv-item');
};

log('Acessando AVA...');
await page.goto(homePage, { timeout: 0 });
await waitFor('input#ru');

if (login) {
  await page.type('input#ru', RU);
  await page.type('input#senha', SENHA);
  await click('#loginBtn');
}

await waitFor('#loginBoxAva');
await click('#loginBoxAva');
await waitFor('.link-escola-meus-cursos');

log('Aguardando por modal de pesquisa...');
try {
  await page.waitForSelector('#podeResponderDepois', { timeout: 5000 });
} catch { }
const btnResponderDepois = await page.$('#podeResponderDepois');
if (btnResponderDepois) {
  await click(btnResponderDepois);
}

await click('.link-escola-meus-cursos');
await waitFor('#curso_634');
await click('#curso_634 .link-curso');
await waitFor('.titulo-status', '.sv-item');

const topics = await page.$$('.sv-item');
const subjects = [];

for (const topic of topics) {
  const id = await page.evaluate((el) => el.id, topic);
  const done = await topic.$('.icon-thumbs-o-up');
  if (subjectIdRegExp.test(id) && (!done || answers.all)) {
    subjects.push(id.match(subjectIdRegExp)[1]);
  }
}

for (const [i, id] of subjects.entries()) {
  await parseSubject(id, i + 1);
}

log('Varredura finalizada.');
await fs.writeFile(repositoryPath, JSON.stringify(repository));
await browser.close();
