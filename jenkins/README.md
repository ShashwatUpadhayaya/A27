# A27 Jenkins Pipeline

This folder contains the Jenkins setup used for phase three.

## Files

- `Dockerfile`: builds a Jenkins image with Docker CLI and Docker Compose.
- `a27-pipeline-config.xml`: backup XML config for the `A27-Pipeline` job.
- `a27-pipeline-scm-config.xml`: GitHub-backed XML config for the `A27-Pipeline` job.

## Jenkins container used

The running Jenkins container uses:

```bash
docker run -d --name jenkins --user root -p 8081:8080 -p 50000:50000 -v jenkins_data:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock -v C:\Users\saphire\Desktop\A27:/workspace/A27 a27-jenkins-docker
```

The important part is mounting:

- Docker socket: `/var/run/docker.sock`
- Project folder: `/workspace/A27`

Without these mounts Jenkins cannot run `docker compose` for this assignment.
