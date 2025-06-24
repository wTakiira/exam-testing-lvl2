// rubrr.split.e2e.test.ts
import { test, expect } from '@playwright/test';

const BASE_URL = 'https://rubrr.s3-main.oktopod.app/';

test('Page d’accueil et navigation vers le glossaire', async ({ page }) => {
  await page.goto(BASE_URL);
  await expect(page.getByRole('link', { name: 'RUBRR' })).toBeVisible();
  await page.getByRole('link', { name: '✨ Plus de 712 questions' }).click();
  await expect(page.getByRole('heading', { name: 'Toutes les questions' })).toBeVisible();
});

test('Recherche dans le glossaire', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.getByRole('link', { name: '✨ Plus de 712 questions' }).click();
  await page.getByRole('textbox').click();
  await page.getByRole('button', { name: 'Rechercher' }).click();
  await expect(page.getByRole('columnheader', { name: 'Question' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Tags' })).toBeVisible();
});

test('Accès à une fiche question et exploration du thème', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.getByRole('link', { name: '✨ Plus de 712 questions' }).click();
  await page.getByRole('row', { name: 'Quelles sont les bonnes' }).getByRole('link').click();
  await expect(page.getByRole('heading', { name: 'Quelles sont les bonnes' })).toBeVisible();
  await page.locator('.bg-blue-500').first().click();
  await page.locator('span:nth-child(2)').first().click();
  await expect(page.getByRole('heading', { name: 'Réponse du système :' })).toBeVisible();
  await expect(page.getByText('Mettre à jour les listes de')).toBeVisible();
  await expect(page.getByText('Réponse du système : Mettre')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Autres questions dans ce thème' })).toBeVisible();
});

test('Retour en arrière vers la page principale', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.getByRole('link', { name: '✨ Plus de 712 questions' }).click();
  await page.getByRole('row', { name: 'Quelles sont les bonnes' }).getByRole('link').click();
  await page.getByRole('link', { name: 'Retour' }).click();
  await page.getByRole('link', { name: 'Retour' }).click();
  await expect(page.getByRole('heading', { name: 'Questions pour un CDA' })).toBeVisible();
});

test('Vérifie la présence des liens de tags sur la page principale', async ({ page }) => {
  await page.goto(BASE_URL);
  const tags = [
    'Backend', 'Conception BDD', 'Design Pattern', 'DevOps', 'Docker', 'Frontend',
    'Green It', 'Html', 'Javascript', 'Micro Services', 'Mise en place Server', 'Multicouche',
    'NoSql', 'POO', 'Performance', 'React', 'S.O.L.I.D', 'SEO', 'Sql', 'Sécurite', 'Testing', 'Uml'
  ];
  for (const tag of tags) {
    await expect(page.getByRole('link', { name: tag })).toBeVisible();
  }
});

test('Soumission d’une réponse dans le champ libre', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.getByRole('textbox').click();
  await page.getByRole('textbox').fill('Réponse de test pour PlayWright');
  await page.getByRole('button', { name: 'Répondre' }).click();
});
