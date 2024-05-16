from django.test import TestCase
from django.utils import timezone
from django.urls import reverse

from rest_framework.test import APITestCase
from rest_framework import status


from .serializers import MenuSerializer
from .serializers import BookingSerializer


# Create your tests here.
class BookingSerializerTestCase(TestCase):
      # Defines the valid data that will be used in the tests
      valid_data = {
            'name': 'John Doe',
            'email': 'email@email.com',
            'phone': '+46701234567',
            'date': '2025-01-01',
            'time': '12:00',
            'number_of_people': 2,
            'message': 'This is a test message'
      }
      data = valid_data.copy()
      def test_validate_name(self):
            data = self.valid_data.copy()
            # Test that the name field is required
            del data['name']
            serializer = BookingSerializer(data=data)
            self.assertFalse(serializer.is_valid())
            self.assertIn('name', serializer.errors)
            self.assertEqual(serializer.errors['name'][0], 'This field is required.')
            
            # Test that the name field must be at least 3 characters long
            data['name'] = 'ab'
            serializer = BookingSerializer(data=data)
            self.assertFalse(serializer.is_valid())
            self.assertIn('name', serializer.errors)
            self.assertEqual(serializer.errors['name'][0], 'Name must be at least 3 characters long')
            
            # Test that the name field may not be longer than 100 characters
            data['name'] = 'a' * 101
            serializer = BookingSerializer(data=data)
            self.assertFalse(serializer.is_valid())
            self.assertIn('name', serializer.errors)
            self.assertEqual(serializer.errors['name'][0].strip(), 'Ensure this field has no more than 100 characters.')
            
            # Test that the name field may not contain HTML
            data['name'] = '<script>alert("XSS")</script>'
            serializer = BookingSerializer(data=data)
            self.assertFalse(serializer.is_valid())
            self.assertIn('name', serializer.errors)
            self.assertEqual(serializer.errors['name'][0], 'Field may not contain HTML tags')

      def test_validate_email(self):
            data = self.valid_data.copy()
            # Test that the email field is required
            del data['email']
            serializer = BookingSerializer(data=data)
            self.assertFalse(serializer.is_valid())
            self.assertIn('email', serializer.errors)
            self.assertEqual(serializer.errors['email'][0], 'This field is required.')
            
            # Test that the email field must be a valid email address
            data['email'] = 'invalid-email'
            serializer = BookingSerializer(data=data)
            self.assertFalse(serializer.is_valid())
            self.assertIn('email', serializer.errors)
            self.assertEqual(serializer.errors['email'][0], 'Enter a valid email address.')
            
            # Test that a valid email address is accepted
            data['email'] = 'email@email.com'
            serializer = BookingSerializer(data=data)
            self.assertTrue(serializer.is_valid())
            
      def test_validate_phone(self):     
            data = self.valid_data.copy()
            # Test that the phone field is optional
            del data['phone']
            serializer = BookingSerializer(data=data)
            self.assertTrue(serializer.is_valid())
            
            # Test that the phone field must be a valid phone number
            data['phone'] = '3255'
            serializer = BookingSerializer(data=data)
            self.assertFalse(serializer.is_valid())
            self.assertIn('phone', serializer.errors)
            self.assertEqual(serializer.errors['phone'][0], 'Invalid phone number')
            
            # Test that a valid phone number is accepted
            data['phone'] = '+46701234567'
            serializer = BookingSerializer(data=data)
            self.assertTrue(serializer.is_valid())
            
      def test_validate_date(self):
            data = self.valid_data.copy()
            # Test that the date field is required
            del data['date']
            serializer = BookingSerializer(data=data)
            self.assertFalse(serializer.is_valid())
            self.assertIn('date', serializer.errors)
            self.assertEqual(serializer.errors['date'][0], 'This field is required.')
            
            # Test that the date field must be in the future
            data['date'] = '2020-01-01'
            serializer = BookingSerializer(data=data)
            self.assertFalse(serializer.is_valid())
            self.assertIn('date', serializer.errors)
            self.assertEqual(serializer.errors['date'][0], 'Date must be in the future')
            
            # Test that a valid date is accepted
            data['date'] = '2025-01-01'
            serializer = BookingSerializer(data=data)
            self.assertTrue(serializer.is_valid())
            
      def test_validate(self):
            data = self.valid_data.copy()
            # Test that the time field is required
            del data['time']
            serializer = BookingSerializer(data=data)
            self.assertFalse(serializer.is_valid())
            self.assertIn('time', serializer.errors)
            self.assertEqual(serializer.errors['time'][0], 'This field is required.')
            
            # Test that the time field must be in the future if the date is today
            data['date'] = timezone.now().date()
            data['time'] = (timezone.now() - timezone.timedelta(hours=1)).time()
            serializer = BookingSerializer(data=data)
            self.assertFalse(serializer.is_valid())
            self.assertIn('non_field_errors', serializer.errors)
            self.assertEqual(serializer.errors['non_field_errors'][0], 'Time must be in the future')
            
      def test_validate_number_of_people(self):
            data = self.valid_data.copy()
            # Test that the number_of_people field is required
            del data['number_of_people']
            serializer = BookingSerializer(data=data)
            self.assertFalse(serializer.is_valid())
            self.assertIn('number_of_people', serializer.errors)
            self.assertEqual(serializer.errors['number_of_people'][0], 'This field is required.')
            
            # Test that the number_of_people field must be greater than 0
            data['number_of_people'] = 0
            serializer = BookingSerializer(data=data)
            self.assertFalse(serializer.is_valid())
            self.assertIn('number_of_people', serializer.errors)
            self.assertEqual(serializer.errors['number_of_people'][0], 'Number of people must be greater than 0')
            
            # Test that a valid number of people is accepted
            data['number_of_people'] = 2
            serializer = BookingSerializer(data=data)
            self.assertTrue(serializer.is_valid())
            
      def test_validate_message(self):
            data = self.valid_data.copy()
            # Test that the message field is optional
            del data['message']
            serializer = BookingSerializer(data=data)
            self.assertTrue(serializer.is_valid())
            
            # Test that the message field may not contain HTML
            data['message'] = '<script>alert("XSS")</script>'
            serializer = BookingSerializer(data=data)
            self.assertFalse(serializer.is_valid())
            self.assertIn('message', serializer.errors)
            self.assertEqual(serializer.errors['message'][0], 'Field may not contain HTML tags')
            
            # Test that a valid message is accepted
            data['message'] = 'This is a test message'
            serializer = BookingSerializer(data=data)
            self.assertTrue(serializer.is_valid())
            
