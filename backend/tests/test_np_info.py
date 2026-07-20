import unittest, sys
sys.path.append('../backend')  # imports python file
from app import app  # imports flask app object

class ExtCardTests(unittest.TestCase):
    # Executed prior to each test
    def setUp(self):
        self.app = app.test_client()  # create Flask's test client

    def test_extended_card_info(self):
        # tests Feeding America nonprofit info - ein 363673599
        """
            "propublica": {
                    "subsectionCode": 3,
                    "nteeCode": "K310",
                    "foundedDate": "1990-01-01",
                    "latestFiling": {
                        "year": 2023,
                        "totalRevenue": 4916912461,
                        "totalExpenses": 4933690967,
                        "totalAssets": 626129732,
                        "totalLiabilities": 62229963
                    },
                    "historicalRevenue": [
                        { year: 2020, revenue: 4000000000 },
                        { year: 2021, revenue: 5000000000}...
                    ]
                }"""
        response = self.app.get('/api/org/363673599', follow_redirects=True)
        self.assertEqual(response.status_code, 200)

        data = response.get_json()
        self.assertIsNotNone(data, "Response body should be valid JSON")

        # every.org data present and correct org
        self.assertIn('nonprofit', data)
        self.assertEqual(data['nonprofit']['ein'], '363673599')
        self.assertEqual(data['nonprofit']['name'], 'Feeding America')

        # propublica data merged in under the expected key
        self.assertIn('propublica', data)

        propublica_data = data['propublica']
        self.assertIsNotNone(propublica_data)
        self.assertIn('latestFiling', propublica_data)
        self.assertIsNotNone(propublica_data['latestFiling']['totalRevenue'])
        self.assertEqual(len(propublica_data['historicalRevenue']), 12)


if __name__ == "__main__":
    unittest.main()