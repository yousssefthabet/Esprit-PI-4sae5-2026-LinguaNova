# Course microservice (LinguaNova backend)

This service stores courses in the database. The Angular app sends **POST /PIproject/api/courses** when you click "Finalize & Deploy" on course creation.

## Run the backend

0. **Java 17+** (required)
   - If you see "JAVA_HOME is not defined correctly", install [Eclipse Temurin JDK 17](https://adoptium.net/) (or any JDK 17+).
   - Set **JAVA_HOME** to your JDK folder (e.g. `C:\Program Files\Eclipse Adoptium\jdk-17.0.x-hotspot`).
   - Or run: `.\run-backend.ps1` — it tries to find Java automatically.

1. **Start MySQL** (port 3306)
   - Database: `PI` (created automatically if missing via `createDatabaseIfNotExist=true`)
   - User: `root`, password: (empty) — change in `src/main/resources/application.properties` if needed

2. **Start this Spring Boot app** (port 8081)
   ```powershell
   cd .angular\microservices\courss-service
   .\run-backend.ps1
   ```
   Or set JAVA_HOME and run: `.\mvnw.cmd spring-boot:run`. Or run `CourssServiceApplication` from your IDE.

3. **Start the Angular app** (with proxy)
   ```bash
   ng serve
   ```
   The proxy forwards `/PIproject` to `http://localhost:8081`, so the frontend talks to this backend without CORS.

## Check that it works (course saved to MySQL)

- Open **http://localhost:4200/courses/course-creation**
- If the backend is down, you'll see an orange banner: "Course backend not reachable..."
- If the banner does **not** appear, the backend is reachable.
- Fill **all steps**: Course Title (min 10 chars), Short Hook, Full Prospectus (min 50 chars), at least one **module** with a **lesson** in Structure, optionally add a quiz in Qualifiers, set **Price** in Deploy.
- Click **Finalize & Deploy**. The course is sent to **POST /PIproject/api/courses** and saved to MySQL (tables: `courses`, `modules`, `lessons`, `quizzes`, `questions`).
- You should see "Course created successfully!" and be redirected to the instructor dashboard. In MySQL you can run: `USE PI; SELECT id, title, short_description FROM courses;`
