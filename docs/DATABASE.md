# Database Documentation

This document describes the database schema, tables, and relationships for Gamerboxd.

## Overview

Gamerboxd uses **PostgreSQL** as the database and **Prisma 7** as the ORM. The database runs locally via Docker Compose.

## Entity Relationship Diagram

```mermaid
erDiagram
    User ||--o{ BacklogGame : "has many"
    User ||--o{ FavoriteGame : "has many"
    
    User {
        string id PK "cuid()"
        string email UK "unique"
        string username UK "unique"
        string passwordHash "bcrypt hash"
        string avatarUrl "nullable"
        string bio "nullable"
        datetime createdAt "auto"
    }
    
    BacklogGame {
        string id PK "cuid()"
        string userId FK "-> User.id"
        int gameId "RAWG game ID"
        string gameSlug "RAWG slug"
        string gameName "display name"
        string gameImage "nullable, cover URL"
        enum status "BacklogStatus"
        datetime createdAt "auto"
        datetime updatedAt "auto"
    }
    
    FavoriteGame {
        string id PK "cuid()"
        string userId FK "-> User.id"
        int gameId "RAWG game ID"
        string gameSlug "RAWG slug"
        string gameName "display name"
        string gameImage "nullable, cover URL"
        int rank "1-10"
        datetime createdAt "auto"
    }
```

## Tables

### User (`users`)

Stores user account information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `String` | PK, cuid() | Unique identifier |
| `email` | `String` | Unique, Not Null | User's email address |
| `username` | `String` | Unique, Not Null | Display username |
| `passwordHash` | `String` | Not Null | bcrypt hashed password |
| `avatarUrl` | `String` | Nullable | URL to avatar image |
| `bio` | `String` | Nullable | User biography |
| `createdAt` | `DateTime` | Default: now() | Account creation timestamp |

**Indexes:**
- Primary Key on `id`
- Unique index on `email`
- Unique index on `username`

**Relations:**
- One-to-Many with `BacklogGame`
- One-to-Many with `FavoriteGame`

---

### BacklogGame (`backlog_games`)

Stores games in a user's backlog with their play status.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `String` | PK, cuid() | Unique identifier |
| `userId` | `String` | FK -> User.id, Not Null | Owner of this entry |
| `gameId` | `Int` | Not Null | RAWG API game ID |
| `gameSlug` | `String` | Not Null | RAWG slug for URL routing |
| `gameName` | `String` | Not Null | Game display name |
| `gameImage` | `String` | Nullable | Cover image URL from RAWG |
| `status` | `BacklogStatus` | Default: WANT_TO_PLAY | Current play status |
| `createdAt` | `DateTime` | Default: now() | Entry creation timestamp |
| `updatedAt` | `DateTime` | Auto-updated | Last modification timestamp |

**Indexes:**
- Primary Key on `id`
- Unique composite index on `(userId, gameId)` - prevents duplicate entries

**Relations:**
- Many-to-One with `User` (cascade delete)

**Enum: BacklogStatus**
```
WANT_TO_PLAY  - User wants to play this game
PLAYING       - User is currently playing
COMPLETED     - User finished the game
DROPPED       - User stopped playing
ON_HOLD       - User paused playing
```

---

### FavoriteGame (`favorite_games`)

Stores a user's top 10 favorite games with rankings.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `String` | PK, cuid() | Unique identifier |
| `userId` | `String` | FK -> User.id, Not Null | Owner of this entry |
| `gameId` | `Int` | Not Null | RAWG API game ID |
| `gameSlug` | `String` | Not Null | RAWG slug for URL routing |
| `gameName` | `String` | Not Null | Game display name |
| `gameImage` | `String` | Nullable | Cover image URL from RAWG |
| `rank` | `Int` | Not Null | Position in tierlist (1-10) |
| `createdAt` | `DateTime` | Default: now() | Entry creation timestamp |

**Indexes:**
- Primary Key on `id`
- Unique composite index on `(userId, gameId)` - prevents duplicate favorites
- Unique composite index on `(userId, rank)` - ensures unique ranking per user

**Relations:**
- Many-to-One with `User` (cascade delete)

**Business Rules:**
- Each user can have a maximum of 10 favorites
- Each rank (1-10) can only be assigned to one game per user
- When assigning a rank that's already taken, the system swaps the games

---

## Relationships Summary

| Relationship | Type | Description |
|--------------|------|-------------|
| User → BacklogGame | One-to-Many | A user can have many games in their backlog |
| User → FavoriteGame | One-to-Many | A user can have up to 10 favorite games |
| BacklogGame → User | Many-to-One | Each backlog entry belongs to one user |
| FavoriteGame → User | Many-to-One | Each favorite entry belongs to one user |

## Cascade Behavior

When a `User` is deleted:
- All associated `BacklogGame` entries are automatically deleted
- All associated `FavoriteGame` entries are automatically deleted

## Game Data Storage

Game data (name, image, slug) is denormalized and stored directly in `BacklogGame` and `FavoriteGame` tables. This is intentional because:

1. **Performance**: No need to fetch game details from RAWG API for list displays
2. **Reliability**: User data persists even if RAWG API is unavailable
3. **Speed**: Profile and backlog pages load faster
4. **Historical**: Preserves game info as it was when added

The `gameId` is kept to link back to the RAWG API for fetching full details when needed.

## Database Setup

### Prerequisites
- Docker and Docker Compose installed

### Start Database
```bash
docker-compose up -d
```

### Environment Variables
```env
DATABASE_URL="postgresql://gamerboxd:gamerboxd@localhost:5432/gamerboxd"
```

### Prisma Commands
```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (development)
npx prisma db push

# Create migration (production)
npx prisma migrate dev --name <migration_name>

# Open Prisma Studio
npx prisma studio
```

## Future Schema Considerations

### Planned Tables (Phase 3+)

**GameRating**
```prisma
model GameRating {
  id        String   @id @default(cuid())
  userId    String
  gameId    Int
  rating    Int      // 1-5 stars
  createdAt DateTime @default(now())
  
  user User @relation(...)
  @@unique([userId, gameId])
}
```

**GameReview**
```prisma
model GameReview {
  id        String   @id @default(cuid())
  userId    String
  gameId    Int
  content   String
  createdAt DateTime @default(now())
  
  user   User       @relation(...)
  rating GameRating @relation(...)
}
```

**Follow (Social)**
```prisma
model Follow {
  id          String   @id @default(cuid())
  followerId  String
  followingId String
  createdAt   DateTime @default(now())
  
  follower  User @relation("followers", ...)
  following User @relation("following", ...)
  @@unique([followerId, followingId])
}
```

**CustomList**
```prisma
model CustomList {
  id          String   @id @default(cuid())
  userId      String
  name        String
  description String?
  isPublic    Boolean  @default(true)
  createdAt   DateTime @default(now())
  
  user  User       @relation(...)
  items ListItem[]
}
```
