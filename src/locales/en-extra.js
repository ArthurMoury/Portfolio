import { certificates } from '../data/certificates';

const certificateTitles=[
'Pre-incubation 2026.1, Sollie','Claude Code 101','Claude 101','Introduction to Claude Cowork','Introduction to Agent Skills','Pre-incubation Program 2026.1','Vem Curtir o CESAR, exhibitor','AWS Cloud Foundations','Coding Challenges: Logic and Computational Thinking','Control Structures in Java','Java Programming Fundamentals','Project Challenges: Build a Winning Portfolio','Version Control with Git and GitHub','Introduction to Java and Its Development Environment','Introduction to the CI&T Bootcamp, Java & AWS Backend','Java Development Environment','Introduction to the Java Platform','Introduction to the Decola Tech Experience','PyLab Experience, workshop instructor','Contributing to an Open Source Project on GitHub','REC’n’Play Festival 2025','Selected for the Santander Bootcamp 2025','Python Essentials 1','5th TechDesign Showcase','Introduction to REST Applications','Decola Tech Avanade 2025 Launch Livestream','Data with Python Immersion','JavaScript Essentials 1','Spring Environment Setup'
];
export const extraMessages = {
  ...Object.fromEntries(certificates.map((certificate, index) => [certificate.title, certificateTitles[index]])),
  'Minha bagagem': 'My experience',
  'em projetos.': 'through projects.',
  'Ver projeto': 'View project',
  'Arraste para os lados para explorar os projetos. Use as setas do teclado para escolher.': 'Drag sideways to explore the projects. Use the arrow keys to choose one.',
  'Captura da landing page': 'Landing page screenshot',
};
