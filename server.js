'use strict';
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'serv-secret-key-2026',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 8 * 60 * 60 * 1000 }
}));

// ATENÇÃO: credenciais em código são apenas para protótipo.
// Em produção, autentique no back-end com senhas criptografadas (bcrypt).
const USERS = [
  { username: 'joaohpf',  password: '123654jj', role: 'dev',       nome: 'João Henrique' },
  { username: 'gustavol', password: '123654jj', role: 'professor',  nome: 'Gustavo Lopes' },
  { username: 'pedros',   password: '123654jj', role: 'aluno',      nome: 'Pedro Simon'   },
];

function getInitials(nome) {
  return nome.split(' ').filter(Boolean).slice(0, 2).map(x => x[0].toUpperCase()).join('');
}

// ── Dados iniciais por sessão ──────────────────────────────────────────────
function createInitialData(nome) {
  return {
    noteSeq: 3,
    FREQ: {
      'Língua Portuguesa': ['12/03', '02/04'],
      'Matemática': [],
      'Ciências': ['18/03'],
      'História': ['05/03', '19/03', '09/04', '23/04'],
      'Geografia': ['26/03'],
      'Arte': [],
      'Música': ['11/03', '15/04'],
      'Educação Física': ['08/03', '22/03', '12/04', '26/04', '10/05']
    },
    NOTAS: {
      'Língua Portuguesa': [8.5, 7.0, 9.0],
      'Matemática': [6.0, 5.5, 7.5],
      'Ciências': [9.0, 8.0, 8.5],
      'História': [4.0, 5.0, 5.5],
      'Geografia': [7.0, 6.5, 8.0],
      'Arte': [9.5, 9.0, 10.0],
      'Música': [8.0, 7.5, 8.5],
      'Educação Física': [3.5, 5.0, 6.0]
    },
    CALENDARIO: {
      'Segunda': [
        { m: 'Língua Portuguesa', a: 'Interpretação de texto: crônicas', act: true },
        { m: 'Matemática', a: 'Equações do 1º grau — Lista 3' },
        { m: 'Ciências', a: 'Sistema digestório (resumo)' }
      ],
      'Terça': [
        { m: 'História', a: 'Brasil Colônia — questionário', act: true },
        { m: 'Geografia', a: 'Mapas climáticos (atividade)' },
        { m: 'Arte', a: 'Releitura de obra modernista' }
      ],
      'Quarta': [
        { m: 'Matemática', a: 'Geometria: áreas e perímetros' },
        { m: 'Educação Física', a: 'Fundamentos do voleibol' },
        { m: 'Música', a: 'Ritmo e compasso — prática', act: true }
      ],
      'Quinta': [
        { m: 'Língua Portuguesa', a: 'Produção textual: dissertação', act: true },
        { m: 'Ciências', a: 'Experimento: densidade' },
        { m: 'História', a: 'Revolução Industrial — seminário' }
      ],
      'Sexta': [
        { m: 'Geografia', a: 'Globalização — debate em grupo' },
        { m: 'Arte', a: 'Entrega do portfólio', act: true },
        { m: 'Educação Física', a: 'Avaliação física' }
      ]
    },
    RANKING: [
      { n: 'Ana Beatriz Lima', s: '9º Ano A', p: 1480 },
      { n: 'João H. P. Firmiano', s: '9º Ano A', p: 1395 },
      { n: 'Pedro Henrique Souza', s: '8º Ano B', p: 1320 },
      { n: 'Mariana Costa', s: '9º Ano B', p: 1180 },
      { n: 'Lucas Andrade', s: '7º Ano A', p: 1095 },
      { n: 'Sofia Ribeiro', s: '8º Ano A', p: 980 },
      { n: 'Gabriel Martins', s: '7º Ano B', p: 870 }
    ],
    QUIZ: [
      { mat: 'Língua Portuguesa', q: 'Qual figura de linguagem há em "Seus olhos são duas estrelas"?', ops: ['Metáfora', 'Hipérbole', 'Onomatopeia', 'Pleonasmo'], c: 0 },
      { mat: 'Matemática', q: 'Quanto é 15% de 240?', ops: ['24', '30', '36', '48'], c: 2 },
      { mat: 'Ciências', q: 'Qual órgão é responsável por bombear o sangue?', ops: ['Pulmão', 'Fígado', 'Coração', 'Rim'], c: 2 },
      { mat: 'História', q: 'Em que ano o Brasil proclamou sua independência?', ops: ['1500', '1808', '1822', '1889'], c: 2 },
      { mat: 'Geografia', q: 'Qual é o maior bioma brasileiro em extensão?', ops: ['Cerrado', 'Amazônia', 'Caatinga', 'Pantanal'], c: 1 }
    ],
    LIVROS: [
      { t: 'Gramática da Língua Portuguesa', au: 'Evanildo Bechara', area: 'Língua Portuguesa' },
      { t: 'Matemática — Ensino Fundamental', au: 'Luiz Roberto Dante', area: 'Matemática' },
      { t: 'Ciências: Vida e Ambiente', au: 'F. Gewandsznajder', area: 'Ciências' },
      { t: 'História do Brasil', au: 'Boris Fausto', area: 'História' },
      { t: 'Geografia Geral e do Brasil', au: 'João C. Moreira', area: 'Geografia' },
      { t: 'A História da Arte', au: 'E. H. Gombrich', area: 'Arte' },
      { t: 'Teoria Musical Básica', au: 'Bohumil Med', area: 'Música' },
      { t: 'Educação Física Escolar', au: 'Suraya C. Darido', area: 'Educação Física' },
      { t: 'Dom Casmurro', au: 'Machado de Assis', area: 'Língua Portuguesa' },
      { t: 'Vidas Secas', au: 'Graciliano Ramos', area: 'Língua Portuguesa' },
      { t: 'Atlas Geográfico Escolar', au: 'IBGE', area: 'Geografia' },
      { t: 'O Cortiço', au: 'Aluísio Azevedo', area: 'Língua Portuguesa' }
    ],
    REQUERIMENTOS: [
      { tipo: 'Declaração de Matrícula', data: '14/05/2026', sit: 'Concluído' },
      { tipo: 'Atestado de Frequência', data: '02/05/2026', sit: 'Em análise' }
    ],
    SEMANA: {
      'Segunda': [
        { m: 'Língua Portuguesa', a: 'Entrega da redação dissertativa', prazo: 0 },
        { m: 'Matemática', a: 'Lista de exercícios — cap. 4', prazo: 3 }
      ],
      'Terça': [
        { m: 'História', a: 'Questionário: Brasil Colônia', prazo: 1 },
        { m: 'Geografia', a: 'Mapa climático (atividade)', prazo: 10 }
      ],
      'Quarta': [
        { m: 'Ciências', a: 'Relatório do experimento', prazo: 0 },
        { m: 'Educação Física', a: 'Avaliação física', prazo: 5 }
      ],
      'Quinta': [
        { m: 'Arte', a: 'Entrega do portfólio', prazo: 8 },
        { m: 'Música', a: 'Prática rítmica em dupla', prazo: 2 }
      ],
      'Sexta': [
        { m: 'Língua Portuguesa', a: 'Prova bimestral', prazo: 9 },
        { m: 'Matemática', a: 'Trabalho em grupo', prazo: 12 }
      ]
    },
    USER_EVENTS: { 'Segunda': [], 'Terça': [], 'Quarta': [], 'Quinta': [], 'Sexta': [] },
    NOTES: [
      { id: 1, titulo: 'Estudar para a prova de Matemática', dia: 'Sexta', texto: 'Revisar equações do 1º grau e geometria (áreas e perímetros).', cal: false },
      { id: 2, titulo: 'Levar material de Arte', dia: 'Quinta', texto: 'Tintas, pincéis e o portfólio para entrega.', cal: false }
    ],
    CARDAPIO: {
      'Segunda': { principal: 'Arroz, feijão e frango grelhado', salada: 'Alface e tomate', sobremesa: 'Banana', bebida: 'Suco de laranja' },
      'Terça': { principal: 'Macarrão à bolonhesa', salada: 'Cenoura ralada', sobremesa: 'Maçã', bebida: 'Suco de uva' },
      'Quarta': { principal: 'Arroz, feijão e carne moída', salada: 'Repolho', sobremesa: 'Gelatina', bebida: 'Água saborizada' },
      'Quinta': { principal: 'Galinhada com legumes', salada: 'Beterraba', sobremesa: 'Laranja', bebida: 'Suco de maracujá' },
      'Sexta': { principal: 'Peixe assado com purê', salada: 'Pepino', sobremesa: 'Melancia', bebida: 'Suco de caju' }
    },
    FORUM: [
      {
        nome: 'Coordenação Escolar', papel: 'escola', tempo: 'há 2 horas',
        texto: 'Lembrete: a reunião de pais e mestres acontece nesta sexta-feira (15/05), às 19h, no auditório. Contamos com a presença de todos os responsáveis.',
        comentarios: [
          { nome: 'Carlos (resp. do João)', tempo: 'há 1 hora', texto: 'Confirmado! Estarei presente.' },
          { nome: 'Sandra (resp. da Ana)', tempo: 'há 40 min', texto: 'Haverá lista de presença?' }
        ]
      },
      {
        nome: 'Profa. Marta Lima', papel: 'prof', tempo: 'há 5 horas',
        texto: 'Turma do 9º Ano: a entrega do portfólio de Arte foi prorrogada para quinta-feira. Qualquer dúvida, estou à disposição.',
        comentarios: [
          { nome: 'Carlos (resp. do João)', tempo: 'há 3 horas', texto: 'Obrigado pelo aviso, professora!' }
        ]
      }
    ]
  };
}

