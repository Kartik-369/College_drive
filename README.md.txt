# 🎓 LabZip

## 📖 The Origin Story

It all started in the computer lab when a classmate got her pen drive completely stuck in one of the lab PCs. We were all still relying on fragile USB drives to transfer lab assignments, project files, and notes between personal laptops and college computers. Between broken USB ports, lost drives, and lab PC viruses, it was an absolute mess.

I realized I could take all the full-stack, cloud, and DevOps skills I had been building and apply them to solve this exact, everyday problem.

So, I built **CollegeDrive**—a dedicated cloud storage platform engineered strictly for **Darshan University** students. Instead of passing around flash drives, students can create accounts (restricted by university email), organize their subjects into folders, and securely upload their work (specifically optimized for `.zip` lab submissions). It's like Google Drive, but hyper-local to our campus and built from scratch using a modern containerized microservice architecture.

---

## 🚀 What It Does

- **Exclusive Access:** Account creation is strictly gated for Darshan University students to keep the platform secure and campus-focused.
- **Subject-Based Organization:** Dedicated folders for semester subjects (DBMS, Java, Web Tech) to keep assignments and notes structured.
- **Lightning Fast ZIP Uploads:** Optimized for `.zip` lab submissions. It uses presigned URLs to upload files directly from the browser to cloud storage, bypassing the backend entirely so the server never bottlenecks.
- **Batch Downloading:** Users can download entire folders of study materials or specific submissions with a single click.

---

## 🛠️ The Tech Stack

CollegeDrive was built to mirror modern industry standards, moving away from monolithic designs into a scalable microservice architecture.

- **Frontend:** React, Vite, TailwindCSS
- **Backend:** FastAPI, Python 3.11, Uvicorn, Pydantic
- **Database:** MongoDB Atlas (NoSQL for flexible metadata storage)
- **Object Storage:** Backblaze B2 (S3-Compatible API via `boto3`)
- **DevOps & Hosting:** Docker, Kubernetes (`kubectl`), Nginx, Render

---

## 📐 System Architecture

To keep the application highly scalable and cost-effective, the backend is completely **stateless**.

When a student uploads a file (like `lab1_Submission.zip`), the React frontend asks the FastAPI backend for permission. The backend generates a secure, temporary **S3 Presigned URL**. The frontend then streams the heavy file directly to Backblaze B2 storage. The backend only talks to MongoDB to store the file's metadata (name, size, uploader).

```
[ React Frontend ]
       │              ▲
       │ (1) Request  │ (2) Generate S3 Presigned URL
       ▼              │
[ FastAPI Backend ] ──┘
       │
       │ (3) Direct PUT Upload (Bypasses Backend)
       ▼
[ Backblaze B2 Cloud Storage ]
```

---

## 🐳 Containerization & Kubernetes

The entire application is containerized using multi-stage Docker builds.

- The **Frontend** compiles the React code and serves it statically via a lightweight Nginx Alpine image.
- The **Backend** runs FastAPI on Uvicorn.

### Kubernetes (`k8s-deploy.yaml`)

The project includes fully declared Kubernetes manifests designed for a production cluster:

- **Deployments:** Manages backend and frontend replicas with self-healing capabilities (automatic restarts on crash).
- **Services:** Uses LoadBalancers to route external internet traffic into the pods.
- **Stateless Pods:** Because file storage is handled by Backblaze and data by MongoDB, pods can be destroyed and recreated by Kubernetes without any data loss.

---

## 💻 Local Development Setup

Want to run CollegeDrive locally?

### 1. Environment Variables

Create a `.env` file in the `/backend` directory:

```env
MONGODB_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
B2_KEY_ID=<your_backblaze_key_id>
B2_APPLICATION_KEY=<your_backblaze_app_key>
B2_BUCKET_NAME=CollegeDrive
B2_ENDPOINT_URL=https://s3.<region>.backblazeb2.com
SECRET_KEY=<your_secure_jwt_secret_key>
```

### 2. Run the Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 3. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Live Deployment Workflow

To push updates to the live production environment on Render:

1. **Build the updated Docker images:**

```bash
docker build -t <your-username>/collegedrive-backend:latest .
docker build --build-arg VITE_API_URL=https://<your-backend-url> -t <your-username>/collegedrive-frontend:latest .
```

2. **Push to Docker Hub:**

```bash
docker push <your-username>/collegedrive-backend:latest
docker push <your-username>/collegedrive-frontend:latest
```

3. Render automatically pulls the latest images and triggers a zero-downtime redeploy.

---

## 📝 License

This project is open source and available under the Apache License 2.0 .

---

## 👨‍💻 Contributing

Contributions are welcome! Feel free to fork this repository and submit a pull request with your improvements.