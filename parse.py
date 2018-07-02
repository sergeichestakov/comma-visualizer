import json
import os

def generateJSON():
    """
    Iterates through, parses, and reads every json file in trips directory

    returns:
        dictionary keyed by date as a string of the form YYYYMMDD
        that stores arrays of valid JSON strings containing the JSON object
        stored in every file corresponding to that day
    """
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
                trips[key].append(json.dumps(jsonObj))
            except:
                print('cannot open', filename)

    return trips
