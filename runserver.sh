#/bin/bash
nohup gunicorn -c gunicorn.py.ini app:app >& /dev/null < /dev/null &
