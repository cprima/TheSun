#!/usr/bin/env python

"""
This script generates the UTC-based datetime of
- sunrise
- sunset
for each day in the year and writes a JSON file with that information under the "data" key.
The indended usecase is to easily read this into JavaScript.
"""

import json
from pytz import timezone
import pytz
from datetime import datetime, timedelta
import ephem

__author__    = "Christian Prior"
__copyright__ = "Copyright 2016"
__credits__   = ["http://stackoverflow.com/questions/14288498/creating-a-loop-for-two-dates",
                "http://rhodesmill.org/pyephem/quick.html#transit-rising-setting",
                "http://stackoverflow.com/questions/455580/json-datetime-between-python-and-javascript",
                "http://www.recursion.org/d3-for-mere-mortals/"]
__license__   = "MIT"
__version__   = "0.0.9"


#import json
#d = datetime.datetime(2011, 5, 25, 13, 34, 5, 787000)
#json.dumps(d.isoformat())
#'"2011-05-25T13:34:05.787000"'
#var d = new Date("2011-05-25T13:34:05.787000");
#d.toJSON()

#timezone related
utc = pytz.utc
place1_tz = timezone('Europe/Berlin')
place2_tz = timezone('Asia/Yerevan')
place1_name = 'Rittershausen'
place2_name = 'Aboyvan'

#datetime related
fmt = '%Y-%m-%d %H:%M:%S %Z'
utc_jan1 = datetime(2016, 1, 1, 0, 0, 0, tzinfo=utc)
place1_jan1 = utc_jan1.astimezone(place1_tz)
place2_jan1 = utc_jan1.astimezone(place2_tz)
utc_dec31 = datetime(2016, 12, 31, 0, 0, 0, tzinfo=utc)
place1_dec31 = utc_dec31.astimezone(place1_tz)
place2_dec31 = utc_dec31.astimezone(place2_tz)
oneday = timedelta(days=1)

#PyEphem related
sun = ephem.Sun()
place1 = ephem.Observer()
place1.lat, place1.lon = '50.849396', '8.344960'
place1.elevation = 400
place2 = ephem.Observer()
place2.lat, place2.lon = '40.268208', '44.630508'
place2.elevation = 1000

#json related
date_handler = lambda obj: (
    obj.isoformat()
    if isinstance(obj, datetime)
    else None
)

#initialize return
returnlist = []

curdate = utc_jan1
while curdate <= utc_dec31:
  #print curdate.strftime('%Y-%m-%d')
  place1.date = curdate.strftime('%Y-%m-%d')
  #strictly speaking "UTC" is lost here, PyEphem uses UTC internally so returning .isoformat is as-expected.
  place2.date = curdate.strftime('%Y-%m-%d')
  #http://rhodesmill.org/pyephem/date.html
  #You can also ask a PyEphem date to convert itself the other direction by calling its datetime() method.
  retval = { 'date': curdate.strftime('%Y-%m-%d'),
              'utc_datetime': curdate.isoformat(),
              'place1_next_rising': place1.next_rising(sun).datetime().isoformat(),
              'place1_next_setting': place1.next_setting(sun).datetime().isoformat(),
              'place2_next_rising': place2.next_rising(sun).datetime().isoformat(),
              'place2_next_setting': place2.next_setting(sun).datetime().isoformat()
            }
  returnlist.append(retval)
  curdate = curdate + timedelta(days=1)

#writing into the file data_SunriseSunsetTwoPlaces.json
with open('./data/data_SunriseSunsetTwoPlaces.json', 'w') as fp:
  json.dump({'_comment': 'This file contains sunrise and sunset times at 2 distince places for each day in the year 2016.',
    '_place1': {'name': place1_name, 'lat': str.format("%s" % place1.lat), 'lon': str.format("%s" % place1.lon), 'timezone': place1_tz.zone},
    '_place2': {'name': place2_name, 'lat': str.format("%s" % place2.lat), 'lon': str.format("%s" % place2.lon), 'timezone': place2_tz.zone},
    'data': returnlist}, fp, default=date_handler, sort_keys=True, indent=2, separators=(',', ': '))
fp.close()
#
