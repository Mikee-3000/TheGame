import numpy as np

def interpolate(start_val, end_val, days, field_type):
    interpolatedValues =  np.linspace(start_val, end_val, days, dtype=field_type).tolist()
    return [round(v, 2) for v in interpolatedValues]
