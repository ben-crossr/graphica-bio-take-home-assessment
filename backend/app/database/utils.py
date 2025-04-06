import numpy as np
import pandas as pd


def ensure_string(value):
    if isinstance(value, (list, np.ndarray)) and len(value) > 0:
        return str(value[0])
    elif isinstance(value, str):
        return value
    return None

def safe_float(val):
    try:
        return float(val) if pd.notna(val) and not np.isnan(val) else None
    except (ValueError, TypeError):
        return None

def safe_date(val):
    return str(val) if pd.notna(val) else None
