RESEARCH ASSISTANT BACKEND - FRIEND SQL SCHEMA ADAPTATION

IMPORTANT
- This backend is mapped to the supplied new schema.sql (database: research_assistant_db).
- The SQL file contains only sample rows: 2 sample users, 1 category, 1 topic and 1 paper. It is not a full dataset.
- The sample password_hash values (hash_admin_123 / hash_student_123) are placeholders, not usable BCrypt passwords. Register a new account through the app.
- Existing API response fields are mostly preserved. journal and doi are not columns in the supplied schema, so they are transient and will not be saved. Paper year maps to publication_year (integer).
- Draft topic/content are stored as rows in draft_sections: TOPIC and CONTENT. Each draft belongs to the authenticated user.

SETUP
1. Open MySQL Workbench on your laptop.
2. Open database-schema/new schema.sql and execute the complete script. It creates research_assistant_db and the tables/sample rows.
3. In src/main/resources/application.properties, set DB username/password via environment variables DB_USERNAME and DB_PASSWORD, or edit local values.
4. Run backend. Default DB URL points to localhost:3306/research_assistant_db.
5. Hibernate ddl-auto is validate: it checks the imported schema and will not silently create/alter tables.
6. Register a new account in the frontend, then log in.

To promote your own registered user to admin, run in Workbench (replace the email):
USE research_assistant_db;
UPDATE users SET role='ADMIN' WHERE email='your-email@example.com';
Log out and log in again to obtain a JWT with the ADMIN role.

BUILD CHECK
This environment could not run Maven because Maven was not installed and the Maven wrapper could not download Maven (network unavailable). Please run `mvnw.cmd -DskipTests package` on Windows from the backend project folder. If a compilation error appears, send the full error output.
