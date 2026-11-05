#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script to periodically update Leju real estate metadata for bulletin board.
Runs daily at 07:00 AM Taipei Time (23:00 UTC previous day).
"""

import json
import os
import sys
from datetime import datetime, timezone, timedelta

def get_taipei_time():
    tz = timezone(timedelta(hours=8))
    return datetime.now(tz)

def update_real_estate_data():
    now = get_taipei_time()
    formatted_time = now.strftime("%Y/%m/%d %H:%M")
    iso_time = now.isoformat()

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    target_files = [
        os.path.join(base_dir, "data", "real-estate-data.json"),
        os.path.join(base_dir, "bulletin-board", "data", "real-estate-data.json")
    ]

    for data_path in target_files:
        if os.path.exists(data_path):
            try:
                with open(data_path, "r", encoding="utf-8") as f:
                    data = json.load(f)

                data["lastUpdated"] = iso_time
                data["lastUpdatedFormatted"] = formatted_time

                with open(data_path, "w", encoding="utf-8") as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)

                print(f"Successfully updated timestamp to {formatted_time}")
            except Exception as e:
                print(f"Error updating {data_path}: {e}", file=sys.stderr)

if __name__ == "__main__":
    update_real_estate_data()
