import re
import phonenumbers

from rest_framework import serializers

from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.core.validators import EmailValidator

from django.utils import timezone

from core.models import Menu
from core.models import Booking

# Validator defs for Menu and Booking models
def validate_no_html(value):
      if re.search('<.*?>', value) or re.search('&.*?;|%', value):
            raise serializers.ValidationError('Field may not contain HTML tags')
      return value

class MenuSerializer(serializers.ModelSerializer):
      class Meta:
            model = Menu
            fields = ['id', 'name', 'price', 'description']
           
      # validators 
      def validate_price(self, value):
            if value < 0:
                  raise serializers.ValidationError('Price must be greater than 0')
            return value
      
      def validate_name(self, value):
            if len(value) < 3:
                  raise serializers.ValidationError('Name must be at least 3 characters long')
            if len(value) > 100:
                  raise serializers.ValidationError('Name may not be longer than 100 characters')
            return validate_no_html(value)    
           
      def validate_description(self, value):
            return validate_no_html(value)
        
        
        
class BookingSerializer(serializers.ModelSerializer):
      class Meta:
            model = Booking
            fields = ['id', 'name', 'email', 'phone', 'date', 'time', 'number_of_people', 'message']
            
      # validators
      def validate_name(self, value):
            if len(value) < 3:
                  raise serializers.ValidationError('Name must be at least 3 characters long')
            if len(value) > 100:
                  raise serializers.ValidationError('Name may not be longer than 100 characters')
            return validate_no_html(value)
      
      def validate_email(self, value):
            try:
                  validate_email(value)
            except ValidationError:
                  raise serializers.ValidationError('Invalid email address')
            return value
      
      def validate_phone(self, value):
            try:
                  phone_number = phonenumbers.parse(value)
                  if not phonenumbers.is_valid_number(phone_number):
                        raise serializers.ValidationError('Invalid phone number')
            except phonenumbers.phonenumberutil.NumberParseException:
                  raise serializers.ValidationError('Invalid phone number')
            return value
      
      def validate_date(self, value):
            if value < timezone.now().date():
                  raise serializers.ValidationError('Date must be in the future')
            return value
      
      def validate(self, data):
            date = data['date']
            time = data['time']
            if date == timezone.now().date() and time < timezone.now().time():
                  raise serializers.ValidationError('Time must be in the future')
            return data
      
      def validate_number_of_people(self, value):
            if value < 1:
                  raise serializers.ValidationError('Number of people must be greater than 0')
            return value
      
      def validate_message(self, value):
            return validate_no_html(value)
      