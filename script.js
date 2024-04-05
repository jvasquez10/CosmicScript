const editor = document.querySelector('.editor')
const lineNumbers = document.querySelector('.line-numbers')

function updateLineNumbers() {
  const lines = editor.value.split('\n').length
  lineNumbers.textContent =
    Array.from({ length: lines }, (_, i) => `${i + 1}`).join('\n') + '\n'
}

updateLineNumbers()

const keywords = [
  'Ceres',
  'Haumea',
  'Makemake',
  'Eris',
  'Orcus',
  'Vesta.Pallas',
  'Varuna',
  'Sedna',
  'Hidra',
  'Quaoar',
  'Ixion',
]

function updateLineNumbers() {
  const editor = document.getElementById('editor')
  const lines = editor.value.split('\n').length
  const lineNumbers = document.querySelector('.line-numbers')

  lineNumbers.innerHTML =
    Array.from({ length: lines }, (_, i) => `${i + 1}`).join('\n') + '\n'

  const regex = new RegExp('\\b(' + keywords.join('|') + ')\\b', 'g')
  editor.value = editor.value.replace(regex, '<span class="keyword">$1</span>')
}
