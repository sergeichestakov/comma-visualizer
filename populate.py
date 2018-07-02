import parse
import sqlite3

class Populator():
    """
    Class to interface with and populate the SQLite database
    """

    DB = 'db/trips.db'
    def __init__(self, data):
        self.conn = sqlite3.connect(self.DB)
        self.cursor = self.conn.cursor()
        self.data = data

    def create_table(self):
        sql = "CREATE TABLE IF NOT EXISTS trips (date TEXT, json TEXT)"
        self.cursor.execute(sql)

    def add_entry(self, date, json):
        sql = "INSERT INTO trips VALUES (?,?)"
        row = (date, json)
        self.cursor.execute(sql, row)

    def run(self):
        """
        Create and populate db
        """
        self.create_table()

        for date, arr in self.data.items():
            for obj in arr:
                self.add_entry(date, obj)

        self.conn.commit()
        self.conn.close()

def main():
    trips = parse.generateJSON()
    populator = Populator(trips)
    populator.run()

if __name__ == '__main__':
    main()
