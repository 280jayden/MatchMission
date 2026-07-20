import unittest, sys
sys.path.append('../backend') # imports python file
from app import app # imports flask app object

class BasicTests(unittest.TestCase):
    # Executed prior to each test
    def setUp(self):
        self.app = app.test_client() # create Flask’s test client

    def test_main_page(self):
        response = self.app.get('/', follow_redirects=True)
        self.assertEqual(response.status_code, 200)
    def test_blank1_page(self):
        response = self.app.get('/api/quiz/questions', follow_redirects=True)
        self.assertEqual(response.status_code, 200)
    def test_blank2_page(self):
        response = self.app.get('/', follow_redirects=True)
        self.assertEqual(response.status_code, 200)

if __name__ == "__main__":
    unittest.main()