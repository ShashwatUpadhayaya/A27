pipeline {
  agent any

  options {
    timestamps()
  }

  environment {
    COMPOSE_PROJECT_NAME = 'a27'
  }

  stages {
    stage('Check Workspace') {
      steps {
        sh '''
          set -e
          cd "$WORKSPACE"
          git log --oneline -1
          test -f docker-compose.yml
          test -f client/Dockerfile
          test -f server/Dockerfile
          test -f client/nginx.conf
          echo "A27 project files found."
        '''
      }
    }

    stage('Validate Compose') {
      steps {
        sh '''
          set -e
          cd "$WORKSPACE"
          docker compose config
        '''
      }
    }

    stage('Build Images') {
      steps {
        sh '''
          set -e
          cd "$WORKSPACE"
          docker compose build
        '''
      }
    }

    stage('Deploy Containers') {
      steps {
        sh '''
          set -e
          cd "$WORKSPACE"
          docker compose down --remove-orphans
          docker compose up -d
        '''
      }
    }

    stage('Seed MongoDB') {
      steps {
        sh '''
          set -e
          cd "$WORKSPACE"
          docker compose exec -T server npm run seed
        '''
      }
    }

    stage('Smoke Test') {
      steps {
        sh '''
          set -e

          echo "Checking React frontend through Docker..."
          frontend_ok=0
          for i in $(seq 1 30); do
            if curl -fsS http://host.docker.internal:5173 >/tmp/a27-client.html; then
              grep -q "MongoDB CRUD Relationships" /tmp/a27-client.html
              frontend_ok=1
              break
            fi
            sleep 2
          done
          test "$frontend_ok" -eq 1

          echo "Checking Express API through Docker..."
          api_ok=0
          for i in $(seq 1 30); do
            if curl -fsS http://host.docker.internal:5173/api/students >/tmp/a27-students.json; then
              grep -q "Anaya Sharma" /tmp/a27-students.json
              api_ok=1
              break
            fi
            sleep 2
          done
          test "$api_ok" -eq 1

          echo "Smoke tests passed."
        '''
      }
    }
  }

  post {
    always {
      sh '''
        cd "$WORKSPACE"
        docker compose ps || true
      '''
    }
  }
}
