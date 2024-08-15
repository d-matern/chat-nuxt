# Процесс ручного развертывания приложения на ssh-сервере

## Подготовка окружения
Необходимые утилиты:
```
node (выше v19)
pnpm
pm2
```

1. Установите ноду, согласно доке https://nodejs.org/en/download/package-manager
2. Установка pnpm
```bash
npm i -g pnpm
```
3. Установите pm2:
```bash
npm i -g pm2
```

## Клонирование репозитория
1. Создайте ssh-ключ (не задавайте пароль, укажите уникальное название)
```bash
cd ~/.ssh/
ssh-keygen -t rsa
```

2. Добавьте ваш ключ в гитхаб-репозиторий

3. Пропишите конфиг в `~/.ssh/config`
```bash
Host github-paket-frontend
        Hostname github.com
        IdentityFile /home/chat-nuxt/.ssh/{your_private_key}
        User git
```

4. Склонируйте репо
```
git clone git@github.com:3dmatern/chat-nuxt.git

ls -la
```

## Сборка и развертывание
1. Установите все зависимости
```
pnpm install
```

2. Соберите проект, используя env и одно из окружений `dev, prod`
```
pnpm run build --dotenv .env.dev
```

3. Запустите через pm2
```
pm2 start ecosystem.config.cjs --env dev
```

## Настройка nginx-конфигурации
1. Создайте файл конфигурации в `/chat-nuxt/nginx/`
```
cd /chat-nuxt/nginx/
touch dmatern.nginx.conf
```

2. Содержимое файла
```nginx
server {
    listen 443 ssl;
    server_name {domen, for example: example.com};

    location / {
        proxy_pass http://localhost:3000; # Наше Nuxt приложение
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

        # Добавление параметров таймаута
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
        proxy_connect_timeout 3600s;
    }

    location /api/chat-ws {
        proxy_pass http://localhost:3000; # Наше WebSocket сервер
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

        # Добавление параметров таймаута
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
        proxy_connect_timeout 3600s;
    }
}
```

3. Создайте симлинк
```bash
sudo ln -s /chat-nuxt/nginx/dmatern.nginx.conf /etc/nginx/sites-enabled/

проверить, что все ок создалось
cd /etc/nginx/sites-enabled/
ls -la
```

4. Запустите certbot'а
```bash
sudo certbot --nginx
```

5. Перезапустите nginx
```bash
sudo systemctl reload nginx
```

Все развернулось, поздравляю! 🥳 