// Armazenamento de dados por sessão
const sessionData = new Map();

function getData(req) {
  const sid = req.session.id;
  if (!sessionData.has(sid)) {
    sessionData.set(sid, createInitialData(req.session.user.nome));
  }
  return sessionData.get(sid);
}

// Middleware de autenticação
function requireAuth(req, res, next) {
  if (!req.session.user) return res.status(401).json({ error: 'Não autenticado' });
  next();
}

// ── Rotas de autenticação ──────────────────────────────────────────────────
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Informe usuário e senha para entrar.' });
  }
  const user = USERS.find(u => u.username === username.toLowerCase() && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
  }
  req.session.user = { username: user.username, role: user.role, nome: user.nome };
  const data = getData(req);
  res.json({
    ok: true,
    user: { nome: user.nome, iniciais: getInitials(user.nome), role: user.role },
    data
  });
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.post('/api/auth/change-password', requireAuth, (req, res) => {
  const { newPass, confirm } = req.body;
  if (!newPass || newPass.length < 6) {
    return res.status(400).json({ error: 'A nova senha deve ter ao menos 6 caracteres.' });
  }
  if (newPass !== confirm) {
    return res.status(400).json({ error: 'As senhas não coincidem.' });
  }
  getData(req).password = newPass;
  res.json({ ok: true });
});

