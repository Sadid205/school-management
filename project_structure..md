# ============================================

# PROJECT STRUCTURE

# ============================================

school_management/
├── backend/
│ ├── apps/
│ │ ├── accounts/ # User, StudentProfile, TeacherProfile, ParentStudentLink
│ │ ├── academics/ # Subject, SubjectAssignment, Exam
│ │ ├── marks/ # StudentMark, StudentResult (GPA Engine)
│ │ └── attendance/ # Attendance
│ │
│ └── config/ # Django project configuration
│ ├── settings.py
│ ├── urls.py
│ ├── wsgi.py
│ └── asgi.py
│
└── README.md

docker compose -f docker-compose.dev.yml run --rm school_management_backend bash
