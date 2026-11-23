const modelChoice = document.querySelector('#model-choice');
const trainingChoice = document.querySelector('#mode-choice');
const auditChoice = document.querySelector('#audit-choice');

function updateTable() {
  const selected = trainingChoice.value + '-' + modelChoice.value;
  for (const panel of document.querySelectorAll('.matrix-view')) {
    panel.hidden = panel.dataset.config !== selected;
  }
  for (const row of document.querySelectorAll('[data-audit]')) {
    row.hidden = !auditChoice.checked;
  }
}

for (const control of [modelChoice, trainingChoice, auditChoice]) {
  control.addEventListener('change', updateTable);
}
updateTable();

const rlSetting = document.querySelector('#rl-setting');
function updateRlTables() {
  for (const panel of document.querySelectorAll('[data-rl-setting]')) {
    panel.hidden = panel.dataset.rlSetting !== rlSetting.value;
  }
}
rlSetting.addEventListener('change', updateRlTables);
updateRlTables();
