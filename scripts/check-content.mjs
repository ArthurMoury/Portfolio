import { existsSync, readFileSync } from 'node:fs';
import { projects, chapters, faqs } from '../src/data/portfolio.js';
import assert from 'node:assert/strict';

assert.equal(projects.length,11,'O acervo inicial deve preservar os 11 projetos autorais encontrados.');
assert.equal(new Set(projects.map(p=>p.repo)).size,projects.length,'Não pode haver repositórios duplicados.');
assert.equal(chapters.length,4,'O template exige quatro capítulos.');
for(const record of [...projects,...chapters,...faqs]) assert(existsSync(`public${record.image}`),`Asset ausente: ${record.image}`);
for(const name of ['sora','hanken']) assert(existsSync(`public/fonts/${name}-latin.woff2`),`Fonte ausente: ${name}`);
for(const file of ['images/recife.webp','images/recife-mobile.webp','images/arthur-moury.webp','Arthur-Moury-CV.pdf']) assert(existsSync(`public/${file}`),`Arquivo ausente: ${file}`);
const app=readFileSync('src/App.jsx','utf8');
for(const id of ['inicio','projetos','trajetoria','processo','explorar','proxima-ideia','perguntas','contato']) assert(app.includes(`id="${id}"`),`Âncora ausente: ${id}`);
assert(!app.includes('Rua Luiz'),'Endereço residencial preciso não pertence ao conteúdo público.');
console.log('Conteúdo verificado: 11 projetos, 4 capítulos, imagens, fontes e âncoras presentes.');
