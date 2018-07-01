import json
import os

def generateJSON():
    DATA_DIR = './trips/'
    trips = {}

    for filename in os.listdir(DATA_DIR):
        if filename.endswith('.json'):
            basename, extension = os.path.splitext(filename)
            date, time = basename.split('--')

            year, month, day = date.split('-')
            hour, minute, second = time.split('-')

            try:
                json_file = open(DATA_DIR + filename,'r')
                jsonObj = json.load(json_file)
                key = year + month + day
                if key not in trips:
                    trips[key] = []
                trips[key].append(jsonObj)
            except:
                print('cannot open', filename)

    return trips
