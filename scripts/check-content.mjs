import { existsSync, readFileSync } from 'node:fs';
import { projects, chapters, profile } from '../src/data/portfolio.js';
import assert from 'node:assert/strict';
import { certificates } from '../src/data/certificates.js';
const expected=['cortech','freesb','betterway','roomi-reservas','roomi-builder','sollie'];
assert.deepEqual(projects.map(p=>p.id),expected,'A seleção deve ser exatamente a lista pedida pelo usuário.');
assert.equal(new Set(projects.map(p=>p.repo)).size,6,'Cada projeto deve ter um repositório distinto.');
assert.equal(new Set(projects.map(p=>p.live)).size,6,'Cada projeto deve ter seu próprio deploy.');
assert.equal(profile.email,'mourygodoy@gmail.com');
assert.equal(chapters.length,3,'A trajetória simplificada preserva CESAR, Boop e Roomi.');
for(const p of projects){assert.match(p.repo,/^[\w-]+\/[\w-]+$/);assert.equal(new URL(p.live).protocol,'https:');assert.equal(typeof p.private,'boolean');}
for(const p of [...projects,...chapters])assert(existsSync(`public${p.image}`),`Imagem ausente: ${p.image}`);
for(const f of ['fonts/sora-latin.woff2','fonts/hanken-latin.woff2','images/arthur-moury.jpg','Arthur-Moury-CV.pdf'])assert(existsSync(`public/${f}`),`Asset ausente: ${f}`);
const app=readFileSync('src/App.jsx','utf8');
const hero=readFileSync('src/KineticHero.jsx','utf8');
const carousel=readFileSync('src/Certificates.jsx','utf8');
const surface=app+hero+carousel;
for(const id of ['inicio','sobre','trajetoria','projetos','certificados','processo','curriculo','contato'])assert(surface.includes(`id="${id}"`),`Âncora ausente: ${id}`);
assert.equal((surface.match(/src="\/images\/arthur-moury.jpg"/g)||[]).length,1,'O retrato deve aparecer somente na abertura.');
for(const removed of ['amfgs@cesar.school','recife.webp','badge','barcode','Vários caminhos','O acervo completo','Projetos selecionados','Seis projetos, de perto.','Formação & experiência','Aprendizados que se conectam','Sobre mim'])assert(!surface.includes(removed),`Conteúdo antigo presente: ${removed}`);
assert(app.indexOf('<About/>')<app.indexOf('<ProjectGallery'),'Sobre mim deve vir antes dos projetos.');
assert(!app.includes('Rua Luiz'),'Não publicar endereço residencial preciso.');
assert(app.indexOf('<ProjectGallery')<app.indexOf('<Career'),'Projetos devem vir logo depois das informações.');
assert.equal(certificates.length,29,'Exibir todos os 29 arquivos da pasta.');
assert.equal(new Set(certificates.map(c=>c.id)).size,29,'Certificados distintos.');
for(const certificate of certificates){
  assert(existsSync(`public${certificate.image}`)); assert(existsSync(`public${certificate.thumbnail}`));
  assert.equal(new URL(certificate.url).hostname,'drive.google.com');
  assert(certificate.title && certificate.issuer && certificate.width>0 && certificate.height>0);
}
assert.equal(certificates.filter(c=>c.redacted).length,2,'Duas cópias visuais omitem identificação pessoal.');
assert(!/\d{3}\.\d{3}\.\d{3}-\d{2}/.test(surface+readFileSync('src/data/certificates.js','utf8')),'Não publicar CPF em texto.');
console.log('Conteúdo verificado: seis projetos, 29 certificados, ordem correta, contato e retrato único.');
