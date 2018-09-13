# Generated by Django 2.1.1 on 2018-09-13 05:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0006_auto_20180913_0531'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='employer',
            name='application_inbox',
        ),
        migrations.AddField(
            model_name='employer',
            name='applications_inbox',
            field=models.EmailField(blank=True, default='', max_length=254),
        ),
        migrations.AlterField(
            model_name='employee',
            name='email',
            field=models.EmailField(max_length=254, unique=True),
        ),
    ]
