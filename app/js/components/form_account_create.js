//===================================================================
//валидация формы создания аккаунта
//===================================================================
const accountForm = document.getElementById('createAccount');
if (accountForm) {

  const passwordField__inputNode = accountForm.querySelector('#password');
  const passwordField__hintNode = accountForm.querySelector('#passwordHint');
  const passwordField__strengthNode = passwordField__hintNode?.querySelector('.password-strength');

  if (!passwordField__inputNode || !passwordField__hintNode || !passwordField__strengthNode) return;

  // Защита от двойной инициализации
  if (passwordField__inputNode.dataset.jsPasswordHintBound === 'true') return;
  passwordField__inputNode.dataset.jsPasswordHintBound = 'true';

  // Делаем подсказку "живой" для скринридеров
  if (!passwordField__hintNode.hasAttribute('aria-live')) {
    passwordField__hintNode.setAttribute('aria-live', 'polite');
  }

  const passwordStrength__labelsRU = {
    0: 'нет пароля',
    1: 'очень слабый',
    2: 'слабый',
    3: 'средний',
    4: 'хороший',
    5: 'отличный'
  };

  function passwordStrength__computeLevel(pwd) {
    const v = (pwd || '').trim();
    if (!v) return 0;

    let score = 0;

    // Длина (до +3)
    if (v.length >= 8) score += 1;
    if (v.length >= 10) score += 1;
    if (v.length >= 12) score += 1;

    // Разнообразие (до +3)
    const hasLower = /[a-zа-яё]/.test(v);
    const hasUpper = /[A-ZА-ЯЁ]/.test(v);
    const hasDigit = /\d/.test(v);
    const hasSymbol = /[^A-Za-zА-Яа-яЁё0-9]/.test(v);
    const diversity = [hasLower, hasUpper, hasDigit, hasSymbol].filter(Boolean).length;
    if (diversity >= 2) score += 1;
    if (diversity >= 3) score += 1;
    if (diversity === 4) score += 1;

    // Штрафы
    let penalty = 0;
    const lower = v.toLowerCase();
    if (/^(.)\1+$/.test(v)) penalty += 3;           // один и тот же символ
    if (/(.)\1{2,}/.test(v)) penalty += 1;          // тройные повторы
    if (/0123|1234|2345|3456|4567|5678|6789|7890|9876|8765|7654|6543|5432|4321|3210|abcd|bcde|cdef|defg|efgh|fghi|ghij|hijk|ijkl|jklm|klmn|lmno|mnop|nopq|opqr|pqrs|qrst|rstu|stuv|tuvw|uvwx|vwxy|wxyz|qwer|wert|erty|rtyu|tyui|yuio|uiop|asdf|sdfg|dfgh|fghj|ghjk|hjkl|zxcv|xcvb|cvbn|vbnm/i.test(lower)) {
      penalty += 1;                                  // последовательности
    }
    const commonPwds = ['123456', 'qwerty', 'password', '111111', '123123', 'qwertyuiop', 'abc123', 'letmein', 'admin', 'welcome', 'monkey', 'dragon', 'football', 'iloveyou', '000000', '1q2w3e4r', 'zaq12wsx'];
    if (commonPwds.includes(lower)) penalty += 2;    // частые пароли
    if (/^\d+$/.test(v) || /^[A-Za-zА-Яа-яЁё]+$/.test(v)) penalty += 1; // только цифры или только буквы

    const level = Math.max(0, Math.min(5, score - penalty));
    return level;
  }

  function passwordStrength__renderToHint(pwd) {
    const level = passwordStrength__computeLevel(pwd);
    passwordField__strengthNode.dataset.level = String(level);
    passwordField__strengthNode.textContent = passwordStrength__labelsRU[level];
  }

  // Инициализация и live-обновление
  passwordStrength__renderToHint(passwordField__inputNode.value || '');
  passwordField__inputNode.addEventListener('input', (ev) => {
    passwordStrength__renderToHint(ev.currentTarget.value);
  });
}