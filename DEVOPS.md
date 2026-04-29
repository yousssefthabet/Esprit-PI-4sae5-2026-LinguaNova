# Sprint DevOps - LinguaNova

Ce dossier contient la base demandee pour le sprint DevOps: conteneurisation, CI/CD, orchestration et monitoring.

## Conteneurisation

Tous les microservices Spring Boot disposent d'un `Dockerfile` dans `backend/microservices/*`.

Le frontend Angular dispose maintenant de:

- `LinguaNova/Dockerfile`
- `LinguaNova/nginx.conf`
- `LinguaNova/.dockerignore`

Le frontend est compile avec Node.js puis servi par Nginx. Nginx garde les routes SPA Angular et proxifie les appels API vers les microservices Docker.

## Orchestration locale

Depuis la racine du projet:

```bash
docker compose up --build
```

Services principaux:

- Frontend: http://localhost:4200
- Eureka: http://localhost:8762
- API Gateway: http://localhost:8193
- MySQL: localhost:3307
- Prometheus: http://localhost:9091
- Grafana: http://localhost:3002

Les ports exposes sur la machine peuvent etre changes avec un fichier `.env`. Un exemple est fourni dans `.env.example`. Cela evite les erreurs Docker quand un port est deja utilise par MySQL, Eureka ou un ancien lancement du projet.

Identifiants Grafana locaux:

- User: `admin`
- Password: `admin`

## Monitoring

Le dossier `monitoring/` configure:

- Prometheus pour collecter les metriques
- cAdvisor pour les metriques des conteneurs Docker
- Grafana avec Prometheus comme datasource preconfiguree

## CI/CD

Le pipeline GitHub Actions est dans `.github/workflows/ci.yml`.

Il contient:

- Build et tests frontend
- Verification Maven des microservices backend
- Build des images Docker via `docker compose build`
- Etape qualite SonarQube/SonarCloud si `SONAR_TOKEN` est configure dans les secrets GitHub

## Qualite du code

La configuration Sonar est dans `sonar-project.properties`.

Pour activer l'analyse:

1. Creer un projet SonarQube ou SonarCloud.
2. Ajouter le secret GitHub `SONAR_TOKEN`.
3. Adapter `sonar.projectKey` si le tuteur impose une cle precise.

## Choix d'automatisation

Le projet utilise un pipeline unique, ce qui reste conforme au mail du sprint. Cette approche centralise la verification frontend, backend, Docker et qualite dans un seul workflow lisible.
