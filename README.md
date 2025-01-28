## Notes for running:

### Create a Virtual Environment

~~~sh
python -m venv some-env
source ./some-venv/bin/activate
~~~

### Install Required Dependencies

~~~sh
pip install -r requirements.txt

or 
uv pip install -r requirements.txt
~~~

### Setup the database
~~~sh
python manage.py makemigrations
python manage.py migrate
~~~

### Create a Superuser

~~~sh
python manage.py createsuperuser
~~~

### Run Dev

~~~sh
python manage.py runserver
~~~


### Static Files (Optional for Dev)
~~~sh
python manage.py collectstatic

~~~


### To run wit Gunicorn

~~~sh
pip install gunicorn
gunicorn <project_name>.wsgi:application # In our case 
gunicorn llf-py.wsgi:application
~~~

Setup this before running gunicorn.
~~~sh
export DJANGO_SETTINGS_MODULE=<project_name>.settings
~~~

