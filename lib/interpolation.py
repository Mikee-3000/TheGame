import numpy as np

def interpolate(start_val, end_val, days, field_type):
    return np.linspace(start_val, end_val, days, dtype=field_type).tolist()
