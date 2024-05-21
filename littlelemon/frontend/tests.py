from django.test import LiveServerTestCase
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys

# Create your tests here.
class FrontendTest(LiveServerTestCase):
      
      @classmethod
      def setUpClass(cls):
            super().setUpClass()
            cls.browser = webdriver.Chrome()
      
      @classmethod
      def tearDownClass(cls):
            cls.browser.quit()
            super().tearDownClass()
            
      def test_title(self):
            self.browser.get(self.live_server_url)
            self.assertIn('Little Lemon', self.browser.title)
            
      def test_login(self):
            self.browser.get(self.live_server_url + '/login')
            username_input = self.browser.find_element(By.NAME,'username')
            password_input = self.browser.find_element(By.NAME, 'password')
            submit_button = self.browser.find_element(By.ID, 'login-submit')
            
            username_input.send_keys('testuser')
            password_input.send_keys('testpassword')
            submit_button.click()
            
            # Test will come later
            