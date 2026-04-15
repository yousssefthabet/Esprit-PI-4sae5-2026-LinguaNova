/**
 * Proxy config — format objet compatible Vite (@angular/build:dev-server).
 * L'ordre des clés est important : les chemins les plus spécifiques d'abord.
 *
 * /PIproject/api/courses -> course-service (8081)
 * /PIproject            -> user-service   (8082)
 * /api/exams, /api/questions, /api/quiz, ... -> examen-service (8093)
 * /api                  -> backend générique (3000)
 */
const NOTE_SERVICE_TARGET = {
    target: 'http://localhost:8089',
    secure: false,
    changeOrigin: true,
};

const EXAM_SERVICE_TARGET = {
    target: 'http://localhost:8093',
    secure: false,
    changeOrigin: true,
};

const EXAM_DIRECT_TARGET = {
    target: 'http://localhost:8086',
    secure: false,
    changeOrigin: true,
};

const EVENT_SERVICE_TARGET = {
    target: 'http://localhost:8085',
    secure: false,
    changeOrigin: true,
    ws: true,
};
const PROXY_CONFIG = {
    '/PIproject/api/courses': {
        target: 'http://localhost:8081',
        secure: false,
        changeOrigin: true,
    },
    '/PIproject': {
        target: 'http://localhost:8082',
        secure: false,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/PIproject/, ''),
    },
    // ── Examen-service (port 8093) ──
    '/api/exams': EXAM_SERVICE_TARGET,
    '/api/questions': EXAM_SERVICE_TARGET,
    '/api/reponses': EXAM_SERVICE_TARGET,
    '/api/student-answers': EXAM_SERVICE_TARGET,
    '/api/student-exams': EXAM_SERVICE_TARGET,
    '/api/notes': NOTE_SERVICE_TARGET,
    '/api/quiz': EXAM_SERVICE_TARGET,
    '/api/cahiers': NOTE_SERVICE_TARGET,
    '/api/certificates': EXAM_DIRECT_TARGET,
    '/api/events': EVENT_SERVICE_TARGET,
    '/ws': EVENT_SERVICE_TARGET,


    // ── Backend générique (port 3000) ──
    '/api': {
        target: 'http://localhost:3000',
        secure: false,
        changeOrigin: true,
    },
};

module.exports = PROXY_CONFIG;