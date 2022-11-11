from os import environ

from .base import *

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-sy836x6n-351^((8a^=*ec&#*&$&x-mo*+h11_zn^mwt8jr1h@'


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG: bool = True


ALLOWED_HOSTS = ['*']

# ########### DATABASES CONFIGURATION ###########
# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'paindairy_db',
        'USER': 'quickcheck',
        'PASSWORD': 'password',
        'HOST': 'localhost',
        'PORT': 5432,
    },
}

# Email config
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'


# CELERY
CELERY_BROKER_URL: str = environ.get('REDIS_URL', 'amqp://localhost')
