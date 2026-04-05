try {
  require("dotenv").config();
} catch (error) {
  console.warn("dotenv is not installed. Environment variables from .env were not loaded.");
}

const express = require("express");
const cors = require("cors");

const db = require("./app/models");

const PORT = Number(process.env.APP_PORT || process.env.PORT || 8080);

function registerSwagger(app) {
  let swaggerUi;
  let swaggerJSDoc;

  try {
    swaggerUi = require("swagger-ui-express");
    swaggerJSDoc = require("swagger-jsdoc");
  } catch (error) {
    console.warn("Swagger packages are not installed. /api-docs is disabled.");
    return;
  }

  const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Online Tutors API",
        version: "1.0.0",
        description: "API for managing tutors, students, subjects, lessons and reviews."
      },
      servers: [
        {
          url: `http://localhost:${PORT}`
        }
      ],
      components: {
        schemas: {
          User: {
            type: "object",
            properties: {
              id: { type: "integer" },
              name: { type: "string" },
              email: { type: "string", format: "email" },
              role: { type: "string", enum: ["student", "tutor", "admin"] },
              created_at: { type: "string", format: "date-time" }
            }
          },
          UserInput: {
            type: "object",
            required: ["name", "email", "password_hash", "role"],
            properties: {
              name: { type: "string" },
              email: { type: "string", format: "email" },
              password_hash: { type: "string" },
              role: { type: "string", enum: ["student", "tutor", "admin"] }
            }
          },
          Subject: {
            type: "object",
            properties: {
              id: { type: "integer" },
              name: { type: "string" }
            }
          },
          SubjectInput: {
            type: "object",
            required: ["name"],
            properties: {
              name: { type: "string" }
            }
          },
          Lesson: {
            type: "object",
            properties: {
              id: { type: "integer" },
              student_id: { type: "integer" },
              tutor_id: { type: "integer" },
              subject_id: { type: "integer", nullable: true },
              start_time: { type: "string", format: "date-time" },
              end_time: { type: "string", format: "date-time" },
              status: { type: "string", enum: ["scheduled", "completed", "cancelled"] }
            }
          },
          LessonInput: {
            type: "object",
            required: ["student_id", "tutor_id", "start_time", "end_time"],
            properties: {
              student_id: { type: "integer" },
              tutor_id: { type: "integer" },
              subject_id: { type: "integer" },
              start_time: { type: "string", format: "date-time" },
              end_time: { type: "string", format: "date-time" },
              status: { type: "string", enum: ["scheduled", "completed", "cancelled"] }
            }
          },
          Review: {
            type: "object",
            properties: {
              id: { type: "integer" },
              student_id: { type: "integer" },
              tutor_id: { type: "integer" },
              rating: { type: "integer", minimum: 1, maximum: 5 },
              comment: { type: "string", nullable: true },
              created_at: { type: "string", format: "date-time" }
            }
          },
          ReviewInput: {
            type: "object",
            required: ["student_id", "tutor_id", "rating"],
            properties: {
              student_id: { type: "integer" },
              tutor_id: { type: "integer" },
              rating: { type: "integer", minimum: 1, maximum: 5 },
              comment: { type: "string" }
            }
          },
          TutorSubject: {
            type: "object",
            properties: {
              id: { type: "integer" },
              tutor_id: { type: "integer" },
              subject_id: { type: "integer" },
              price_per_hour: { type: "number" }
            }
          },
          TutorSubjectInput: {
            type: "object",
            required: ["tutor_id", "subject_id", "price_per_hour"],
            properties: {
              tutor_id: { type: "integer" },
              subject_id: { type: "integer" },
              price_per_hour: { type: "number" }
            }
          },
          MessageResponse: {
            type: "object",
            properties: {
              message: { type: "string" }
            }
          }
        }
      }
    },
    apis: ["./app/routes/*.js"]
  };

  const swaggerSpec = swaggerJSDoc(swaggerOptions);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  registerSwagger(app);

  require("./app/routes/users.routes")(app);
  require("./app/routes/subject.routes")(app);
  require("./app/routes/lesson.routes")(app);
  require("./app/routes/review.routes")(app);
  require("./app/routes/tutor_subject.routes")(app);

  app.get("/", (req, res) => {
    res.json({ message: "Welcome to Online Tutors API." });
  });

  app.get("/health", async (req, res) => {
    try {
      await db.sequelize.authenticate();
      res.json({ status: "ok" });
    } catch (error) {
      res.status(503).json({ status: "error", message: error.message });
    }
  });

  app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
  });

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  });

  return app;
}

async function startServer() {
  try {
    await db.sequelize.authenticate();
    console.log("PostgreSQL connection established successfully.");

    await db.sequelize.sync();
    console.log("Database synced.");

    const app = createApp();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
      console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { createApp, startServer };
