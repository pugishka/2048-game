#!/usr/bin/python3

from wsgiref.handlers import CGIHandler

activator = 'env/bin/activate_this.py'
with open(activator) as f:
	exec(f.read(), {'__file__': activator})
from app import app

CGIHandler().run(app)