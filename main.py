import parse
import sqlite3
from flask import Flask, render_template, jsonify, request, g

app = Flask(__name__)

DATABASE = 'db/trips.db'

@app.route('/')
def main():
    """
    Serve main html page with map
    """
    return render_template('index.html')

@app.route('/process', methods=['POST'])
def process():
    """
    Process date from input submission and query db for json objects corresponding to that date

    params:
        json containing date inputted as a string of the form YYYYMMDD
    returns:
        json containing array of the coordinates generated that day if they exist else empty json object
    """
    content = request.json
    date = content.get('date')

    curr = get_db().cursor()
    res = query_db(curr, date)

    return jsonify(trips=res)

def query_db(curr, date):
    sql = "SELECT * FROM trips WHERE date='{}'".format(date)
    curr.execute(sql)
    return curr.fetchall()

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

if __name__ == '__main__':
    app.run()