// ── Anotações ──────────────────────────────────────────────────────────────
app.get('/api/notes', requireAuth, (req, res) => {
  res.json(getData(req).NOTES);
});

app.post('/api/notes', requireAuth, (req, res) => {
  const { titulo, dia, texto } = req.body;
  if (!titulo) return res.status(400).json({ error: 'Informe um título para a anotação.' });
  const db = getData(req);
  const note = { id: db.noteSeq++, titulo, dia, texto: texto || '', cal: false };
  db.NOTES.unshift(note);
  res.json(note);
});

app.delete('/api/notes/:id', requireAuth, (req, res) => {
  const db = getData(req);
  const id = parseInt(req.params.id);
  db.NOTES = db.NOTES.filter(n => n.id !== id);
  res.json({ ok: true });
});

app.patch('/api/notes/:id/calendar', requireAuth, (req, res) => {
  const db = getData(req);
  const id = parseInt(req.params.id);
  const note = db.NOTES.find(n => n.id === id);
  if (!note) return res.status(404).json({ error: 'Anotação não encontrada.' });
  note.cal = true;
  if (db.USER_EVENTS[note.dia]) db.USER_EVENTS[note.dia].push(note.titulo);
  res.json({ ok: true });
});

// ── Fórum ──────────────────────────────────────────────────────────────────
app.post('/api/forum/:idx/comment', requireAuth, (req, res) => {
  const db = getData(req);
  const idx = parseInt(req.params.idx);
  if (idx < 0 || idx >= db.FORUM.length) {
    return res.status(404).json({ error: 'Post não encontrado.' });
  }
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Escreva um comentário.' });
  const comment = { nome: 'Carlos (resp. do João)', tempo: 'agora', texto: text };
  db.FORUM[idx].comentarios.push(comment);
  res.json(comment);
});

// ── Requerimentos ──────────────────────────────────────────────────────────
app.get('/api/requests', requireAuth, (req, res) => {
  res.json(getData(req).REQUERIMENTOS);
});

app.post('/api/requests', requireAuth, (req, res) => {
  const { tipo } = req.body;
  if (!tipo) return res.status(400).json({ error: 'Informe o tipo de requerimento.' });
  const db = getData(req);
  const d = new Date().toLocaleDateString('pt-BR');
  const item = { tipo, data: d, sit: 'Em análise' };
  db.REQUERIMENTOS.unshift(item);
  res.json(item);
});

// ── Notas (grades) ─────────────────────────────────────────────────────────
app.put('/api/grades', requireAuth, (req, res) => {
  const { materia, notas } = req.body;
  if (!materia || !Array.isArray(notas)) {
    return res.status(400).json({ error: 'Dados inválidos.' });
  }
  getData(req).NOTAS[materia] = notas;
  res.json({ ok: true });
});

// ── Iniciar servidor ───────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`SeRV rodando em http://localhost:${PORT}`);
});
