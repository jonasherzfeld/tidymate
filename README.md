<div align="center">
  <img src="./web/src/lib/img/tidymate_logo_white.png#gh-dark-mode-only" style="width: 30%;">
  <img src="./web/src/lib/img/tidymate_logo.png#gh-light-mode-only" style="width: 30%;">
  <p style="text-align:center;">
    <strong>A self-hosted lean organizer app for you and your flatmates!</strong>
  </p>
  <p style="text-align:center;">
    <a href="">Documentation TBD</a>
  </p>
</div>

## What is Tidymate

Tidymate is a lean web app that helps you organize your household. It can be used to track to-dos and reoccurring chores for you and your flatmates.

## Features

- [x] Create a household for you and your mates
- [x] Invite people to your household by creating a `Join ID`
- [x] Add To-Do list feature for household
- [x] Add Chores feature for household
- [ ] Add Chat feature for household

## Getting Started

The easiest way to get started is by using `docker-compose.yaml`. Below is an example configuration:

```yaml
services:
  tidymate:
    container_name: tidymate
    image: ghcr.io/jonasherzfeld/tidymate:latest
    restart: unless-stopped
    volumes:
      - ./data:/app/data
    ports:
      - 3000:3000
    environment:
      FLASK_SECRET_KEY: "your_secret_key"
      LOG_DEBUG: False
```

## Contribute

This repository is in active development and features are continuously added. If you find a bug or have a suggestion, please open an issue and let me know!
