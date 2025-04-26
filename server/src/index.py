import os

from config import app
from routes import routes
from flask import Flask, url_for
from werkzeug.routing.exceptions import BuildError

app.register_blueprint(routes)


@app.route("/site-map")
def site_map():
    links = []
    for rule in app.url_map.iter_rules():
        # Skip the static endpoint which requires a filename parameter
        if rule.endpoint == 'static':
            continue
        try:
            url = url_for(rule.endpoint, **(rule.defaults or {}))
            links.append((url, rule.endpoint))
        except BuildError:
            # Skip endpoints that require additional parameters
            pass
    return {"links": links}


if __name__ == "__main__":
    app.run()
