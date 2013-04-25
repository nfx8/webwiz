#/bin/bash
gunicorn -c gunicorn.py.ini app:app
#gunicorn -b 0.0.0.0:8080 app:app >& /dev/null < /dev/null &