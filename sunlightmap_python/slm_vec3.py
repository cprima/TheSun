class Vec3:
    X = None
    Y = None
    Z = None
    def __init__(self, x, y = None, z = None):
        if y is None:
            self.X = x.x
            self.Y = x.y
            self.Z = x.z
        else:
            self.X = x
            self.Y = y
            self.Z = z
    def dot(self, vec):
        return (self.X * vec.X) + (self.Y*vec.Y) + (self.Z*vec.Z)
    def add(self, vec):
        return Vec3(self.X + vec.X, self.Y + vec.Y, self.Z + vec.Z)
    def minus(self, vec):
        return Vec3(self.X - vec.X, self.Y - vec.Y, self.Z - vec.Z)
    def times(self, multiplier):
        return (self.X*multiplier) + (self.Y*multiplier) + (self.Z*multiplier)
    def normalize(self, to = 1):
        return True
    def lengthSquared():
        return True
    def length():
        return True
#    def copy():
#        return new Vec3(self)
