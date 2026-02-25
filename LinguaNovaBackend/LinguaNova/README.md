# LinguaNova - API de Gestion d'Examens

## 📋 Description
API REST complète pour la gestion des examens, questions, réponses et profils étudiants développée avec Spring Boot 3.5.10.

## 🚀 Technologies Utilisées
- **Java 17**
- **Spring Boot 3.5.10**
- **Spring Data JPA**
- **MySQL 8**
- **Lombok**
- **SpringDoc OpenAPI 2.7.0** (Documentation Swagger)
- **Maven**

## 📦 Installation

### Prérequis
- Java 17 ou supérieur
- MySQL 8.0 ou supérieur
- Maven (ou utiliser le wrapper mvnw inclus)

### Configuration de la Base de Données
1. Créer une base de données MySQL nommée `LinguaNova` (ou elle sera créée automatiquement)
2. Modifier le fichier `application.properties` si nécessaire :
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/LinguaNova?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=
server.port=8086
```

### Lancement de l'Application
```bash
# Sous Windows
.\mvnw.cmd spring-boot:run

# Sous Linux/Mac
./mvnw spring-boot:run
```

## 📚 Documentation Swagger

### Accès à Swagger UI
Une fois l'application lancée, accédez à :
- **Swagger UI** : [http://localhost:8086/swagger-ui/index.html](http://localhost:8086/swagger-ui/index.html)
- **API Docs JSON** : [http://localhost:8086/v3/api-docs](http://localhost:8086/v3/api-docs)

Swagger UI vous permet de :
- ✅ Visualiser tous les endpoints disponibles
- ✅ Tester les APIs directement depuis le navigateur
- ✅ Voir les modèles de données et validations
- ✅ Consulter les codes de réponse HTTP

## 🗂️ Schéma de Base de Données

```
┌─────────────────┐       ┌──────────────┐       ┌─────────────────┐
│  StudentProfile │       │    Exam      │       │   Question      │
├─────────────────┤       ├──────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)      │       │ id (PK)         │
│ firstName       │       │ title        │       │ content         │
│ lastName        │       │ description  │       │ questionType    │
│ email           │       │ duration     │       │ points          │
│ level           │       │ passingScore │       │ exam_id (FK)    │
└─────────────────┘       │ status       │       └─────────────────┘
        │                 │ createdAt    │               │
        │                 └──────────────┘               │
        │                        │                       │
        │                        │                       │
        │                 ┌──────────────┐               │
        └────────────────▶│ StudentExam  │◀──────────────┘
                          ├──────────────┤               │
                          │ id (PK)      │               │
                          │ score        │               │
                          │ submittedAt  │               │
                          │ validated    │               │
                          │ student_id   │               │
                          │ exam_id      │               │
                          └──────────────┘               │
                                 │                       │
                                 │                       │
                          ┌──────────────┐        ┌─────────────┐
                          │StudentAnswer │        │   Reponse   │
                          ├──────────────┤        ├─────────────┤
                          │ id (PK)      │        │ id (PK)     │
                          │ answer       │        │ content     │
                          │ isCorrect    │        │ isCorrect   │
                          │ studentExam  │        │ question_id │
                          │ question_id  │        └─────────────┘
                          └──────────────┘
```

## 🔌 Endpoints API

### 👤 StudentProfile (Profil Étudiant)

#### Créer un profil étudiant
```http
POST http://localhost:8086/api/students
Content-Type: application/json

{
  "firstName": "Ahmed",
  "lastName": "Benali",
  "email": "ahmed.benali@example.com",
  "level": "Débutant"
}
```

#### Récupérer tous les étudiants
```http
GET http://localhost:8086/api/students
```

#### Récupérer un étudiant par ID
```http
GET http://localhost:8086/api/students/1
```

#### Mettre à jour un étudiant
```http
PUT http://localhost:8086/api/students/1
Content-Type: application/json

