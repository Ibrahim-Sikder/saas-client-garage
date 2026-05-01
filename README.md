# React + Vite

# SaaS Multi-Tenant Domain Setup Guide

This project supports hosting multiple client domains on the same VPS using Nginx and automated SSL with Certbot.

---

## Adding a New Client Domain

Follow these steps to add and secure a new client domain (e.g., `garage.worldautosolution.com`):

### 1. DNS Setup

- Make sure the client domain points to your VPS IP via an A record.
- If you want to use a `www` subdomain (e.g., `www.garage.worldautosolution.com`), add an A record for that too.

### 2. Run the Setup Script

Make the setup script executable (if not done yet) and run it with the domain as the argument:

```bash
cd /root
sudo chmod +x /root/setup-client-domain.sh
sudo /root/setup-client-domain.sh garage.worldautosolution.com

## for subdomain ssl 
sudo certbot --nginx -d app.jannatautomobiles143.com