class MenuSerializerTestCase(TestCase):
      # Defines the valid data that will be used in the tests
      valid_data = {
            'name': 'Hamburger',
            'description': 'A delicious hamburger',
            'price': '10.00'
      }
      
      def test_validate_name(self):
            data = self.valid_data.copy()
            # Test that the name field is required
            del data['name']
            serializer = MenuSerializer(data=data)
            self.assertFalse(serializer.is_valid())
            self.assertIn('name', serializer.errors)
            self.assertEqual(serializer.errors['name'][0], 'This field is required.')
            
            # Test that the name field must be at least 3 characters long
            data['name'] = 'ab'
            serializer = MenuSerializer(data=data)
            self.assertFalse(serializer.is_valid())
            self.assertIn('name', serializer.errors)
            self.assertEqual(serializer.errors['name'][0], 'Name must be at least 3 characters long')
            
            # Test that the name field may not be longer than 100 characters
            data['name'] = 'a' * 101
            serializer = MenuSerializer(data=data)
            self.assertFalse(serializer.is_valid())
            self.assertIn('name', serializer.errors)
            self.assertEqual(serializer.errors['name'][0], 'Ensure this field has no more than 100 characters.')
            
            # Test that the name field may not contain HTML
            data['name'] = '<script>alert("XSS")</script>'
            serializer = MenuSerializer(data=data)
            self.assertFalse(serializer.is_valid())
            self.assertIn('name', serializer.errors)
            self.assertEqual(serializer.errors['name'][0], 'Field may not contain HTML tags')
            
            # Test that a valid name is accepted
            data['name'] = 'Hamburger'
            serializer = MenuSerializer(data=data)
            self.assertTrue(serializer.is_valid())
            
      def test_validate_price(self):
            data = self.valid_data.copy()
            # Test that the price field is required
            del data['price']
            serializer = MenuSerializer(data=data)
            self.assertFalse(serializer.is_valid())
            self.assertIn('price', serializer.errors)
            self.assertEqual(serializer.errors['price'][0], 'This field is required.')
            
            # Test that the price field must at least 0
            data['price'] = -1
            serializer = MenuSerializer(data=data)
            self.assertFalse(serializer.is_valid())
            self.assertIn('price', serializer.errors)
            self.assertEqual(serializer.errors['price'][0], 'Price must be greater than 0')
            
            # Test that a valid price is accepted
            data['price'] = 10.00
            serializer = MenuSerializer(data=data)
            self.assertTrue(serializer.is_valid())
            
      def test_validate_description(self):
            data = self.valid_data.copy()
            # Test that the description field is optional
            del data['description']
            serializer = MenuSerializer(data=data)
            self.assertTrue(serializer.is_valid())
            
            # Test that the description field may not contain HTML
            data['description'] = '<script>alert("XSS")</script>'
            serializer = MenuSerializer(data=data)
            self.assertFalse(serializer.is_valid())
            self.assertIn('description', serializer.errors)
            self.assertEqual(serializer.errors['description'][0], 'Field may not contain HTML tags')
            
            # Test that a valid description is accepted
            data['description'] = 'A delicious hamburger'
            serializer = MenuSerializer(data=data)
            self.assertTrue(serializer.is_valid())
            
