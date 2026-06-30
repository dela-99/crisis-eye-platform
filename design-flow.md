When a citizen submits an emergency report, the frontend sends the report to our backend API. The backend stores it in the database and immediately routes it to the responder dashboard based on the incident category. Police receive crime reports, the Fire Service receives fire incidents, Ambulance services receive medical emergencies, and NADMO receives disaster-related reports. In this prototype, the responder dashboard simulates that workflow.


Citizen

↓

CrisisEye Website

↓

Backend API

↓

Database

↓

Incident Routing

↓

Responder Dashboard

↓
Police
Fire Service
Ambulance
NADMO

↓