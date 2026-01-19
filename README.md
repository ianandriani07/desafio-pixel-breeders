# 🎬 Cinéfilo — Avaliação de Filmes

Aplicação web para busca, visualização e avaliação de filmes utilizando a API pública do **TMDB**.
O usuário pode pesquisar filmes, visualizar detalhes (sinopse, elenco, data de lançamento) e atribuir uma nota de **1 a 5 estrelas**, podendo editar ou remover essa avaliação.

O projeto foi desenvolvido como **desafio técnico**, com foco em boas práticas, organização de código e clareza de setup para execução local.

---

## 🚀 Funcionalidades

### Funcionalidades principais

* Busca de filmes via API pública do TMDB
* Exibição de resultados com pôster e título
* Página/modal de detalhes do filme contendo:

  * Sinopse
  * Data de lançamento
  * Elenco
  * Avaliação do usuário (1 a 5 estrelas)
* Avaliação pode ser:

  * Criada
  * Editada
  * Removida
* Página **“Filmes Avaliados”** listando todos os filmes avaliados pelo usuário

### Pontos extras implementados

* Paginação
* Filtro por ano
* Dockerização completa (backend, frontend e banco)

---

## 🧱 Stack Utilizada

### Backend

* Python
* Flask
* Flask-SQLAlchemy
* Flask-Migrate (Alembic)
* PostgreSQL

### Frontend

* React
* Vite
* TypeScript
* Tailwind CSS
* shadcn-ui

### Infra

* Docker
* Docker Compose

---

## 🗂️ Estrutura do Projeto (resumida)

```text
.
├── backend/
│   ├── app/
│   │   ├── blueprints/
│   │   │   └── ratings/
│   │   │       ├── __init__.py
│   │   │       └── routes.py
│   │   │
│   │   ├── models/
│   │   │   ├── rating.py
│   │   │   └── user.py
│   │   │
│   │   ├── services/
│   │   │   ├── ratings_service.py
│   │   │   └── commands.py
│   │   │
│   │   ├── extensions.py
│   │   ├── config.py
│   │   └── __init__.py
│   │
│   ├── migrations/
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                # Componentes base do shadcn-ui
│   │   │   ├── header.tsx
│   │   │   ├── movie-card.tsx
│   │   │   ├── movie-card-skeleton.tsx
│   │   │   ├── movie-details-dialog.tsx
│   │   │   ├── pagination-bar.tsx
│   │   │   ├── rating-stars.tsx
│   │   │   └── year-filter.tsx
│   │   │
│   │   ├── hooks/                 # Hooks customizados
│   │   │   ├── use-movie-details-dialog.ts
│   │   │   ├── use-movie-search.ts
│   │   │   ├── use-trending-movies.ts
│   │   │   └── use-user-ratings.ts
│   │   │
│   │   ├── pages/                 # Páginas da aplicação
│   │   │   ├── home.tsx
│   │   │   └── rated.tsx
│   │   │
│   │   ├── services/              # Comunicação com APIs
│   │   │   ├── tmdb.ts
│   │   │   └── ratings.ts
│   │   │
│   │   ├── lib/                   
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   │
│   ├── index.html
│   ├── Dockerfile
│   ├── .env.example
│   └── components.json
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## ⚙️ Configuração de Variáveis de Ambiente

### Backend / Docker (raiz do projeto)

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

Conteúdo do `.env.example`:

```env
# Database
POSTGRES_DB=filmes
POSTGRES_USER=cinefolo
POSTGRES_PASSWORD=changeme
POSTGRES_PORT=5432

# Backend
SECRET_KEY=changeme
BACKEND_PORT=8000
DATABASE_URL=postgresql+psycopg2://cinefolo:changeme@db:5432/filmes

# CORS
FRONTEND_ORIGIN=http://localhost:8080
```

---

### Frontend

```bash
cp frontend/.env.example frontend/.env
```

Conteúdo do `.env.example`:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

> ⚠️ Apenas variáveis prefixadas com `VITE_` são expostas no frontend.

---

## 🔐 Gerando uma SECRET_KEY

A `SECRET_KEY` é utilizada pelo Flask para segurança interna.
Você pode gerar uma chave segura executando o seguinte comando no shell do Python:

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

Copie o valor gerado e utilize no `.env`.

---

## 🐳 Rodando o Projeto Localmente

Com Docker e Docker Compose instalados, execute:

```bash
docker-compose up --build
```

Esse comando irá:

* Subir o banco PostgreSQL
* Executar as migrations
* Iniciar o backend Flask
* Iniciar o frontend React

---

## 🌱 Seed de Dados

O projeto utiliza um **seed inicial** para criar um usuário padrão no banco de dados.

### Comando de seed

```bash
docker-compose exec backend flask seed
```

### Implementação do seed

```python
import click
from flask import Blueprint
from app.extensions import db
from app.models import User

bp = Blueprint("commands", __name__)

@bp.cli.command("seed")
def seed():
    user = db.session.get(User, 1)
    if user is None:
        db.session.add(User(id=1))
        db.session.commit()
    click.echo("Seed OK")
```

📌 **Observação importante**
Atualmente, a aplicação utiliza apenas **um usuário fixo** para simplificação do desafio.
No entanto, **o banco de dados e o modelo já estão preparados para múltiplos usuários**, com relacionamento adequado entre usuários e avaliações.

---

## 🧠 Decisões de Arquitetura

* **Separação clara de responsabilidades**:

  * `blueprints`: definição dos endpoints organizados por domínio
  * `services`: validações, regras auxiliares e comandos
  * `models`: entidades e relacionamentos do banco de dados
* Backend desacoplado do frontend
* API REST simples e previsível
* Dockerização pensada para execução com **um único comando**

---

## ✅ Considerações Finais

O projeto prioriza:

* Clareza
* Simplicidade
* Boas práticas
* Facilidade de execução

Sem overengineering, mas com estrutura suficiente para crescer.

---

👨‍💻 **Autor**
Projeto desenvolvido como desafio técnico para vaga de estágio em desenvolvimento web.
