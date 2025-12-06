"""WSGI entrypoint for PythonAnywhere.

PythonAnywhere will point to ``backend.wsgi:application``.
"""

from backend import create_app

application = create_app()
