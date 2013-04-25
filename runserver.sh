#/bin/bash
gunicorn -c gunicorn.py.ini app:app