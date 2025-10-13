# test_backend.py
import os
import django
import sys

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'AirBooking.settings')
django.setup()

from django.test import Client
from django.urls import reverse, get_resolver


def test_urls():
    client = Client()

    print("=== Testing Backend URLs ===")

    urls_to_test = [
        '/api/auth/register/',
        '/api/auth/login/',
        '/admin/',
        '/api/admin/users/pending/',
    ]

    for url in urls_to_test:
        try:
            if url == '/api/auth/register/':
                response = client.post(url, {
                    'username': 'test',
                    'email': 'test@test.com',
                    'password': 'test123',
                    'password2': 'test123',
                    'first_name': 'Test',
                    'last_name': 'User'
                }, content_type='application/json')
            else:
                response = client.get(url)
            print(f"✓ {url} - Status: {response.status_code}")
        except Exception as e:
            print(f"✗ {url} - Error: {e}")


def list_all_urls():
    print("\n=== All Registered URLs ===")
    resolver = get_resolver()
    for pattern in resolver.url_patterns:
        print(pattern.pattern)


if __name__ == '__main__':
    list_all_urls()
    test_urls()