{
  "firstName": "Ahmed",
  "lastName": "Benali",
  "email": "ahmed.benali@example.com",
  "level": "Intermédiaire"
}
```

#### Supprimer un étudiant
```http
DELETE http://localhost:8086/api/students/1
```

---

### 📝 Exam (Examen)

#### Créer un examen
```http
POST http://localhost:8086/api/exams
Content-Type: application/json

{
  "title": "Examen de Français A1",
  "description": "Examen de niveau débutant en français",
  "duration": 60,
  "passingScore": 70.0,
  "status": "DRAFT"
}
```

**Valeurs possibles pour status** : `DRAFT`, `PUBLISHED`, `ARCHIVED`

#### Récupérer tous les examens
```http
GET http://localhost:8086/api/exams
```

#### Récupérer un examen par ID
```http
GET http://localhost:8086/api/exams/1
```

#### Mettre à jour un examen
```http
PUT http://localhost:8086/api/exams/1
Content-Type: application/json

{
  "title": "Examen de Français A1 - Version 2",
  "description": "Examen révisé",
  "duration": 90,
  "passingScore": 75.0,
  "status": "PUBLISHED"
}
```

#### Supprimer un examen
```http
DELETE http://localhost:8086/api/exams/1
```

#### Récupérer les examens par statut
```http
GET http://localhost:8086/api/exams/status/PUBLISHED
```

---

### ❓ Question

#### Créer une question
```http
POST http://localhost:8086/api/questions
Content-Type: application/json

{
  "content": "Quel est le pluriel de 'cheval' ?",
  "questionType": "MULTIPLE_CHOICE",
  "points": 10.0,
  "examId": 1
}
```

**Valeurs possibles pour questionType** : `MULTIPLE_CHOICE`, `TRUE_FALSE`, `SHORT_ANSWER`, `ESSAY`

#### Récupérer toutes les questions
```http
GET http://localhost:8086/api/questions
```

#### Récupérer une question par ID
```http
GET http://localhost:8086/api/questions/1
```

#### Récupérer les questions d'un examen
```http
GET http://localhost:8086/api/questions/exam/1
```

#### Mettre à jour une question
```http
PUT http://localhost:8086/api/questions/1
Content-Type: application/json

{
  "content": "Quel est le pluriel correct de 'cheval' ?",
  "questionType": "MULTIPLE_CHOICE",
  "points": 15.0,
  "examId": 1
}
```

#### Supprimer une question
```http
DELETE http://localhost:8086/api/questions/1
```

---

### ✅ Reponse (Réponse)

#### Créer une réponse
```http
POST http://localhost:8086/api/reponses
Content-Type: application/json

{
  "content": "chevaux",
  "isCorrect": true,
  "questionId": 1
}
```

#### Récupérer toutes les réponses
```http
GET http://localhost:8086/api/reponses
```

#### Récupérer une réponse par ID
```http
GET http://localhost:8086/api/reponses/1
```

#### Récupérer les réponses d'une question
```http
GET http://localhost:8086/api/reponses/question/1
```

#### Mettre à jour une réponse
```http
PUT http://localhost:8086/api/reponses/1
Content-Type: application/json

{
  "content": "chevaux",
  "isCorrect": true,
  "questionId": 1
}
```

#### Supprimer une réponse
```http
DELETE http://localhost:8086/api/reponses/1
```

---

### 📋 StudentExam (Examen Étudiant)

#### Assigner un examen à un étudiant
```http
POST http://localhost:8086/api/student-exams
Content-Type: application/json

{
  "studentProfileId": 1,
  "examId": 1,
  "score": 0.0,
  "validated": false
}
```

#### Récupérer tous les examens étudiants
```http
GET http://localhost:8086/api/student-exams
```

#### Récupérer un examen étudiant par ID
```http
GET http://localhost:8086/api/student-exams/1
```

#### Récupérer les examens d'un étudiant
```http
GET http://localhost:8086/api/student-exams/student/1
```

#### Récupérer les étudiants d'un examen
```http
GET http://localhost:8086/api/student-exams/exam/1
```

#### Soumettre un examen
```http
PUT http://localhost:8086/api/student-exams/1/submit
```

#### Valider un examen
```http
PUT http://localhost:8086/api/student-exams/1/validate
```

#### Mettre à jour le score
```http
PUT http://localhost:8086/api/student-exams/1/score
Content-Type: application/json

