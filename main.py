import parse
from flask import Flask, render_template, g

app = Flask(__name__)

@app.route('/')
def main():
    trips = getattr(g, 'trips', None)
    if trips is None:
        trips = g.trips = parse.generateJSON()
    return render_template('index.html')

if __name__ == '__main__':
    app.run()
