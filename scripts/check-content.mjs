import { existsSync, readFileSync } from 'node:fs';
import { projects, chapters, profile } from '../src/data/portfolio.js';
import assert from 'node:assert/strict';
const expected=['cortech','freesb','betterway','roomi-reservas','roomi-builder','sollie'];
assert.deepEqual(projects.map(p=>p.id),expected,'A seleção deve ser exatamente a lista pedida pelo usuário.');
assert.equal(new Set(projects.map(p=>p.repo)).size,6,'Cada projeto deve ter um repositório distinto.');
assert.equal(new Set(projects.map(p=>p.live)).size,6,'Cada projeto deve ter seu próprio deploy.');
assert.equal(profile.email,'mourygodoy@gmail.com');
assert.equal(chapters.length,3,'A trajetória simplificada preserva CESAR, Boop e Roomi.');
for(const p of projects){assert.match(p.repo,/^[\w-]+\/[\w-]+$/);assert.equal(new URL(p.live).protocol,'https:');assert.equal(typeof p.private,'boolean');}
for(const p of [...projects,...chapters])assert(existsSync(`public${p.image}`),`Imagem ausente: ${p.image}`);
for(const f of ['fonts/sora-latin.woff2','fonts/hanken-latin.woff2','images/arthur-moury.webp','Arthur-Moury-CV.pdf'])assert(existsSync(`public/${f}`),`Asset ausente: ${f}`);
const app=readFileSync('src/App.jsx','utf8');
for(const id of ['inicio','sobre','trajetoria','projetos','processo','curriculo','contato'])assert(app.includes(`id="${id}"`),`Âncora ausente: ${id}`);
assert.equal((app.match(/src="\/images\/arthur-moury.webp"/g)||[]).length,1,'O retrato deve aparecer somente na abertura.');
for(const removed of ['amfgs@cesar.school','recife.webp','badge','barcode','Vários caminhos','O acervo completo'])assert(!app.includes(removed),`Conteúdo antigo presente: ${removed}`);
assert(app.indexOf('<About/>')<app.indexOf('<ProjectGallery'),'Sobre mim deve vir antes dos projetos.');
assert(!app.includes('Rua Luiz'),'Não publicar endereço residencial preciso.');
console.log('Conteúdo verificado: seis projetos, deploys distintos, contato correto e retrato apenas na abertura.');
