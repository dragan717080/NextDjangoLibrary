<div align=center>

<picture>
    <source srcset="django-logo.png">
    <img alt="Django" width="310" height="340">
</picture>

# <a name="no-link"></a>Django Library API

### Django API for the Library app. Database agnostic but I've used PostgreSQL.

</div>
&nbsp;&nbsp;&nbsp;&nbsp;

## <a name="no-link"></a>Technologies Used

- **Django**

Django is a high-level Python web framework that encourages rapid development and clean, pragmatic design. It follows the Model-View-Template (MVT) architectural pattern and emphasizes reusability of components, less code, and rapid development.

- **PostgreSQL**

PostgreSQL is a RDBMS known for its reliability, robust feature set, and extensibility. It is highly regarded for its ability to handle complex queries, manage high concurrency, and provide advanced data types and indexing capabilities. 

## How to install
Windows

```
python -m venv venv
venv/Scripts/activate
```

Linux

```
virtualenv venv --distribute
source venv/bin/activate
python
```

Set the environment variables

```
DJANGO_SECRET_KEY=YOUR_DJANGO_SECRET_KEY
DB_ENGINE=django.db.backends.postgresql
DB_NAME=YOUR_DB_NAME
DB_USER=YOUR_DB_USER
DB_PASSWORD=YOUR_DB_PASSWORD
DB_HOST=YOUR_DB_HOST
DB_PORT=YOUR_DB_PORT
POSTGRES_CONNECTION=YOUR_DB_URI_STRING
IMGUR_ID=YOUR_IMGUR_ID
IMGUR_SECRET=YOUR_IMGUR_SECRET
```

Install dependencies and run

```
pip install -r requirements.txt
python manage.py runserver
```

## Entities

All IDs are UUIDv4.

<picture>
    <source srcset="db-schema.png">
    <img alt='Schema Image' width='670' height='310' />
</picture>

### 1. **Genre**
- id (PK)
- name
- name_encoded
- description

### 2. **Author**
- id (PK)
- name

### 3. **Book**
- id (PK)
- title
- description
- image_url
- rating
- total_votes
- first_published
- total_copies
- available_copies

### 4. **BookGenre**
- id (PK)
- book_id (FK to Book)
- genre (FK to Genre)

### 5. **User**
- id (PK)
- username
- email
- password_hash
- avatar
- loaned_books_count

### 6. **BookUserStatus**
- id (PK)
- book_id (FK to Book)
- username (FK to User)
- status

### 7. **Review**
- id (PK)
- book_id (FK to Book)
- username (FK to User)
- rating
- content

## Example endpoint

**Create**

```POST /genres```

```
{
    "name": "Haiku Poetry"
}
```

Returns

```
201 CREATED

{
    "id": "4e843edb-5ca5-4497-baa2-dd1bd2ce6da0",
    "name": "Haiku Poetry",
    "book_count": 0
}
```
**Read**

```GET /genres```

Returns

```
200 OK

[
    {
        "id": "f2839663-6909-4112-824d-c739cdf967f6",
        "name": "Combined Print Fiction",
        "book_count": 21
    },
    {
        "id": "4e843edb-5ca5-4497-baa2-dd1bd2ce6da0",
        "name": "Haiku Poetry",
        "book_count": 0
    },
]
```

```GET /genres/{id}``` &nbsp;
**id: unique identifier in UUIDv4 format**

Returns

```
200 OK

{
    "id": "4e843edb-5ca5-4497-baa2-dd1bd2ce6da0",
    "name": "History",
    "book_count": 3
}
```

**Update**

```PATCH /genres/{id}```

```
{
    "id": "4e843edb-5ca5-4497-baa2-dd1bd2ce6da0",
    "name": "Sonnet",
    "book_count": 0
}
```

Returns
```
200 OK

{
    "id": "4e843edb-5ca5-4497-baa2-dd1bd2ce6da0",
    "name": "Sonnet",
    "book_count": 0
}
```

**Delete**

```DELETE /genres/{id}```

Returns

```
200 OK

{
    "message": "Deleted genre with id 4e843edb-5ca5-4497-baa2-dd1bd2ce6da0"
}
```
