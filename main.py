import parse
from flask import Flask, render_template, jsonify, request, g

app = Flask(__name__)

@app.route('/')
def main():
    trips = getattr(g, 'trips', None)
    if trips is None:
        trips = g.trips = parse.generateJSON()
    return render_template('index.html')

@app.route('/process', methods=['POST'])
def process():
    date = request.form.get('date')

    trips = getattr(g, 'trips', None)
    if trips and date in trips:
        return jsonify(trip=trips[date])

    return jsonify(trip='[]')

if __name__ == '__main__':
    app.run()
