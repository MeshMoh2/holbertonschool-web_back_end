#!/usr/bin/env python3
"""Provide stats about Nginx logs stored in MongoDB (exact output format)."""
from pymongo import MongoClient


def log_stats():
    """Print stats for the 'logs.nginx' collection in the required format."""
    client = MongoClient('mongodb://127.0.0.1:27017')
    collection = client.logs.nginx

    total = collection.count_documents({})
    print(f"{total} logs")
    print("Methods:")
    for method in ["GET", "POST", "PUT", "PATCH", "DELETE"]:
        count = collection.count_documents({"method": method})
        print(f"\tmethod {method}: {count}")

    status_ok = collection.count_documents({"method": "GET", "path": "/status"})
    print(f"{status_ok} status check")


if __name__ == "__main__":
    log_stats()
