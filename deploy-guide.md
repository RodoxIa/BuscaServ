# Guia de Deploy do BuscaServ na Hostinger

## Pré-requisitos

1. **VPS da Hostinger** com Node.js
   - Recomendado: Ubuntu 22.04 com Node.js e OpenLiteSpeed
   - Plano mínimo: KVM 1 ($4.99/mês)

2. **Domínio configurado** apontando para o VPS

3. **Acesso SSH** ao servidor

## Passos para Deploy

### 1. Preparação do Servidor

```bash
# Conectar via SSH
ssh root@seu-servidor-ip

# Atualizar sistema
apt update && apt upgrade -y

# Instalar dependências necessárias
apt install -y git nginx certbot python3-certbot-nginx

# Verificar Node.js (deve ser >= 18)
node --version
npm --version
```

### 2. Configuração do Banco de Dados

```bash
# Para PostgreSQL (recomendado para produção)
apt install -y postgresql postgresql-contrib

# Criar usuário e banco
sudo -u postgres createuser --interactive
sudo -u postgres createdb buscaserv

# Para SQLite (mais simples, já configurado)
# Nenhuma ação necessária, o arquivo será criado automaticamente
```

### 3. Deploy da Aplicação

```bash
# Clonar o repositório
cd /var/www
git clone https://github.com/RodoxIa/BuscaServ.git
cd BuscaServ

# Instalar dependências
npm install --production

# Configurar variáveis de ambiente
cp .env.example .env
nano .env
```

### 4. Configuração do .env para Produção

```env
# Database
DATABASE_URL="file:./dev.db"
# Para PostgreSQL: DATABASE_URL="postgresql://usuario:senha@localhost:5432/buscaserv"

# NextAuth
NEXTAUTH_URL="https://seudominio.com"
NEXTAUTH_SECRET="sua-chave-secreta-muito-forte-aqui"

# Outras configurações
NODE_ENV="production"
PORT=3000
```

### 5. Preparar a Aplicação

```bash
# Gerar cliente Prisma
npx prisma generate

# Executar migrações
npx prisma migrate deploy

# Executar seed (opcional)
npx prisma db seed

# Build da aplicação
npm run build
```

### 6. Configurar PM2 (Process Manager)

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Criar arquivo de configuração
nano ecosystem.config.js
```

Conteúdo do `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'buscaserv',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/BuscaServ',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
  }]
};
```

```bash
# Iniciar aplicação com PM2
pm2 start ecosystem.config.js

# Configurar PM2 para iniciar automaticamente
pm2 startup
pm2 save
```

### 7. Configurar Nginx

```bash
# Criar configuração do site
nano /etc/nginx/sites-available/buscaserv
```

Conteúdo da configuração:

```nginx
server {
    listen 80;
    server_name seudominio.com www.seudominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Ativar site
ln -s /etc/nginx/sites-available/buscaserv /etc/nginx/sites-enabled/

# Testar configuração
nginx -t

# Reiniciar Nginx
systemctl restart nginx
```

### 8. Configurar SSL com Let's Encrypt

```bash
# Obter certificado SSL
certbot --nginx -d seudominio.com -d www.seudominio.com

# Configurar renovação automática
crontab -e
# Adicionar linha: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 9. Configurar Firewall

```bash
# Configurar UFW
ufw allow ssh
ufw allow 'Nginx Full'
ufw enable
```

## Verificação

1. Acesse `https://seudominio.com`
2. Teste o login e cadastro
3. Verifique se o dashboard está funcionando
4. Teste a funcionalidade de clientes

## Manutenção

### Atualizações

```bash
cd /var/www/BuscaServ
git pull origin main
npm install --production
npm run build
pm2 restart buscaserv
```

### Backup do Banco de Dados

```bash
# Para SQLite
cp /var/www/BuscaServ/prisma/dev.db /backup/buscaserv-$(date +%Y%m%d).db

# Para PostgreSQL
pg_dump buscaserv > /backup/buscaserv-$(date +%Y%m%d).sql
```

### Monitoramento

```bash
# Ver logs da aplicação
pm2 logs buscaserv

# Status dos processos
pm2 status

# Monitoramento em tempo real
pm2 monit
```

## Solução de Problemas

### Aplicação não inicia
```bash
# Verificar logs
pm2 logs buscaserv

# Verificar se a porta está em uso
netstat -tulpn | grep :3000

# Reiniciar aplicação
pm2 restart buscaserv
```

### Erro de banco de dados
```bash
# Verificar conexão
npx prisma db pull

# Recriar banco (CUIDADO: apaga dados)
npx prisma migrate reset
```

### Problemas de SSL
```bash
# Verificar certificado
certbot certificates

# Renovar manualmente
certbot renew
```

## Custos Estimados

- **VPS Hostinger KVM 1**: $4.99/mês
- **Domínio**: $10-15/ano
- **Total mensal**: ~$6-7

## Suporte

Para problemas específicos:
1. Verificar logs: `pm2 logs buscaserv`
2. Verificar status: `systemctl status nginx`
3. Consultar documentação do Hostinger
4. Contatar suporte técnico se necessário

