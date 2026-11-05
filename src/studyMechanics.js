// Sixteen records from the CSV used by the public dashboard. USD is annual.
// https://raw.githubusercontent.com/vqrca/dashboard_salarios_dados/refs/heads/main/dados-imersao-final.csv
export const sample = [
  [2025,'senior','integral','media',214000], [2024,'pleno','integral','media',70000],
  [2024,'senior','parcial','media',220000], [2024,'senior','integral','pequena',94444],
  [2024,'senior','integral','media',166666], [2025,'senior','integral','media',136000],
  [2024,'junior','integral','grande',86153], [2024,'senior','parcial','media',96600],
  [2024,'senior','integral','grande',185000], [2024,'senior','integral','media',131958],
  [2025,'pleno','integral','media',158800], [2024,'junior','integral','grande',57250],
  [2024,'senior','contrato','media',130760], [2024,'senior','integral','grande',105100],
  [2024,'senior','integral','media',79175], [2024,'senior','integral','media',179000],
];
const filters = [2024, 'senior', 'integral', 'media'];
const rejectedAt = sample.map(row => filters.findIndex((criterion, i) => row[i] !== criterion));
export const unit = x => Math.max(0, Math.min(1, x));
export function blend(x) {
  const p = unit(x);
  return p * p * (3 - 2 * p);
}
export function membership(index, progress) {
  const step = rejectedAt[index];
  return step < 0 ? 1 : 1 - blend(progress * 4 - step);
}
export function meanAt(progress) {
  let total = 0, count = 0;
  sample.forEach((row, i) => {
    const weight = membership(i, progress);
    total += row[4] * weight;
    count += weight;
  });
  return total / count;
}

export function breathAt(progress) {
  const beat = Math.min(progress * 3, 2.99999);
  const index = Math.floor(beat);
  return { channel: [1, 5, 3][index], phase: beat - index, pressure: Math.sin(Math.PI * (beat - index)) };
}

// MOV R0, 5 in the team's bytecode: opcode, destination, immediate operand.
export const instruction = [0x05, 0x00, 0x05];
