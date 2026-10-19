#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script to periodically update Leju real estate data for bulletin board.
Runs daily at 07:00 AM Taipei Time (23:00 UTC previous day).
Maintains and prunes a rolling 180-day history.
"""

import json
import os
import sys
from datetime import datetime, timezone, timedelta

def get_taipei_time():
    tz = timezone(timedelta(hours=8))
    return datetime.now(tz)

def parse_date(date_str):
    try:
        return datetime.strptime(date_str[:10], "%Y-%m-%d").date()
    except Exception:
        return None

def prune_and_update_history(data, now):
    today_str = now.strftime("%Y-%m-%d")
    cutoff_date = (now - timedelta(days=180)).date()
    
    history = data.get("history", [])
    
    # Snapshot today's record
    yunpin_snapshot = {
        "recentPrice": data.get("yunpin", {}).get("recentPrice", "71.3"),
        "highestPrice": data.get("yunpin", {}).get("highestPrice", "76.05"),
        "listingsCount": len(data.get("yunpin", {}).get("listings", [])),
        "minPrice": data.get("yunpin", {}).get("currentForSaleMinPrice", "4198")
    }
    
    qianpin_snapshot = {
        "recentPrice": data.get("qianpin", {}).get("recentPrice", "76.01"),
        "highestPrice": data.get("qianpin", {}).get("highestPrice", "76.4"),
        "forSaleCount": data.get("qianpin", {}).get("forSaleCount", 0),
        "totalTransactions": data.get("qianpin", {}).get("totalTransactions", "201")
    }
    
    # Check if today already exists
    updated_today = False
    for item in history:
        if item.get("date") == today_str:
            item["timestamp"] = now.isoformat()
            item["yunpin"] = yunpin_snapshot
            item["qianpin"] = qianpin_snapshot
            updated_today = True
            break
            
    if not updated_today:
        history.append({
            "date": today_str,
            "timestamp": now.isoformat(),
            "yunpin": yunpin_snapshot,
            "qianpin": qianpin_snapshot
        })
        
    # Prune records older than 180 days
    filtered_history = []
    for item in history:
        d = parse_date(item.get("date", ""))
        if d and d >= cutoff_date:
            filtered_history.append(item)
            
    # Sort by date ascending
    filtered_history.sort(key=lambda x: x.get("date", ""))
    
    data["history"] = filtered_history
    data["historyRetentionDays"] = 180
    data["historyCount"] = len(filtered_history)

def update_real_estate_data():
    now = get_taipei_time()
    formatted_time = now.strftime("%Y/%m/%d %H:%M")
    iso_time = now.isoformat()

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    target_files = [
        os.path.join(base_dir, "data", "real-estate-data.json"),
        os.path.join(base_dir, "bulletin-board", "data", "real-estate-data.json")
    ]

    updated_any = False
    for data_path in target_files:
        if os.path.exists(data_path):
            print(f"Updating data file: {data_path}")
            try:
                with open(data_path, "r", encoding="utf-8") as f:
                    data = json.load(f)

                data["lastUpdated"] = iso_time
                data["lastUpdatedFormatted"] = formatted_time
                data["schedule"] = "每日 07:00 (UTC+8) 自動更新，保留過去 180 天紀錄"

                prune_and_update_history(data, now)

                with open(data_path, "w", encoding="utf-8") as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)

                print(f"Successfully updated timestamp to {formatted_time}, history count: {len(data['history'])}")
                updated_any = True
            except Exception as e:
                print(f"Error updating {data_path}: {e}", file=sys.stderr)

    if not updated_any:
        print("Warning: No real-estate-data.json found to update!")

if __name__ == "__main__":
    update_real_estate_data()
