from slm_vec3 import Vec3
from slm_sphere import Sphere
from datetime import datetime
import pytz


class slm:
    def __init__(self, datetimeobj = None):
        if datetimeobj is None:
            self.datetime = datetime(pytz.timezone('Europe/Berlin'))
        self.earth = Vec3(0,0,0)