{
  "score": 85.5
}
```

#### Supprimer un examen étudiant
```http
DELETE http://localhost:8086/api/student-exams/1
```

---

### 📝 StudentAnswer (Réponse Étudiant)

#### Créer une réponse d'étudiant
```http
POST http://localhost:8086/api/student-answers
Content-Type: application/json

{
  "answer": "chevaux",
  "isCorrect": true,
  "studentExamId": 1,
  "questionId": 1
}
```

#### Récupérer toutes les réponses étudiants
```http
GET http://localhost:8086/api/student-answers
```

#### Récupérer une réponse étudiant par ID
```http
GET http://localhost:8086/api/student-answers/1
```

#### Récupérer les réponses d'un examen étudiant
```http
GET http://localhost:8086/api/student-answers/student-exam/1
```

#### Mettre à jour une réponse étudiant
```http
PUT http://localhost:8086/api/student-answers/1
Content-Type: application/json

{
  "answer": "chevaux",
  "isCorrect": true,
  "studentExamId": 1,
  "questionId": 1
}
```

#### Supprimer une réponse étudiant
```http
DELETE http://localhost:8086/api/student-answers/1
```

---

## 📝 Exemples de Scénarios Complets

### Scénario 1 : Créer un examen complet

**Étape 1 : Créer un examen**
```http
POST http://localhost:8086/api/exams
Content-Type: application/json

{
  "title": "Test de Français A1",
  "description": "Examen pour évaluer le niveau A1",
  "duration": 45,
  "passingScore": 60.0,
  "status": "DRAFT"
}
```

**Étape 2 : Ajouter des questions**
```http
POST http://localhost:8086/api/questions
Content-Type: application/json

{
  "content": "Comment dit-on 'Hello' en français ?",
  "questionType": "MULTIPLE_CHOICE",
  "points": 10.0,
  "examId": 1
}
```

**Étape 3 : Ajouter des réponses**
```http
POST http://localhost:8086/api/reponses
Content-Type: application/json

{
  "content": "Bonjour",
  "isCorrect": true,
  "questionId": 1
}
```

```http
POST http://localhost:8086/api/reponses
Content-Type: application/json

{
  "content": "Au revoir",
  "isCorrect": false,
  "questionId": 1
}
```

**Étape 4 : Publier l'examen**
```http
PUT http://localhost:8086/api/exams/1
Content-Type: application/json

{
  "title": "Test de Français A1",
  "description": "Examen pour évaluer le niveau A1",
  "duration": 45,
  "passingScore": 60.0,
  "status": "PUBLISHED"
}
```

### Scénario 2 : Un étudiant passe un examen

**Étape 1 : Créer le profil étudiant**
```http
POST http://localhost:8086/api/students
Content-Type: application/json

{
  "firstName": "Sara",
  "lastName": "Alaoui",
  "email": "sara.alaoui@example.com",
  "level": "Débutant"
}
```

**Étape 2 : Assigner l'examen à l'étudiant**
```http
POST http://localhost:8086/api/student-exams
Content-Type: application/json

{
  "studentProfileId": 1,
  "examId": 1,
  "score": 0.0,
  "validated": false
}
```

**Étape 3 : L'étudiant répond aux questions**
```http
POST http://localhost:8086/api/student-answers
Content-Type: application/json

{
  "answer": "Bonjour",
  "isCorrect": true,
  "studentExamId": 1,
  "questionId": 1
}
```

**Étape 4 : Soumettre l'examen**
```http
PUT http://localhost:8086/api/student-exams/1/submit
```

**Étape 5 : Mettre à jour le score**
```http
PUT http://localhost:8086/api/student-exams/1/score
Content-Type: application/json