# Tests to test the API views 
class BookingViewSetTestCase(APITestCase):
      def setUp(self):
            self.data = {
                  'name': 'John Doe',
                  'email': 'email@email.com',  
                  'phone': '+46701234567',
                  'date': '2025-01-01',
                  'time': '12:00:00',
                  'number_of_people': 2,
                  'message': 'This is a test message'
            }
            self.update_data = {
                  'name': 'Jane Doe',
                  'email': 'email@example.com',
                  'phone': '+46701234568',
                  'date': '2025-01-02',
                  'time': '13:00:00',
                  'number_of_people': 3,
                  'message': 'This is an updated test message'
            }
                        
      def test_create_booking(self):
            url = reverse('bookings-list')
            response = self.client.post(url, self.data)
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            self.data['id'] = response.data['id']
            self.assertEqual(response.data, self.data)
            
      def test_list_bookings(self):
            url = reverse('bookings-list')
            response = self.client.get(url)
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            
      def test_retrieve_booking(self):
            url = reverse('bookings-list')
            response = self.client.post(url, self.data)
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            booking_id = response.data['id']
            url = reverse('bookings-detail', args=[booking_id])
            response = self.client.get(url)
            self.data['id'] = booking_id
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(response.data, self.data)
            
      def test_update_booking(self):
            url = reverse('bookings-list')
            response = self.client.post(url, self.data)
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            booking_id = response.data['id']
            url = reverse('bookings-detail', args=[booking_id])
            self.update_data['id'] = booking_id
            response = self.client.put(url, self.update_data)
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(response.data, self.update_data)
            
      def test_delete_booking(self):
            url = reverse('bookings-list')
            response = self.client.post(url, self.data)
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            booking_id = response.data['id']
            url = reverse('bookings-detail', args=[booking_id])
            response = self.client.delete(url)
            self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
            
class MenuViewSetTestCase(APITestCase):
      def setUp(self):
            self.data = {
                  'name': 'Hamburger',
                  'description': 'A delicious hamburger',
                  'price': '10.00'
            }
            self.update_data = {
                  'name': 'Cheeseburger',
                  'description': 'A delicious cheeseburger',
                  'price': '12.00'
            }
      def test_create_menu(self):
            url = reverse('menu-list')
            response = self.client.post(url, self.data)
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            self.data['id'] = response.data['id']
            self.assertEqual(response.data, self.data)
            
      def test_list_menus(self):
            url = reverse('menu-list')
            response = self.client.get(url)
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            
      def test_retrieve_menu(self):
            url = reverse('menu-list')
            response = self.client.post(url, self.data)
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            menu_id = response.data['id']
            url = reverse('menu-detail', args=[menu_id])
            response = self.client.get(url)
            self.data['id'] = menu_id
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(response.data, self.data)
      
      def test_update_menu(self):
            url = reverse('menu-list')
            response = self.client.post(url, self.data)
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            menu_id = response.data['id']
            url = reverse('menu-detail', args=[menu_id])
            self.update_data['id'] = menu_id
            response = self.client.put(url, self.update_data)
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(response.data, self.update_data)
      
      def test_delete_menu(self):
            url = reverse('menu-list')
            response = self.client.post(url, self.data)
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            menu_id = response.data['id']
            url = reverse('menu-detail', args=[menu_id])
            response = self.client.delete(url)
            self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
      