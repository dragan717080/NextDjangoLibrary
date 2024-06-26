# Generated by Django 5.0.6 on 2024-06-15 23:38

import django.core.validators
import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Author',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=70, unique=True)),
            ],
            options={
                'db_table': 'authors',
                'indexes': [models.Index(fields=['name'], name='idx_author_name')],
            },
        ),
        migrations.CreateModel(
            name='Book',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('image_url', models.CharField(max_length=200)),
                ('rating', models.DecimalField(decimal_places=2, default=0.0, max_digits=3)),
                ('total_votes', models.IntegerField(default=0)),
                ('first_published', models.IntegerField()),
                ('total_copies', models.IntegerField(default=1)),
                ('available_copies', models.IntegerField(default=1)),
                ('author', models.ForeignKey(db_column='author', on_delete=django.db.models.deletion.CASCADE, to='library.author', to_field='name')),
            ],
            options={
                'db_table': 'books',
            },
        ),
        migrations.CreateModel(
            name='Genre',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=70, unique=True)),
                ('name_encoded', models.CharField(max_length=70, unique=True)),
                ('description', models.TextField()),
            ],
            options={
                'db_table': 'genres',
                'indexes': [models.Index(fields=['name'], name='idx_genre_name')],
            },
        ),
        migrations.CreateModel(
            name='BookGenre',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('book', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='library.book')),
                ('genre', models.ForeignKey(db_column='genre', on_delete=django.db.models.deletion.CASCADE, to='library.genre', to_field='name')),
            ],
            options={
                'db_table': 'books_genres',
            },
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('username', models.CharField(max_length=20, unique=True)),
                ('email', models.EmailField(max_length=30, unique=True)),
                ('password_hash', models.TextField()),
                ('avatar', models.BinaryField(null=True)),
                ('avatar_url', models.CharField(max_length=200, null=True)),
                ('loaned_books_count', models.IntegerField(validators=[django.core.validators.MaxValueValidator(3)])),
            ],
            options={
                'db_table': 'users',
                'indexes': [models.Index(fields=['username'], name='idx_user_username')],
            },
        ),
        migrations.CreateModel(
            name='Review',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('rating', models.IntegerField(validators=[django.core.validators.MaxValueValidator(5)])),
                ('content', models.TextField(null=True)),
                ('book', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='library.book')),
                ('user', models.ForeignKey(db_column='username', on_delete=django.db.models.deletion.CASCADE, to='library.user', to_field='username')),
            ],
            options={
                'db_table': 'reviews',
            },
        ),
        migrations.CreateModel(
            name='BookUserStatus',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('status', models.CharField(choices=[('VALUE1', 'To Read'), ('VALUE2', 'Reading'), ('VALUE3', 'Read')], default='To Read', max_length=200)),
                ('book', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='library.book')),
                ('user', models.ForeignKey(db_column='username', on_delete=django.db.models.deletion.CASCADE, to='library.user', to_field='username')),
            ],
            options={
                'db_table': 'statuses',
            },
        ),
        migrations.AddConstraint(
            model_name='book',
            constraint=models.UniqueConstraint(fields=('author', 'title'), name='unique_author_title'),
        ),
        migrations.AddConstraint(
            model_name='bookgenre',
            constraint=models.UniqueConstraint(fields=('book', 'genre'), name='unique_book_genre'),
        ),
        migrations.AddConstraint(
            model_name='review',
            constraint=models.UniqueConstraint(fields=('user', 'book'), name='unique_user_book_review'),
        ),
        migrations.AddConstraint(
            model_name='bookuserstatus',
            constraint=models.UniqueConstraint(fields=('user', 'book'), name='unique_user_book_status'),
        ),
    ]