{
  "score": 90.0
}
```

**Étape 6 : Valider l'examen**
```http
PUT http://localhost:8086/api/student-exams/1/validate
```

---

## ✅ Validations des Données

### StudentProfile
- ✓ `firstName` : Non vide, 2-50 caractères
- ✓ `lastName` : Non vide, 2-50 caractères
- ✓ `email` : Format email valide, unique
- ✓ `level` : Non vide

### Exam
- ✓ `title` : Non vide, 5-200 caractères
- ✓ `description` : Non vide
- ✓ `duration` : Positif (en minutes)
- ✓ `passingScore` : Entre 0 et 100
- ✓ `status` : DRAFT, PUBLISHED ou ARCHIVED

### Question
- ✓ `content` : Non vide, minimum 10 caractères
- ✓ `questionType` : MULTIPLE_CHOICE, TRUE_FALSE, SHORT_ANSWER ou ESSAY
- ✓ `points` : Positif
- ✓ `examId` : Référence valide

### Reponse
- ✓ `content` : Non vide
- ✓ `isCorrect` : Non null
- ✓ `questionId` : Référence valide

### StudentExam
- ✓ `score` : Positif ou zéro
- ✓ `studentProfileId` : Référence valide
- ✓ `examId` : Référence valide

### StudentAnswer
- ✓ `answer` : Non vide
- ✓ `studentExamId` : Référence valide
- ✓ `questionId` : Référence valide

---

## 🔍 Codes de Réponse HTTP

- `200 OK` : Requête réussie
- `201 Created` : Ressource créée avec succès
- `400 Bad Request` : Erreur de validation
- `404 Not Found` : Ressource non trouvée
- `500 Internal Server Error` : Erreur serveur

---

## 📦 Collection Postman

Pour importer cette collection dans Postman :

1. Ouvrez Postman
2. Cliquez sur "Import"
3. Sélectionnez "Link" et collez : `http://localhost:8086/v3/api-docs`
4. Ou créez une nouvelle collection et copiez les exemples ci-dessus

---

## 🛠️ Structure du Projet

```
src/main/java/com/LinguaNova/LinguaNova/
├── config/
│   └── OpenAPIConfig.java          # Configuration Swagger
├── controller/
│   ├── ExamController.java
│   ├── QuestionController.java
│   ├── ReponseController.java
│   ├── StudentAnswerController.java
│   ├── StudentExamController.java
│   └── StudentProfileController.java
├── entity/
│   ├── Exam.java
│   ├── Question.java
│   ├── Reponse.java
│   ├── StudentAnswer.java
│   ├── StudentExam.java
│   └── StudentProfile.java
├── exception/
│   └── GlobalExceptionHandler.java  # Gestion globale des erreurs
├── repository/
│   ├── ExamRepository.java
│   ├── QuestionRepository.java
│   ├── ReponseRepository.java
│   ├── StudentAnswerRepository.java
│   ├── StudentExamRepository.java
│   └── StudentProfileRepository.java
├── service/
│   ├── ExamService.java
│   ├── QuestionService.java
│   ├── ReponseService.java
│   ├── StudentAnswerService.java
│   ├── StudentExamService.java
│   └── StudentProfileService.java
└── LinguaNovaApplication.java
```

---

## 👥 Auteurs
- **LinguaNova Team**
- Contact : contact@linguanova.com

---

## 📄 Licence
MIT License

---

## 🐛 Résolution des Problèmes

### L'application ne démarre pas
- Vérifiez que MySQL est en cours d'exécution
- Vérifiez les informations de connexion dans `application.properties`
- Vérifiez que le port 8086 n'est pas déjà utilisé

### Swagger ne s'affiche pas
- Assurez-vous que l'application est démarrée
- Accédez à : http://localhost:8086/swagger-ui/index.html
- Vérifiez les logs de la console pour les erreurs

### Erreurs de validation
- Consultez la réponse JSON qui contient les détails des champs invalides
- Vérifiez que tous les champs requis sont présents
- Vérifiez les formats (email, longueur de chaînes, etc.)

---

## 📞 Support
Pour toute question ou problème, contactez : contact@linguanova.com

